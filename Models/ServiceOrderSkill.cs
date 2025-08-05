using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PriorityMatchingList.Models
{
    [Table("ServiceOrderSkills", Schema = "dbo")]
    public class ServiceOrderSkill
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SOSkillID { get; set; }

        [Required]
        [ForeignKey("ServiceOrder")]
        public int ServiceOrderID { get; set; }

        [Required]
        [ForeignKey("Skill")]
        public int SkillID { get; set; }

        public bool? Mandatory { get; set; }

        public int? SkillLevel { get; set; }

        // Navigation properties
        public virtual ServiceOrder ServiceOrder { get; set; } = null!;
        public virtual Skill Skill { get; set; } = null!;
    }
}
