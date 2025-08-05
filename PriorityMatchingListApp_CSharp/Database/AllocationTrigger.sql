-- =============================================
-- Trigger: Auto Allocation Management
-- Purpose: Automatically create allocations when AssociateWilling=Yes and ClientEvaluation=No
-- =============================================

-- Drop existing views first to avoid conflicts
IF OBJECT_ID('[dbo].[vw_AllocationSummary]', 'V') IS NOT NULL
    DROP VIEW [dbo].[vw_AllocationSummary];
GO

IF OBJECT_ID('[dbo].[vw_InterviewScheduleRedirectRequired]', 'V') IS NOT NULL
    DROP VIEW [dbo].[vw_InterviewScheduleRedirectRequired];
GO

-- Drop existing triggers if they exist
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_AutoAllocation_PriorityMatchingList')
    DROP TRIGGER [dbo].[trg_AutoAllocation_PriorityMatchingList];
GO

-- First, let's create the trigger on PriorityMatchingList table
CREATE TRIGGER [dbo].[trg_AutoAllocation_PriorityMatchingList]
ON [dbo].[PriorityMatchingList]
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Process records where AssociateWilling changed to 'Yes' (1)
    INSERT INTO [dbo].[Allocation] (
        [AllocationID],
        [ServiceOrderID],
        [EmployeeID], 
        [AllocationStartDate],
        [AllocationEndDate],
        [PercentageOfAllocation]
    )
    SELECT DISTINCT
        ISNULL((SELECT MAX(AllocationID) FROM [dbo].[Allocation]), 0) + ROW_NUMBER() OVER (ORDER BY pml.[ServiceOrderID], pml.[EmployeeID]) AS [AllocationID],
        pml.[ServiceOrderID],
        pml.[EmployeeID],
        ISNULL(so.[RequiredFrom], GETDATE()) AS [AllocationStartDate],
        DATEADD(MONTH, 6, ISNULL(so.[RequiredFrom], GETDATE())) AS [AllocationEndDate],
        100 AS [PercentageOfAllocation]
    FROM [dbo].[PriorityMatchingList] pml
    INNER JOIN [dbo].[ServiceOrder] so ON pml.[ServiceOrderID] = so.[ServiceOrderID]
    INNER JOIN inserted i ON pml.[ServiceOrderID] = i.[ServiceOrderID] AND pml.[EmployeeID] = i.[EmployeeID]
    WHERE pml.[AssociateWilling] = 1  -- Yes
      AND CAST(so.[ClientEvaluation] AS VARCHAR(10)) = 'No'
      AND CAST(so.[SOState] AS VARCHAR(50)) <> 'Closed'  -- Prevent duplicate processing
      AND pml.[ServiceOrderID] IS NOT NULL
      AND pml.[EmployeeID] IS NOT NULL
      AND NOT EXISTS (
          -- Prevent duplicate allocations
          SELECT 1 FROM [dbo].[Allocation] a 
          WHERE a.[ServiceOrderID] = pml.[ServiceOrderID] 
            AND a.[EmployeeID] = pml.[EmployeeID]
      );
    
    -- Update ServiceOrder table
    UPDATE [dbo].[ServiceOrder]
    SET 
        [SOState] = 'Closed',
        [AssignedToResource] = pml.[EmployeeID]
    FROM [dbo].[ServiceOrder] so
    INNER JOIN [dbo].[PriorityMatchingList] pml ON so.[ServiceOrderID] = pml.[ServiceOrderID]
    INNER JOIN inserted i ON pml.[ServiceOrderID] = i.[ServiceOrderID] AND pml.[EmployeeID] = i.[EmployeeID]
    WHERE pml.[AssociateWilling] = 1  -- Yes
      AND CAST(so.[ClientEvaluation] AS VARCHAR(10)) = 'No'
      AND CAST(so.[SOState] AS VARCHAR(50)) <> 'Closed';  -- Prevent unnecessary updates
    
    -- Update Employee table - Set AvailableForDeployment to 0
    UPDATE [dbo].[Employee]
    SET [AvailableForDeployment] = 0
    FROM [dbo].[Employee] emp
    INNER JOIN [dbo].[PriorityMatchingList] pml ON emp.[EmployeeID] = pml.[EmployeeID]
    INNER JOIN [dbo].[ServiceOrder] so ON pml.[ServiceOrderID] = so.[ServiceOrderID]
    INNER JOIN inserted i ON pml.[ServiceOrderID] = i.[ServiceOrderID] AND pml.[EmployeeID] = i.[EmployeeID]
    WHERE pml.[AssociateWilling] = 1  -- Yes
      AND CAST(so.[ClientEvaluation] AS VARCHAR(10)) = 'No'
      AND emp.[AvailableForDeployment] = 1;  -- Only update if currently available
