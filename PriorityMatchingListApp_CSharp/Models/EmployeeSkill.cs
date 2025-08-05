using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PriorityMatchingList.Models
{
    [Table("EmployeeSkills", Schema = "dbo")]
    public class EmployeeSkill
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EmployeeSkillID { get; set; }

        [Required]
        [ForeignKey("Employee")]
        public int EmployeeID { get; set; }

        [Required]
        [ForeignKey("Skill")]
        public int SkillID { get; set; }

        public int? EmployeeRatedSkillLevel { get; set; }

        [Column(TypeName = "date")]
        public DateTime? EmployeeSkillModifiedDate { get; set; }

        public int? YearsOfExperience { get; set; }

        public int? SupervisorRatedSkillLevel { get; set; }

        [Column(TypeName = "date")]
        public DateTime? SupervisorRatingUpdatedOn { get; set; }

        public int? AIEvaluatedScore { get; set; }

        [Column(TypeName = "date")]
        public DateTime? AIEvaluationDate { get; set; }

        [Column(TypeName = "text")]
        public string? AIEvaluationRemarks { get; set; }

        [Column(TypeName = "date")]
        public DateTime? EmployeeLastWorkedOnThisSkill { get; set; }

        // Navigation properties
        public virtual Employee Employee { get; set; } = null!;
        public virtual Skill Skill { get; set; } = null!;
    }
}
