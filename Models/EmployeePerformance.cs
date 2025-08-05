using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PriorityMatchingList.Models
{
    [Table("EmployeePerformance", Schema = "dbo")]
    public class EmployeePerformance
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EmployeePerformanceID { get; set; }

        [Required]
        [ForeignKey("Employee")]
        public int EmployeeID { get; set; }

        public int? Year { get; set; }

        public int? Rating { get; set; }

        [ForeignKey("RatingGivenBy")]
        public int? RatingGivenByID { get; set; }

        [Column(TypeName = "text")]
        public string? Comments { get; set; }

        // Navigation properties
        public virtual Employee Employee { get; set; } = null!;
        public virtual Employee? RatingGivenBy { get; set; }
    }
}