END;
GO

-- =============================================
-- Trigger: Auto Allocation Management for ServiceOrder
-- Purpose: Handle cases where ClientEvaluation changes to 'No'
-- =============================================

-- Drop existing trigger if it exists
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_AutoAllocation_ServiceOrder')
    DROP TRIGGER [dbo].[trg_AutoAllocation_ServiceOrder];
GO

CREATE TRIGGER [dbo].[trg_AutoAllocation_ServiceOrder]
ON [dbo].[ServiceOrder]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Only process when ClientEvaluation changes to 'No'
    IF UPDATE([ClientEvaluation])
    BEGIN
        -- Process records where ClientEvaluation changed to 'No' and there are willing associates
        INSERT INTO [dbo].[Allocation] (
            [AllocationID],
            [ServiceOrderID],
            [EmployeeID], 
            [AllocationStartDate],
            [AllocationEndDate],
            [PercentageOfAllocation]
        )
        SELECT DISTINCT
            ISNULL((SELECT MAX(AllocationID) FROM [dbo].[Allocation]), 0) + ROW_NUMBER() OVER (ORDER BY so.[ServiceOrderID], pml.[EmployeeID]) AS [AllocationID],
            so.[ServiceOrderID],
            pml.[EmployeeID],
            ISNULL(so.[RequiredFrom], GETDATE()) AS [AllocationStartDate],
            DATEADD(MONTH, 6, ISNULL(so.[RequiredFrom], GETDATE())) AS [AllocationEndDate],
            100 AS [PercentageOfAllocation]
        FROM [dbo].[ServiceOrder] so
        INNER JOIN [dbo].[PriorityMatchingList] pml ON so.[ServiceOrderID] = pml.[ServiceOrderID]
        INNER JOIN inserted i ON so.[ServiceOrderID] = i.[ServiceOrderID]
        WHERE CAST(so.[ClientEvaluation] AS VARCHAR(10)) = 'No'
          AND pml.[AssociateWilling] = 1  -- Yes
          AND CAST(so.[SOState] AS VARCHAR(50)) <> 'Closed'  -- Prevent duplicate processing
          AND so.[ServiceOrderID] IS NOT NULL
          AND pml.[EmployeeID] IS NOT NULL
          AND NOT EXISTS (
              -- Prevent duplicate allocations
              SELECT 1 FROM [dbo].[Allocation] a 
              WHERE a.[ServiceOrderID] = so.[ServiceOrderID] 
                AND a.[EmployeeID] = pml.[EmployeeID]
          );
        
        -- Update ServiceOrder table
        UPDATE [dbo].[ServiceOrder]
        SET 
            [SOState] = 'Closed',
            [AssignedToResource] = pml.[EmployeeID]
        FROM [dbo].[ServiceOrder] so
        INNER JOIN [dbo].[PriorityMatchingList] pml ON so.[ServiceOrderID] = pml.[ServiceOrderID]
        INNER JOIN inserted i ON so.[ServiceOrderID] = i.[ServiceOrderID]
        WHERE CAST(so.[ClientEvaluation] AS VARCHAR(10)) = 'No'
          AND pml.[AssociateWilling] = 1  -- Yes
          AND CAST(so.[SOState] AS VARCHAR(50)) <> 'Closed';  -- Prevent unnecessary updates
        
        -- Update Employee table - Set AvailableForDeployment to 0
        UPDATE [dbo].[Employee]
        SET [AvailableForDeployment] = 0
        FROM [dbo].[Employee] emp
        INNER JOIN [dbo].[PriorityMatchingList] pml ON emp.[EmployeeID] = pml.[EmployeeID]
        INNER JOIN [dbo].[ServiceOrder] so ON pml.[ServiceOrderID] = so.[ServiceOrderID]
        INNER JOIN inserted i ON so.[ServiceOrderID] = i.[ServiceOrderID]
        WHERE CAST(so.[ClientEvaluation] AS VARCHAR(10)) = 'No'
          AND pml.[AssociateWilling] = 1  -- Yes
          AND emp.[AvailableForDeployment] = 1;  -- Only update if currently available
    END;
