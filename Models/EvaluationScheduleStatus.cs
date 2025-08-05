using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PriorityMatchingList.Models
{
    [Table("EvaluationScheduleStatus", Schema = "dbo")]
    public class EvaluationScheduleStatus
    {
        [Key, Column(Order = 0)]
        [ForeignKey("ServiceOrder")]
        public int ServiceOrderID { get; set; }

        [Key, Column(Order = 1)]
        [ForeignKey("Employee")]
        public int EmployeeID { get; set; }

        [ForeignKey("CognizantInterviewer1")]
        public int? CognizantInterviewer1ID { get; set; }

        [ForeignKey("CognizantInterviewer2")]
        public int? CognizantInterviewer2ID { get; set; }

        [StringLength(255)]
        public string? ClientInterviewerName1 { get; set; }

        [StringLength(255)]
        public string? ClientInterviewerName2 { get; set; }

        [StringLength(255)]
        public string? ClientInterviewerEmail1 { get; set; }

        [StringLength(255)]
        public string? ClientInterviewerEmail2 { get; set; }

        [Column(TypeName = "timestamp")]
        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public byte[] EvaluationDateTime { get; set; } = new byte[8];

        public int? EvaluationDuration { get; set; }

        [StringLength(50)]
        public string? EvaluationType { get; set; }

        [Column(TypeName = "text")]
        public string? EvaluationTranscription { get; set; }

        public bool? AudioRecording { get; set; }

        [StringLength(255)]
        public string? AudioSavedAt { get; set; }

        public bool? VideoRecording { get; set; }

        [StringLength(255)]
        public string? VideoSavedAt { get; set; }

        [Column(TypeName = "text")]
        public string? EvaluationFeedback { get; set; }

        [StringLength(50)]
        public string? FinalStatus { get; set; }

        // Navigation properties
        public virtual ServiceOrder ServiceOrder { get; set; } = null!;
        public virtual Employee Employee { get; set; } = null!;
        public virtual Employee? CognizantInterviewer1 { get; set; }
        public virtual Employee? CognizantInterviewer2 { get; set; }
    }
}
