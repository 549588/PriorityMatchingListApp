using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PriorityMatchingList.Data;
using PriorityMatchingList.Models;
using PriorityMatchingList.ViewModels;
using PriorityMatchingListApp.Models;
using System.Security.Claims;

namespace PriorityMatchingList.Controllers
{
    [Authorize]
    public class ServiceOrderController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ServiceOrderController> _logger;

        public ServiceOrderController(ApplicationDbContext context, ILogger<ServiceOrderController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            // Get the current logged-in employee ID
            var employeeIdClaim = User.FindFirst("EmployeeID");
            if (employeeIdClaim == null)
            {
                return RedirectToAction("Login", "Auth");
            }

            int employeeId = int.Parse(employeeIdClaim.Value);

            // Get employee details
            var employee = await _context.Employees
                .Include(e => e.Supervisor)
                .FirstOrDefaultAsync(e => e.EmployeeID == employeeId);

            if (employee == null)
            {
                return NotFound("Employee not found");
            }

            // Define employee IDs who are authorized to view service orders
            // Based on your requirement: 104 should see service orders, 105 should not
            var authorizedEmployeeIds = new List<int> { 101, 102, 103, 104 }; // Managers who can view service orders
            
            List<ServiceOrder> serviceOrders = new List<ServiceOrder>();
            
            // Check if the current employee is authorized to view service orders
            if (authorizedEmployeeIds.Contains(employeeId))
            {
                _logger.LogInformation("Employee {EmployeeId} is authorized. Searching for service orders where HiringManager = {EmployeeId}", employeeId, employeeId);
                
                // First try to get service orders where the user is the HiringManager
                serviceOrders = await _context.ServiceOrders
                    .FromSqlRaw(@"SELECT ServiceOrderID, AccountName, Location, CCArole, HiringManager, 
                                  RequiredFrom, ClientEvaluation, SOState, AssignedToResource, Grade,
                                  NULL as EmployeeID, NULL as EmployeeID1
                                  FROM dbo.ServiceOrder 
                                  WHERE HiringManager = {0}
                                  ORDER BY ServiceOrderID DESC", employeeId)
                    .ToListAsync();
                    
                _logger.LogInformation("Found {Count} service orders for HiringManager = {EmployeeId}", serviceOrders.Count, employeeId);
            }
            else
            {
                _logger.LogInformation("Employee {EmployeeId} is NOT authorized to view service orders", employeeId);
            }
            // If not authorized (like employee 105), serviceOrders remains empty list

            // Get employee names for the service orders
            var employeeIds = serviceOrders
                .SelectMany(so => new[] { so.HiringManager, so.AssignedToResource })
                .Where(id => id.HasValue)
                .Select(id => id.Value)
                .Distinct()
                .ToList();

            var employees = await _context.Employees
                .Where(e => employeeIds.Contains(e.EmployeeID))
                .ToDictionaryAsync(e => e.EmployeeID, e => new { e.FirstName, e.LastName, e.EmailID });

            ViewBag.Employees = employees;

            // Check for InterviewSchedule redirects for all service orders
            var serviceOrderIds = serviceOrders.Select(so => so.ServiceOrderID).ToList();
            var interviewRedirects = new Dictionary<int, InterviewScheduleRedirect>();
            
            if (serviceOrderIds.Any())
            {
                // Use a more efficient approach - check each service order individually to avoid SQL injection
                foreach (var serviceOrderId in serviceOrderIds)
                {
                    var redirect = await _context.Database
                        .SqlQuery<InterviewScheduleRedirect>($@"
                            SELECT * FROM vw_InterviewScheduleRedirectRequired 
                            WHERE ServiceOrderID = {serviceOrderId}")
                        .FirstOrDefaultAsync();
                    
                    if (redirect != null)
                    {
                        interviewRedirects[serviceOrderId] = redirect;
                    }
                }
            }
            
            ViewBag.InterviewRedirects = interviewRedirects;

            // Get Priority Matching List items for current employee
            var priorityMatchingItems = await _context.PriorityMatchingListItems
                .Where(p => p.EmployeeID == employeeId)
                .Join(_context.ServiceOrders,
                    p => p.ServiceOrderID,
                    s => s.ServiceOrderID,
                    (p, s) => new AssociateWillingnessItem
                    {
                        MatchingListID = p.MatchingListID,
                        ServiceOrderID = p.ServiceOrderID,
                        EmployeeID = p.EmployeeID,
                        AccountName = s.AccountName,
                        Location = s.Location,
                        CCArole = s.CCArole,
                        RequiredFrom = s.RequiredFrom,
                        Grade = s.Grade,
                        MatchingIndexScore = p.MatchingIndexScore,
                        Remarks = p.Remarks,
                        Priority = p.Priority,
                        AssociateWilling = p.AssociateWilling
                    })
                .OrderBy(p => p.Priority ?? int.MaxValue)
                .ThenBy(p => p.ServiceOrderID)
                .ToListAsync();

            // Create view model
            var viewModel = new EmployeeServiceOrderViewModel
            {
                Employee = employee,
                ServiceOrders = serviceOrders,
                PriorityMatchingItems = priorityMatchingItems
            };

            return View(viewModel);
        }

        public async Task<IActionResult> Details(int id)
        {
            // Get the current logged-in employee ID
            var employeeIdClaim = User.FindFirst("EmployeeID");
            if (employeeIdClaim == null)
            {
                return RedirectToAction("Login", "Auth");
            }

            int employeeId = int.Parse(employeeIdClaim.Value);

            // Get service order details using raw SQL to avoid EF relationship issues
            var serviceOrder = await _context.ServiceOrders
                .FromSqlRaw(@"SELECT ServiceOrderID, AccountName, Location, CCArole, HiringManager, 
                              RequiredFrom, ClientEvaluation, SOState, AssignedToResource, Grade,
                              NULL as EmployeeID, NULL as EmployeeID1
                              FROM dbo.ServiceOrder 
                              WHERE ServiceOrderID = {0} AND HiringManager = {1}", id, employeeId)
                .FirstOrDefaultAsync();

            if (serviceOrder == null)
            {
                return NotFound("Service Order not found or access denied");
            }

            // Get employee information for HiringManager and AssignedToResource
            var employeeIds = new[] { serviceOrder.HiringManager, serviceOrder.AssignedToResource }
                .Where(id => id.HasValue)
                .Select(id => id.Value)
                .Distinct()
                .ToList();

            var employees = await _context.Employees
                .Where(e => employeeIds.Contains(e.EmployeeID))
                .ToDictionaryAsync(e => e.EmployeeID, e => new { e.FirstName, e.LastName, e.EmailID });

            ViewBag.Employees = employees;

            // Check for InterviewSchedule redirect requirement
            var interviewRedirect = await _context.Database
                .SqlQuery<InterviewScheduleRedirect>($@"
                    SELECT * FROM vw_InterviewScheduleRedirectRequired 
                    WHERE ServiceOrderID = {id}")
                .FirstOrDefaultAsync();

            // Set InterviewSchedule redirect information for the view
            if (interviewRedirect != null)
            {
                ViewBag.ShowInterviewScheduleLink = true;
                ViewBag.InterviewScheduleLink = interviewRedirect.InterviewScheduleRedirectLink;
                ViewBag.RedirectReason = interviewRedirect.RedirectReason;
                ViewBag.EmployeeName = interviewRedirect.EmployeeName;
            }
            else
            {
                ViewBag.ShowInterviewScheduleLink = false;
            }

            // Set specific ViewBag values for the view
            if (serviceOrder.AssignedToResource.HasValue && employees.ContainsKey(serviceOrder.AssignedToResource.Value))
            {
                var assignedResource = employees[serviceOrder.AssignedToResource.Value];
                ViewBag.AssignedResourceName = $"{assignedResource.FirstName} {assignedResource.LastName}";
            }
            else
            {
                ViewBag.AssignedResourceName = "Not assigned";
            }

            if (serviceOrder.HiringManager.HasValue && employees.ContainsKey(serviceOrder.HiringManager.Value))
            {
                var hiringManager = employees[serviceOrder.HiringManager.Value];
                ViewBag.HiringManagerName = $"{hiringManager.FirstName} {hiringManager.LastName}";
            }
            else
            {
                ViewBag.HiringManagerName = "Not assigned";
            }

            return View(serviceOrder);
        }

        // Get all service orders (for admin/supervisor view)
        [HttpGet]
        public async Task<IActionResult> All()
        {
            var serviceOrders = await _context.ServiceOrders
                .FromSqlRaw(@"SELECT ServiceOrderID, AccountName, Location, CCArole, HiringManager, 
                              RequiredFrom, ClientEvaluation, SOState, AssignedToResource, Grade,
                              NULL as EmployeeID, NULL as EmployeeID1
                              FROM dbo.ServiceOrder 
                              ORDER BY ServiceOrderID DESC")
                .ToListAsync();

            // Get employee names for all service orders
            var employeeIds = serviceOrders
                .SelectMany(so => new[] { so.HiringManager, so.AssignedToResource })
                .Where(id => id.HasValue)
                .Select(id => id.Value)
                .Distinct()
                .ToList();

            var employees = await _context.Employees
                .Where(e => employeeIds.Contains(e.EmployeeID))
                .ToDictionaryAsync(e => e.EmployeeID, e => new { e.FirstName, e.LastName, e.EmailID });

            ViewBag.Employees = employees;

            return View(serviceOrders);
        }

        // Get PriorityMatchingList for a specific ServiceOrder
        [HttpGet]
        public async Task<IActionResult> PriorityList(int serviceOrderId)
        {
            // Get the current logged-in employee ID
            var employeeIdClaim = User.FindFirst("EmployeeID");
            if (employeeIdClaim == null)
            {
                return RedirectToAction("Login", "Auth");
            }

            int employeeId = int.Parse(employeeIdClaim.Value);

            // Verify the service order belongs to the logged-in employee (as HiringManager)
            var serviceOrder = await _context.ServiceOrders
                .FromSqlRaw(@"SELECT ServiceOrderID, AccountName, Location, CCArole, HiringManager, 
                              RequiredFrom, ClientEvaluation, SOState, AssignedToResource, Grade,
                              NULL as EmployeeID, NULL as EmployeeID1
                              FROM dbo.ServiceOrder 
                              WHERE ServiceOrderID = {0} AND HiringManager = {1}", serviceOrderId, employeeId)
                .FirstOrDefaultAsync();

            if (serviceOrder == null)
            {
                return NotFound("Service Order not found or access denied");
            }

            // Get PriorityMatchingList data using raw SQL
            var priorityList = await _context.PriorityMatchingListItems
                .FromSqlRaw(@"SELECT MatchingListID, ServiceOrderID, EmployeeID, MatchingIndexScore, 
                              Remarks, Priority, AssociateWilling
                              FROM dbo.PriorityMatchingList 
                              WHERE ServiceOrderID = {0}
                              ORDER BY Priority ASC, MatchingIndexScore DESC", serviceOrderId)
                .ToListAsync();

            // Get employee details for the priority list - using raw SQL with DTO
            var employeeIds = priorityList.Select(p => p.EmployeeID).Distinct().ToList();
            
            // Use raw SQL with DTO to avoid EF complications
            var employees = new Dictionary<int, dynamic>();
            
            if (employeeIds.Any())
            {
                var employeeIdsList = string.Join(",", employeeIds);
                var sql = $@"SELECT EmployeeID, FirstName, LastName, EmailID, Grade, Location 
                            FROM dbo.Employee 
                            WHERE EmployeeID IN ({employeeIdsList})";
                
                using (var connection = _context.Database.GetDbConnection())
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var empId = reader.GetInt32(0); // EmployeeID
                                employees[empId] = new
                                {
                                    FirstName = reader.IsDBNull(1) ? "Unknown" : reader.GetString(1),
                                    LastName = reader.IsDBNull(2) ? "Employee" : reader.GetString(2),
                                    EmailID = reader.IsDBNull(3) ? null : reader.GetString(3),
                                    Grade = reader.IsDBNull(4) ? null : reader.GetString(4),
                                    Location = reader.IsDBNull(5) ? null : reader.GetString(5)
                                };
                            }
                        }
                    }
                }
            }

            ViewBag.ServiceOrder = serviceOrder;
            ViewBag.Employees = employees;

            return View(priorityList);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateWillingness(UpdateWillingnessViewModel model)
        {
            if (!ModelState.IsValid)
            {
                TempData["ErrorMessage"] = "Invalid data submitted.";
                return RedirectToAction("Index");
            }

            // Get the current logged-in employee ID
            var employeeIdClaim = User.FindFirst("EmployeeID");
            if (employeeIdClaim == null)
            {
                return RedirectToAction("Login", "Auth");
            }

            int employeeId = int.Parse(employeeIdClaim.Value);

            try
            {
                _logger.LogInformation("Starting willingness update for employee {EmployeeId}", employeeId);
                _logger.LogInformation("Received {ItemCount} items to update", model.Items?.Count ?? 0);

                if (model.Items == null || !model.Items.Any())
                {
                    TempData["ErrorMessage"] = "No items to update.";
                    return RedirectToAction("Index");
                }

                int updatedCount = 0;

                // Use ExecuteUpdate to avoid trigger issues (EF Core 7+ feature)
                // If this doesn't work, fall back to raw SQL
                foreach (var item in model.Items)
                {
                    _logger.LogInformation("Processing MatchingListID {MatchingListID} with IsWilling {IsWilling}", 
                        item.MatchingListID, item.IsWilling);

                    try
                    {
                        // Try using ExecuteUpdate first (modern EF Core approach)
                        var rowsAffected = await _context.PriorityMatchingListItems
                            .Where(p => p.MatchingListID == item.MatchingListID && p.EmployeeID == employeeId)
                            .ExecuteUpdateAsync(s => s.SetProperty(b => b.AssociateWilling, item.IsWilling));

                        if (rowsAffected > 0)
                        {
                            updatedCount++;
                            _logger.LogInformation("Updated MatchingListID {MatchingListID} to {IsWilling} using ExecuteUpdate", 
                                item.MatchingListID, item.IsWilling);
                        }
                        else
                        {
                            _logger.LogWarning("No rows affected for MatchingListID {MatchingListID} and EmployeeID {EmployeeId}", 
                                item.MatchingListID, employeeId);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "ExecuteUpdate failed for MatchingListID {MatchingListID}, falling back to raw SQL", item.MatchingListID);
                        
                        // Fallback to raw SQL if ExecuteUpdate fails
                        var rowsAffected = await _context.Database.ExecuteSqlRawAsync(
                            "UPDATE [dbo].[PriorityMatchingList] SET [AssociateWilling] = {0} WHERE [MatchingListID] = {1} AND [EmployeeID] = {2}",
                            item.IsWilling ? 1 : 0, item.MatchingListID, employeeId);

                        if (rowsAffected > 0)
                        {
                            updatedCount++;
                            _logger.LogInformation("Updated MatchingListID {MatchingListID} to {IsWilling} using raw SQL", 
                                item.MatchingListID, item.IsWilling);
                        }
                    }
                }

                if (updatedCount > 0)
                {
                    _logger.LogInformation("Successfully updated {UpdatedCount} records in database", updatedCount);
                    
                    // Create a more detailed success message
                    var willingCount = model.Items.Count(i => i.IsWilling);
                    var notWillingCount = model.Items.Count(i => !i.IsWilling);
                    
                    var successMessage = $"✅ Willingness preferences updated successfully! ";
                    successMessage += $"({updatedCount} service orders processed: ";
                    successMessage += $"{willingCount} willing, {notWillingCount} not willing)";
                    
                    TempData["SuccessMessage"] = successMessage;
                }
                else
                {
                    TempData["ErrorMessage"] = "No matching records found to update.";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating willingness for employee {EmployeeId}", employeeId);
                TempData["ErrorMessage"] = $"An error occurred while updating your preferences: {ex.Message}";
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public IActionResult DebugWillingness(UpdateWillingnessViewModel model)
        {
            var employeeIdClaim = User.FindFirst("EmployeeID");
            int employeeId = employeeIdClaim != null ? int.Parse(employeeIdClaim.Value) : 0;

            var items = model?.Items?.Select(i => new { i.MatchingListID, i.IsWilling }).ToList();

            var debug = new
            {
                EmployeeId = employeeId,
                ModelState = ModelState.IsValid,
                ItemsCount = model?.Items?.Count ?? 0,
                Items = items
            };

            return Json(debug);
        }
        
        // Debug action to check employee data
        [HttpGet]
        public async Task<IActionResult> CheckEmployee(int employeeId = 105)
        {
            var employee = await _context.Employees.FindAsync(employeeId);
            if (employee == null)
            {
                return Content($"Employee {employeeId} not found in database");
            }
            
            return Content($@"Employee {employeeId} found:
                Name: {employee.FirstName} {employee.LastName}
                Grade: {employee.Grade ?? "NULL"}
                Location: {employee.Location ?? "NULL"}
                Email: {employee.EmailID ?? "NULL"}
                SupervisorID: {employee.SupervisorID?.ToString() ?? "NULL"}");
        }
    }
}
