using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PriorityMatchingList.Models
{
    [Table("Skill", Schema = "dbo")]
    public class Skill
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SkillID { get; set; }

        [Required]
        [StringLength(255)]
        public string SkillName { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string? SkillDescription { get; set; }

        // Navigation properties
        public virtual ICollection<ServiceOrderSkill> ServiceOrderSkills { get; set; } = new List<ServiceOrderSkill>();
        public virtual ICollection<EmployeeSkill> EmployeeSkills { get; set; } = new List<EmployeeSkill>();
    }
}
