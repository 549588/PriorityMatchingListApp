using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PriorityMatchingList.Models
{
    [Table("ServiceOrder", Schema = "dbo")]
    public class ServiceOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ServiceOrderID { get; set; }

        [Required]
        [StringLength(255)]
        public string AccountName { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Location { get; set; }

        [StringLength(100)]
        public string? CCArole { get; set; }

        public int? HiringManager { get; set; }

        [Column(TypeName = "date")]
        public DateTime? RequiredFrom { get; set; }

        [Column(TypeName = "text")]
        public string? ClientEvaluation { get; set; }

        [StringLength(50)]
        public string? SOState { get; set; }

        public int? AssignedToResource { get; set; }

        [StringLength(50)]
        public string? Grade { get; set; }

        // Removed navigation properties to avoid EF creating shadow properties
        // Navigation properties removed to avoid EF relationship issues
        // public virtual Employee? HiringManagerEmployee { get; set; }
        // public virtual Employee? AssignedResourceEmployee { get; set; }
        // public virtual ICollection<ServiceOrderSkill> ServiceOrderSkills { get; set; } = new List<ServiceOrderSkill>();
        // public virtual ICollection<PriorityMatchingListItem> PriorityMatchingListItems { get; set; } = new List<PriorityMatchingListItem>();
        // public virtual ICollection<Allocation> Allocations { get; set; } = new List<Allocation>();
        // public virtual ICollection<EvaluationScheduleStatus> EvaluationScheduleStatuses { get; set; } = new List<EvaluationScheduleStatus>();
    }
}