END;
GO

-- =============================================
-- Trigger: InterviewSchedule Redirect Management
-- Purpose: Handle cases where AssociateWilling=Yes and ClientEvaluation=Yes
-- =============================================

-- Drop existing trigger if it exists
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_InterviewScheduleRedirect_PriorityMatchingList')
    DROP TRIGGER [dbo].[trg_InterviewScheduleRedirect_PriorityMatchingList];
GO

CREATE TRIGGER [dbo].[trg_InterviewScheduleRedirect_PriorityMatchingList]
ON [dbo].[PriorityMatchingList]
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Process records where AssociateWilling=Yes and ClientEvaluation=Yes
    -- Update a flag or create a notification record for UI to show InterviewSchedule link
    UPDATE [dbo].[ServiceOrder]
    SET 
        [SOState] = 'InterviewSchedule Redirect Required'
    FROM [dbo].[ServiceOrder] so
    INNER JOIN [dbo].[PriorityMatchingList] pml ON so.[ServiceOrderID] = pml.[ServiceOrderID]
    INNER JOIN inserted i ON pml.[ServiceOrderID] = i.[ServiceOrderID] AND pml.[EmployeeID] = i.[EmployeeID]
    WHERE pml.[AssociateWilling] = 1  -- Yes
      AND CAST(so.[ClientEvaluation] AS VARCHAR(10)) = 'Yes'
      AND CAST(so.[SOState] AS VARCHAR(50)) <> 'InterviewSchedule Redirect Required';  -- Prevent unnecessary updates
END;
GO

-- =============================================
-- Trigger: InterviewSchedule Redirect Management for ServiceOrder
-- Purpose: Handle cases where ClientEvaluation changes to 'Yes'
-- =============================================

-- Drop existing trigger if it exists
IF EXISTS (SELECT * FROM sys.triggers WHERE name = 'trg_InterviewScheduleRedirect_ServiceOrder')
    DROP TRIGGER [dbo].[trg_InterviewScheduleRedirect_ServiceOrder];
GO

CREATE TRIGGER [dbo].[trg_InterviewScheduleRedirect_ServiceOrder]
ON [dbo].[ServiceOrder]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Only process when ClientEvaluation changes to 'Yes'
    IF UPDATE([ClientEvaluation])
    BEGIN
        -- Update SOState for records where ClientEvaluation=Yes and there are willing associates
        UPDATE [dbo].[ServiceOrder]
        SET 
            [SOState] = 'InterviewSchedule Redirect Required'
        FROM [dbo].[ServiceOrder] so
        INNER JOIN [dbo].[PriorityMatchingList] pml ON so.[ServiceOrderID] = pml.[ServiceOrderID]
        INNER JOIN inserted i ON so.[ServiceOrderID] = i.[ServiceOrderID]
        WHERE CAST(so.[ClientEvaluation] AS VARCHAR(10)) = 'Yes'
          AND pml.[AssociateWilling] = 1  -- Yes
          AND CAST(so.[SOState] AS VARCHAR(50)) <> 'InterviewSchedule Redirect Required';  -- Prevent unnecessary updates
    END;
END;
GO

-- Drop the view if it exists
IF OBJECT_ID('[dbo].[vw_AllocationSummary]', 'V') IS NOT NULL
    DROP VIEW [dbo].[vw_AllocationSummary];
GO

