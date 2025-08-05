using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PriorityMatchingList.Models
{
    [Table("Allocation", Schema = "dbo")]
    public class Allocation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AllocationID { get; set; }

        [Required]
        [ForeignKey("ServiceOrder")]
        public int ServiceOrderID { get; set; }

        [Required]
        [ForeignKey("Employee")]
        public int EmployeeID { get; set; }

        [Required]
        [Column(TypeName = "date")]
        public DateTime AllocationStartDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? AllocationEndDate { get; set; }

        public int? PercentageOfAllocation { get; set; }

        // Navigation properties
        public virtual ServiceOrder ServiceOrder { get; set; } = null!;
        public virtual Employee Employee { get; set; } = null!;
    }
}
