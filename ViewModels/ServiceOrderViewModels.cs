using PriorityMatchingList.Models;

namespace PriorityMatchingList.ViewModels
{
    public class EmployeeServiceOrderViewModel
    {
        public Employee Employee { get; set; } = new Employee();
        public List<ServiceOrder> ServiceOrders { get; set; } = new List<ServiceOrder>();
        public List<AssociateWillingnessItem> PriorityMatchingItems { get; set; } = new List<AssociateWillingnessItem>();
    }

    public class AssociateWillingnessItem
    {
        public int MatchingListID { get; set; }
        public int ServiceOrderID { get; set; }
        public int EmployeeID { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string CCArole { get; set; } = string.Empty;
        public DateTime? RequiredFrom { get; set; }
        public string Grade { get; set; } = string.Empty;
        public int? MatchingIndexScore { get; set; }
        public string? Remarks { get; set; }
        public int? Priority { get; set; }
        public bool? AssociateWilling { get; set; }
    }

    public class UpdateWillingnessViewModel
    {
        public List<WillingnessUpdateItem> Items { get; set; } = new List<WillingnessUpdateItem>();
    }

    public class WillingnessUpdateItem
    {
        public int MatchingListID { get; set; }
        public bool IsWilling { get; set; }
    }
}