CREATE VIEW [dbo].[vw_AllocationSummary]
AS
SELECT 
    a.[AllocationID],
    a.[ServiceOrderID],
    a.[EmployeeID],
    a.[AllocationStartDate],
    a.[AllocationEndDate],
    a.[PercentageOfAllocation],
    
    -- Employee Details
    e.[FirstName] + ' ' + e.[LastName] AS [EmployeeName],
    e.[EmailID] AS [EmployeeEmail],
    e.[Grade] AS [EmployeeGrade],
    e.[Location] AS [EmployeeLocation],
    e.[AvailableForDeployment],
    
    -- Service Order Details
    so.[AccountName],
    so.[Location] AS [ServiceLocation],
    so.[CCArole] AS [Role],
    so.[RequiredFrom],
    CAST(so.[SOState] AS VARCHAR(50)) AS [SOState],
    CAST(so.[ClientEvaluation] AS VARCHAR(10)) AS [ClientEvaluation],
    so.[HiringManager],
    so.[AssignedToResource],
    
    -- Hiring Manager Details
    hm.[FirstName] + ' ' + hm.[LastName] AS [HiringManagerName],
    hm.[EmailID] AS [HiringManagerEmail],
    
    -- Priority Matching Details
    pml.[Priority],
    pml.[MatchingIndexScore],
    pml.[AssociateWilling],
    CAST(pml.[Remarks] AS VARCHAR(500)) AS [Remarks],
    
    -- Calculated Fields
    DATEDIFF(DAY, a.[AllocationStartDate], a.[AllocationEndDate]) AS [AllocationDurationDays],
    CASE 
        WHEN a.[AllocationEndDate] > GETDATE() THEN 'Active'
        ELSE 'Completed'
    END AS [AllocationStatus]
    
FROM [dbo].[Allocation] a
INNER JOIN [dbo].[Employee] e ON a.[EmployeeID] = e.[EmployeeID]
INNER JOIN [dbo].[ServiceOrder] so ON a.[ServiceOrderID] = so.[ServiceOrderID]
LEFT JOIN [dbo].[Employee] hm ON so.[HiringManager] = hm.[EmployeeID]
LEFT JOIN [dbo].[PriorityMatchingList] pml ON a.[ServiceOrderID] = pml.[ServiceOrderID] 
                                          AND a.[EmployeeID] = pml.[EmployeeID];
GO

-- =============================================
-- View: InterviewSchedule Redirect View
-- Purpose: Display records that require InterviewSchedule redirection
-- =============================================

-- Drop the view if it exists
IF OBJECT_ID('[dbo].[vw_InterviewScheduleRedirectRequired]', 'V') IS NOT NULL
    DROP VIEW [dbo].[vw_InterviewScheduleRedirectRequired];
GO

CREATE VIEW [dbo].[vw_InterviewScheduleRedirectRequired]
AS
SELECT 
    so.[ServiceOrderID],
    so.[AccountName],
    so.[Location] AS [ServiceLocation],
    so.[CCArole] AS [Role],
    so.[RequiredFrom],
    CAST(so.[SOState] AS VARCHAR(50)) AS [SOState],
    CAST(so.[ClientEvaluation] AS VARCHAR(10)) AS [ClientEvaluation],
    so.[HiringManager],
    so.[AssignedToResource],
    
    -- Employee Details
    pml.[EmployeeID],
    e.[FirstName] + ' ' + e.[LastName] AS [EmployeeName],
    e.[EmailID] AS [EmployeeEmail],
    e.[Grade] AS [EmployeeGrade],
    e.[Location] AS [EmployeeLocation],
    
    -- Hiring Manager Details
    hm.[FirstName] + ' ' + hm.[LastName] AS [HiringManagerName],
    hm.[EmailID] AS [HiringManagerEmail],
    
    -- Priority Matching Details
    pml.[Priority],
    pml.[MatchingIndexScore],
    pml.[AssociateWilling],
    CAST(pml.[Remarks] AS VARCHAR(500)) AS [Remarks],
    
    -- InterviewSchedule Redirect Link (using GitHub link temporarily)
    'https://github.com/' AS [InterviewScheduleRedirectLink],
    'InterviewSchedule Redirect Required - AssociateWilling=Yes and ClientEvaluation=Yes' AS [RedirectReason],
    
    -- Status Information
    CASE 
        WHEN pml.[AssociateWilling] = 1 AND CAST(so.[ClientEvaluation] AS VARCHAR(10)) = 'Yes' 
        THEN 'REDIRECT_TO_INTERVIEWSCHEDULE'
        ELSE 'NO_REDIRECT'
    END AS [RedirectStatus]
    
