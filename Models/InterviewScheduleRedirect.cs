using System.ComponentModel.DataAnnotations;

namespace PriorityMatchingListApp.Models
{
    public class InterviewScheduleRedirect
    {
        public int ServiceOrderID { get; set; }
        public string? AccountName { get; set; }
        public string? ServiceLocation { get; set; }
        public string? Role { get; set; }
        public DateTime? RequiredFrom { get; set; }
        public string? SOState { get; set; }
        public string? ClientEvaluation { get; set; }
        public int? HiringManager { get; set; }
        public int? AssignedToResource { get; set; }
        
        // Employee Details
        public int EmployeeID { get; set; }
        public string? EmployeeName { get; set; }
        public string? EmployeeEmail { get; set; }
        public string? EmployeeGrade { get; set; }
        public string? EmployeeLocation { get; set; }
        
        // Hiring Manager Details
        public string? HiringManagerName { get; set; }
        public string? HiringManagerEmail { get; set; }
        
        // Priority Matching Details
        public int? Priority { get; set; }
        public int? MatchingIndexScore { get; set; }  // Changed from decimal? to int? to match database int type
        public bool AssociateWilling { get; set; }  // Changed from int to bool to match database bit type
        public string? Remarks { get; set; }
        
        // InterviewSchedule Redirect Details
        public string? InterviewScheduleRedirectLink { get; set; }
        public string? RedirectReason { get; set; }
        public string? RedirectStatus { get; set; }
    }
}
