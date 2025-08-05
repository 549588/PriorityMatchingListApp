using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PriorityMatchingList.Models
{
    [Table("Employee", Schema = "dbo")]
    public class Employee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EmployeeID { get; set; }

        [StringLength(100)]
        public string? FirstName { get; set; }

        [StringLength(100)]
        public string? LastName { get; set; }

        [ForeignKey("Supervisor")]
        public int? SupervisorID { get; set; }

        [StringLength(255)]
        public string? EmailID { get; set; }

        [Column(TypeName = "date")]
        public DateTime? DateofJoin { get; set; }

        [StringLength(50)]
        public string? Grade { get; set; }

        [StringLength(100)]
        public string? Location { get; set; }

        [StringLength(255)]
        public string? LocationPreference { get; set; }

        public bool? AvailableForDeployment { get; set; }

        // Navigation properties
        public virtual Employee? Supervisor { get; set; }
        public virtual ICollection<Employee> Subordinates { get; set; } = new List<Employee>();
        public virtual ICollection<User> Users { get; set; } = new List<User>();
        public virtual ICollection<ServiceOrder> ManagedServiceOrders { get; set; } = new List<ServiceOrder>();
        public virtual ICollection<ServiceOrder> AssignedServiceOrders { get; set; } = new List<ServiceOrder>();
        public virtual ICollection<PriorityMatchingListItem> PriorityMatchingListItems { get; set; } = new List<PriorityMatchingListItem>();
        public virtual ICollection<EmployeeSkill> EmployeeSkills { get; set; } = new List<EmployeeSkill>();
        public virtual ICollection<Allocation> Allocations { get; set; } = new List<Allocation>();
        public virtual ICollection<EmployeePerformance> EmployeePerformances { get; set; } = new List<EmployeePerformance>();
        public virtual ICollection<EmployeePerformance> GivenPerformanceRatings { get; set; } = new List<EmployeePerformance>();
        public virtual ICollection<EvaluationScheduleStatus> EvaluationSchedules { get; set; } = new List<EvaluationScheduleStatus>();
        public virtual ICollection<EvaluationScheduleStatus> CognizantInterviewer1Evaluations { get; set; } = new List<EvaluationScheduleStatus>();
        public virtual ICollection<EvaluationScheduleStatus> CognizantInterviewer2Evaluations { get; set; } = new List<EvaluationScheduleStatus>();

        [NotMapped]
        public string FullName => $"{FirstName} {LastName}".Trim();
    }
}