FROM [dbo].[ServiceOrder] so
INNER JOIN [dbo].[PriorityMatchingList] pml ON so.[ServiceOrderID] = pml.[ServiceOrderID]
INNER JOIN [dbo].[Employee] e ON pml.[EmployeeID] = e.[EmployeeID]
LEFT JOIN [dbo].[Employee] hm ON so.[HiringManager] = hm.[EmployeeID]
WHERE pml.[AssociateWilling] = 1  -- Yes
  AND CAST(so.[ClientEvaluation] AS VARCHAR(10)) = 'Yes'
  AND CAST(so.[SOState] AS VARCHAR(50)) = 'InterviewSchedule Redirect Required';
GO

-- =============================================
-- Diagnostic Queries
-- Purpose: Check table structure and data before testing triggers
-- =============================================

-- Check Allocation table structure
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMNPROPERTY(OBJECT_ID(TABLE_SCHEMA+'.'+TABLE_NAME), COLUMN_NAME, 'IsIdentity') as IsIdentity
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Allocation' 
ORDER BY ORDINAL_POSITION;

-- Check if ServiceOrder 305 has required data
SELECT 
    so.[ServiceOrderID],
    so.[RequiredFrom],
    CAST(so.[ClientEvaluation] AS VARCHAR(10)) AS [ClientEvaluation],
    CAST(so.[SOState] AS VARCHAR(50)) AS [SOState]
FROM [dbo].[ServiceOrder] so
WHERE so.[ServiceOrderID] = 305;

-- Check if PriorityMatchingList has the employee record
SELECT 
    pml.[ServiceOrderID],
    pml.[EmployeeID],
    pml.[AssociateWilling]
FROM [dbo].[PriorityMatchingList] pml
WHERE pml.[ServiceOrderID] = 305 AND pml.[EmployeeID] = 105;

-- =============================================
-- Test Data Query
-- Purpose: Check current status before trigger execution
-- =============================================

-- Query to check current PriorityMatchingList and ServiceOrder status
SELECT 
    'Current Status - Before Trigger' AS [Status],
    pml.[ServiceOrderID],
    pml.[EmployeeID],
    pml.[AssociateWilling],
    CAST(so.[ClientEvaluation] AS VARCHAR(10)) AS [ClientEvaluation],
    CAST(so.[SOState] AS VARCHAR(50)) AS [SOState],
    so.[AssignedToResource],
    e.[AvailableForDeployment],
    e.[FirstName] + ' ' + e.[LastName] AS [EmployeeName]
FROM [dbo].[PriorityMatchingList] pml
INNER JOIN [dbo].[ServiceOrder] so ON pml.[ServiceOrderID] = so.[ServiceOrderID]
INNER JOIN [dbo].[Employee] e ON pml.[EmployeeID] = e.[EmployeeID]
WHERE pml.[ServiceOrderID] IN (302, 305)
ORDER BY pml.[ServiceOrderID], pml.[Priority];

-- =============================================
-- COMPREHENSIVE TEST SCRIPT FOR INTERVIEWSCHEDULE REDIRECT
-- Purpose: Test the InterviewSchedule redirect functionality step by step
-- =============================================

-- STEP 1: Check current status before test
PRINT '=== STEP 1: CHECKING CURRENT STATUS BEFORE TEST ==='
SELECT 
    'BEFORE TEST - Current Status' AS [TestPhase],
    pml.[ServiceOrderID],
    pml.[EmployeeID],
    pml.[AssociateWilling],
    CAST(so.[ClientEvaluation] AS VARCHAR(10)) AS [ClientEvaluation],
    CAST(so.[SOState] AS VARCHAR(50)) AS [SOState],
    e.[FirstName] + ' ' + e.[LastName] AS [EmployeeName]
FROM [dbo].[PriorityMatchingList] pml
INNER JOIN [dbo].[ServiceOrder] so ON pml.[ServiceOrderID] = so.[ServiceOrderID]
INNER JOIN [dbo].[Employee] e ON pml.[EmployeeID] = e.[EmployeeID]
WHERE pml.[ServiceOrderID] IN (302, 305)
ORDER BY pml.[ServiceOrderID], pml.[Priority];

-- STEP 2: Set up test data - Set ClientEvaluation to 'Yes' for ServiceOrder 302
PRINT '=== STEP 2: SETTING UP TEST DATA - ClientEvaluation = Yes ==='
UPDATE [dbo].[ServiceOrder] 
SET [ClientEvaluation] = 'Yes',
    [SOState] = 'Open'  -- Reset state for testing
WHERE [ServiceOrderID] = 302;

