using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PriorityMatchingList.Models
{
     [Table("Users", Schema = "dbo")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserID { get; set; }
 
        [Required]
        [ForeignKey("Employee")]
        public int EmployeeID { get; set; }
 
        [Required]
        [StringLength(255)]
        public string Password { get; set; } = string.Empty;
 
        public bool? Active { get; set; }
 
        public DateTime? LoggedInTime { get; set; } = DateTime.Now;
 
        // Navigation property
        public virtual Employee? Employee { get; set; }
    }
}
