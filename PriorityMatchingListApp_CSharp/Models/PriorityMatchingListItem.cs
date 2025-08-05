using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PriorityMatchingList.Models
{
    [Table("PriorityMatchingList", Schema = "dbo")]
    public class PriorityMatchingListItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MatchingListID { get; set; }

        [Required]
        public int ServiceOrderID { get; set; }

        [Required]
        public int EmployeeID { get; set; }

        public int? MatchingIndexScore { get; set; }

        [Column(TypeName = "text")]
        public string? Remarks { get; set; }

        public int? Priority { get; set; }

        public bool? AssociateWilling { get; set; }
    }
}