PRINT 'ClientEvaluation updated to Yes for ServiceOrder 302'

-- STEP 3: Verify the setup
PRINT '=== STEP 3: VERIFYING TEST SETUP ==='
SELECT 
    'AFTER SETUP - ClientEvaluation Updated' AS [TestPhase],
    so.[ServiceOrderID],
    CAST(so.[ClientEvaluation] AS VARCHAR(10)) AS [ClientEvaluation],
    CAST(so.[SOState] AS VARCHAR(50)) AS [SOState]
FROM [dbo].[ServiceOrder] so
WHERE so.[ServiceOrderID] = 302;

-- STEP 4: Trigger the InterviewSchedule redirect by setting AssociateWilling = Yes
PRINT '=== STEP 4: TRIGGERING INTERVIEWSCHEDULE REDIRECT ==='
PRINT 'Setting AssociateWilling = 1 (Yes) for ServiceOrder 302, Employee 101'

UPDATE [dbo].[PriorityMatchingList] 
SET [AssociateWilling] = 1  -- Yes
WHERE [ServiceOrderID] = 302 AND [EmployeeID] = 101;

PRINT 'Trigger executed - AssociateWilling updated to Yes'

-- STEP 5: Check if SOState was updated to 'InterviewSchedule Redirect Required'
PRINT '=== STEP 5: VERIFYING TRIGGER RESULTS ==='
SELECT 
    'AFTER TRIGGER - InterviewSchedule Redirect Check' AS [TestPhase],
    pml.[ServiceOrderID],
    pml.[EmployeeID],
    pml.[AssociateWilling],
    CAST(so.[ClientEvaluation] AS VARCHAR(10)) AS [ClientEvaluation],
    CAST(so.[SOState] AS VARCHAR(50)) AS [SOState],
    e.[FirstName] + ' ' + e.[LastName] AS [EmployeeName],
    CASE 
        WHEN CAST(so.[SOState] AS VARCHAR(50)) = 'InterviewSchedule Redirect Required' 
        THEN '✓ SUCCESS - Redirect Required'
        ELSE '✗ FAILED - No Redirect Triggered'
    END AS [TestResult]
FROM [dbo].[PriorityMatchingList] pml
INNER JOIN [dbo].[ServiceOrder] so ON pml.[ServiceOrderID] = so.[ServiceOrderID]
INNER JOIN [dbo].[Employee] e ON pml.[EmployeeID] = e.[EmployeeID]
WHERE pml.[ServiceOrderID] = 302 AND pml.[EmployeeID] = 101;

-- STEP 6: Check the InterviewSchedule redirect view
PRINT '=== STEP 6: CHECKING INTERVIEWSCHEDULE REDIRECT VIEW ==='
SELECT 
    'InterviewSchedule Redirect View Results' AS [TestPhase],
    [ServiceOrderID],
    [EmployeeID],
    [EmployeeName],
    [AccountName],
    [Role],
    [InterviewScheduleRedirectLink],
    [RedirectReason],
    [RedirectStatus]
FROM [dbo].[vw_InterviewScheduleRedirectRequired]
WHERE [ServiceOrderID] = 302;

-- STEP 7: Test alternative scenario - Update ClientEvaluation from ServiceOrder side
PRINT '=== STEP 7: TESTING ALLOCATION CREATION (ClientEvaluation = No) ==='
PRINT 'Testing allocation creation when ClientEvaluation = No and AssociateWilling = Yes'

-- Reset ServiceOrder 305 for allocation test - Set ClientEvaluation to 'No'
UPDATE [dbo].[ServiceOrder] 
SET [ClientEvaluation] = 'No', 
    [SOState] = 'Open',
    [AssignedToResource] = NULL
WHERE [ServiceOrderID] = 305;

PRINT 'ServiceOrder 305 ClientEvaluation set to No for allocation test'

-- Reset AssociateWilling first to 0, then set to 1 to trigger the allocation trigger
UPDATE [dbo].[PriorityMatchingList] 
SET [AssociateWilling] = 0 
WHERE [ServiceOrderID] = 305 AND [EmployeeID] = 105;

-- Now set AssociateWilling to Yes for the allocation trigger
UPDATE [dbo].[PriorityMatchingList] 
SET [AssociateWilling] = 1 
WHERE [ServiceOrderID] = 305 AND [EmployeeID] = 105;

PRINT 'PriorityMatchingList AssociateWilling set to Yes - This should trigger allocation creation'

-- Verify the ServiceOrder 305 has correct values
PRINT 'Verifying ServiceOrder 305 setup:'
SELECT 
    'ServiceOrder 305 Setup Check' AS [TestPhase],
    so.[ServiceOrderID],
    CAST(so.[ClientEvaluation] AS VARCHAR(10)) AS [ClientEvaluation],
    CAST(so.[SOState] AS VARCHAR(50)) AS [SOState]
FROM [dbo].[ServiceOrder] so
WHERE so.[ServiceOrderID] = 305;

-- STEP 8: Verify allocation creation results
PRINT '=== STEP 8: VERIFYING ALLOCATION CREATION RESULTS ==='

-- First, let's verify the current state of the data
SELECT 
    'Current Data State Check' AS [TestPhase],
    pml.[ServiceOrderID],
    pml.[EmployeeID],
    pml.[AssociateWilling],
    CAST(so.[ClientEvaluation] AS VARCHAR(10)) AS [ClientEvaluation],
    CAST(so.[SOState] AS VARCHAR(50)) AS [SOState],
    so.[AssignedToResource],
    e.[FirstName] + ' ' + e.[LastName] AS [EmployeeName],
    e.[AvailableForDeployment]
FROM [dbo].[PriorityMatchingList] pml
INNER JOIN [dbo].[ServiceOrder] so ON pml.[ServiceOrderID] = so.[ServiceOrderID]
INNER JOIN [dbo].[Employee] e ON pml.[EmployeeID] = e.[EmployeeID]
WHERE pml.[ServiceOrderID] = 305 AND pml.[EmployeeID] = 105;

-- Now check the allocation creation results
SELECT 
    'Allocation Creation Test Results' AS [TestPhase],
    pml.[ServiceOrderID],
    pml.[EmployeeID],
    pml.[AssociateWilling],
    CAST(so.[ClientEvaluation] AS VARCHAR(10)) AS [ClientEvaluation],
    CAST(so.[SOState] AS VARCHAR(50)) AS [SOState],
    so.[AssignedToResource],
    e.[FirstName] + ' ' + e.[LastName] AS [EmployeeName],
    e.[AvailableForDeployment],
    CASE 
        WHEN CAST(so.[SOState] AS VARCHAR(50)) = 'Closed' AND CAST(so.[ClientEvaluation] AS VARCHAR(10)) = 'No'
        THEN '✓ SUCCESS - ServiceOrder Closed (Allocation Created)'
        WHEN CAST(so.[ClientEvaluation] AS VARCHAR(10)) <> 'No'
        THEN '✗ FAILED - ClientEvaluation is not No'
        ELSE '✗ FAILED - ServiceOrder Not Closed'
    END AS [TestResult]
FROM [dbo].[PriorityMatchingList] pml
INNER JOIN [dbo].[ServiceOrder] so ON pml.[ServiceOrderID] = so.[ServiceOrderID]
INNER JOIN [dbo].[Employee] e ON pml.[EmployeeID] = e.[EmployeeID]
WHERE pml.[ServiceOrderID] = 305 AND pml.[EmployeeID] = 105;

-- Check if allocation was created
PRINT '=== STEP 8.1: CHECKING ALLOCATION TABLE ==='
SELECT 
    'Allocation Check' AS [TestPhase],
    a.[AllocationID],
    a.[ServiceOrderID],
    a.[EmployeeID],
    a.[AllocationStartDate],
    a.[AllocationEndDate],
    a.[PercentageOfAllocation],
    e.[FirstName] + ' ' + e.[LastName] AS [EmployeeName]
FROM [dbo].[Allocation] a
INNER JOIN [dbo].[Employee] e ON a.[EmployeeID] = e.[EmployeeID]
WHERE a.[ServiceOrderID] = 305 AND a.[EmployeeID] = 105;

-- Check allocation summary view
PRINT '=== STEP 8.2: CHECKING ALLOCATION SUMMARY VIEW ==='
SELECT 
    'Allocation Summary View Check' AS [TestPhase],
    [ServiceOrderID],
    [EmployeeID],
    [EmployeeName],
    [AccountName],
    [Role],
    [AllocationStartDate],
    [AllocationEndDate],
    [AllocationStatus],
    [SOState],
    [ClientEvaluation]
FROM [dbo].[vw_AllocationSummary]
WHERE [ServiceOrderID] = 305;

-- STEP 9: Final view check - All InterviewSchedule redirects
PRINT '=== STEP 9: FINAL CHECK - ALL INTERVIEWSCHEDULE REDIRECTS ==='
SELECT 
    'All InterviewSchedule Redirects' AS [TestPhase],
    [ServiceOrderID],
    [EmployeeID],
    [EmployeeName],
    [AccountName],
    [Role],
    [InterviewScheduleRedirectLink],
    [RedirectStatus]
FROM [dbo].[vw_InterviewScheduleRedirectRequired]
ORDER BY [ServiceOrderID];

-- STEP 10: Summary report
PRINT '=== STEP 10: TEST SUMMARY REPORT ==='
SELECT 
    'TEST SUMMARY' AS [Report],
    COUNT(*) AS [TotalInterviewScheduleRedirects],
    STRING_AGG(CAST([ServiceOrderID] AS VARCHAR(10)), ', ') AS [ServiceOrdersWithRedirects]
FROM [dbo].[vw_InterviewScheduleRedirectRequired];

PRINT '=== TEST COMPLETED ==='
PRINT 'If you see records in the InterviewSchedule redirect view with RedirectStatus = REDIRECT_TO_INTERVIEWSCHEDULE,'
PRINT 'then the triggers are working correctly and the UI should display the InterviewSchedule link.'

-- Usage Examples and Test Commands

/*
-- Test the trigger by updating AssociateWilling to Yes for ServiceOrder 305 (which has ClientEvaluation = 'No')
UPDATE [dbo].[PriorityMatchingList] 
SET [AssociateWilling] = 1 
WHERE [ServiceOrderID] = 305 AND [EmployeeID] = 105;

-- Check the allocation view after trigger execution
SELECT * FROM [dbo].[vw_AllocationSummary] 
WHERE [ServiceOrderID] = 305;

-- Check updated status
SELECT 
    'After Trigger Execution' AS [Status],
    pml.[ServiceOrderID],
    pml.[EmployeeID],
    pml.[AssociateWilling],
    CAST(so.[ClientEvaluation] AS VARCHAR(10)) AS [ClientEvaluation],
    CAST(so.[SOState] AS VARCHAR(50)) AS [SOState],
    so.[AssignedToResource],
    e.[AvailableForDeployment],
    e.[FirstName] + ' ' + e.[LastName] AS [EmployeeName]
FROM [dbo].[PriorityMatchingList] pml
INNER JOIN [dbo].[ServiceOrder] so ON pml.[ServiceOrderID] = so.[ServiceOrderID]
INNER JOIN [dbo].[Employee] e ON pml.[EmployeeID] = e.[EmployeeID]
WHERE pml.[ServiceOrderID] = 305;

-- View all allocations
SELECT * FROM [dbo].[vw_AllocationSummary] 
ORDER BY [AllocationStartDate] DESC;

-- View InterviewSchedule redirect required records
SELECT * FROM [dbo].[vw_InterviewScheduleRedirectRequired] 
ORDER BY [ServiceOrderID];

-- Test the InterviewSchedule redirect trigger by updating AssociateWilling to Yes for a record with ClientEvaluation = 'Yes'
-- First, set ClientEvaluation to 'Yes' for a ServiceOrder
UPDATE [dbo].[ServiceOrder] 
SET [ClientEvaluation] = 'Yes' 
WHERE [ServiceOrderID] = 302;

-- Then update AssociateWilling to trigger the InterviewSchedule redirect
UPDATE [dbo].[PriorityMatchingList] 
SET [AssociateWilling] = 1 
WHERE [ServiceOrderID] = 302 AND [EmployeeID] = 101;

-- Check the InterviewSchedule redirect view
SELECT * FROM [dbo].[vw_InterviewScheduleRedirectRequired];

-- Check updated ServiceOrder status
SELECT 
    [ServiceOrderID],
    CAST([SOState] AS VARCHAR(50)) AS [SOState],
    CAST([ClientEvaluation] AS VARCHAR(10)) AS [ClientEvaluation]
FROM [dbo].[ServiceOrder] 
WHERE [ServiceOrderID] = 302;
*/
