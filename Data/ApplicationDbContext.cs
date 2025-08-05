using Microsoft.EntityFrameworkCore;
using PriorityMatchingList.Models;

namespace PriorityMatchingList.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets for your tables
        public DbSet<User> Users { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<ServiceOrder> ServiceOrders { get; set; }
        public DbSet<ServiceOrderSkill> ServiceOrderSkills { get; set; }
        public DbSet<PriorityMatchingListItem> PriorityMatchingListItems { get; set; }
        public DbSet<EmployeeSkill> EmployeeSkills { get; set; }
        public DbSet<Allocation> Allocations { get; set; }
        public DbSet<EmployeePerformance> EmployeePerformances { get; set; }
        public DbSet<EvaluationScheduleStatus> EvaluationScheduleStatuses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Explicitly disable automatic relationship discovery for ServiceOrder
            // to prevent EF from creating shadow EmployeeID properties
            
            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserID);
                
                entity.Property(e => e.UserID)
                    .ValueGeneratedOnAdd();
                    
                entity.Property(e => e.Password)
                    .HasMaxLength(255)
                    .IsRequired();
                    
                entity.Property(e => e.LoggedInTime)
                    .IsRowVersion();
                    
                // Foreign key relationship with Employee
                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.EmployeeID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            // Configure Employee entity
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.EmployeeID);
                
                entity.Property(e => e.EmployeeID)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.FirstName)
                    .HasMaxLength(100);

                entity.Property(e => e.LastName)
                    .HasMaxLength(100);

                entity.Property(e => e.EmailID)
                    .HasMaxLength(255);

                entity.Property(e => e.Grade)
                    .HasMaxLength(50);

                entity.Property(e => e.Location)
                    .HasMaxLength(100);

                entity.Property(e => e.LocationPreference)
                    .HasMaxLength(255);

                entity.Property(e => e.DateofJoin)
                    .HasColumnType("date");

                // Self-referencing relationship for Supervisor
                entity.HasOne(d => d.Supervisor)
                    .WithMany(p => p.Subordinates)
                    .HasForeignKey(d => d.SupervisorID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            // Configure Skill entity
            modelBuilder.Entity<Skill>(entity =>
            {
                entity.HasKey(e => e.SkillID);
                
                entity.Property(e => e.SkillID)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.SkillName)
                    .HasMaxLength(255)
                    .IsRequired();

                entity.Property(e => e.SkillDescription)
                    .HasColumnType("text");
            });

            // Configure ServiceOrder entity
            modelBuilder.Entity<ServiceOrder>(entity =>
            {
                entity.HasKey(e => e.ServiceOrderID);
                
                entity.Property(e => e.ServiceOrderID)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.AccountName)
                    .HasMaxLength(255)
                    .IsRequired();

                entity.Property(e => e.Location)
                    .HasMaxLength(100);

                entity.Property(e => e.CCArole)
                    .HasMaxLength(100);

                entity.Property(e => e.SOState)
                    .HasMaxLength(50);

                entity.Property(e => e.Grade)
                    .HasMaxLength(50);

                entity.Property(e => e.RequiredFrom)
                    .HasColumnType("date");

                entity.Property(e => e.ClientEvaluation)
                    .HasColumnType("text");
                
                // Map properties to exact column names but no foreign key relationships
                entity.Property(e => e.HiringManager)
                    .HasColumnName("HiringManager");
                    
                entity.Property(e => e.AssignedToResource)
                    .HasColumnName("AssignedToResource");

                // Completely ignore any relationship inference by EF
            });

            // Configure ServiceOrderSkill entity
            modelBuilder.Entity<ServiceOrderSkill>(entity =>
            {
                entity.HasKey(e => e.SOSkillID);
                
                entity.Property(e => e.SOSkillID)
                    .ValueGeneratedOnAdd();

                // Completely removed relationships to avoid EF shadow property creation
            });

            // Configure PriorityMatchingListItem entity
            modelBuilder.Entity<PriorityMatchingListItem>(entity =>
            {
                entity.HasKey(e => e.MatchingListID);
                
                entity.Property(e => e.MatchingListID)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Remarks)
                    .HasColumnType("text");

                // Configure for tables with triggers - prevents OUTPUT clause usage
                entity.ToTable(tb => tb.HasTrigger("AllocationTrigger"));

                // Removed all navigation properties to prevent EF shadow properties
                // Raw SQL queries will be used for data retrieval
            });

            // Configure EmployeeSkill entity
            modelBuilder.Entity<EmployeeSkill>(entity =>
            {
                entity.HasKey(e => e.EmployeeSkillID);
                
                entity.Property(e => e.EmployeeSkillID)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.EmployeeSkillModifiedDate)
                    .HasColumnType("date");

                entity.Property(e => e.SupervisorRatingUpdatedOn)
                    .HasColumnType("date");

                entity.Property(e => e.AIEvaluationDate)
                    .HasColumnType("date");

                entity.Property(e => e.EmployeeLastWorkedOnThisSkill)
                    .HasColumnType("date");

                entity.Property(e => e.AIEvaluationRemarks)
                    .HasColumnType("text");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.EmployeeSkills)
                    .HasForeignKey(d => d.EmployeeID)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Skill)
                    .WithMany(p => p.EmployeeSkills)
                    .HasForeignKey(d => d.SkillID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            // Configure Allocation entity
            modelBuilder.Entity<Allocation>(entity =>
            {
                entity.HasKey(e => e.AllocationID);
                
                entity.Property(e => e.AllocationID)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.AllocationStartDate)
                    .HasColumnType("date")
                    .IsRequired();

                entity.Property(e => e.AllocationEndDate)
                    .HasColumnType("date");

                // Removed ServiceOrder relationship to prevent EF shadow properties
                // entity.HasOne(d => d.ServiceOrder)
                //     .WithMany()
                //     .HasForeignKey(d => d.ServiceOrderID)
                //     .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Employee)
                    .WithMany()
                    .HasForeignKey(d => d.EmployeeID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            // Configure EmployeePerformance entity
            modelBuilder.Entity<EmployeePerformance>(entity =>
            {
                entity.HasKey(e => e.EmployeePerformanceID);
                
                entity.Property(e => e.EmployeePerformanceID)
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Comments)
                    .HasColumnType("text");

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.EmployeePerformances)
                    .HasForeignKey(d => d.EmployeeID)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.RatingGivenBy)
                    .WithMany(p => p.GivenPerformanceRatings)
                    .HasForeignKey(d => d.RatingGivenByID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            // Configure EvaluationScheduleStatus entity
            modelBuilder.Entity<EvaluationScheduleStatus>(entity =>
            {
                entity.HasKey(e => new { e.ServiceOrderID, e.EmployeeID });

                entity.Property(e => e.ClientInterviewerName1)
                    .HasMaxLength(255);

                entity.Property(e => e.ClientInterviewerName2)
                    .HasMaxLength(255);

                entity.Property(e => e.ClientInterviewerEmail1)
                    .HasMaxLength(255);

                entity.Property(e => e.ClientInterviewerEmail2)
                    .HasMaxLength(255);

                entity.Property(e => e.EvaluationType)
                    .HasMaxLength(50);

                entity.Property(e => e.EvaluationTranscription)
                    .HasColumnType("text");

                entity.Property(e => e.AudioSavedAt)
                    .HasMaxLength(255);

                entity.Property(e => e.VideoSavedAt)
                    .HasMaxLength(255);

                entity.Property(e => e.EvaluationFeedback)
                    .HasColumnType("text");

                entity.Property(e => e.FinalStatus)
                    .HasMaxLength(50);

                entity.Property(e => e.EvaluationDateTime)
                    .IsRowVersion();

                // Removed ServiceOrder relationship to prevent EF shadow properties
                // entity.HasOne(d => d.ServiceOrder)
                //     .WithMany()
                //     .HasForeignKey(d => d.ServiceOrderID)
                //     .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.Employee)
                    .WithMany(p => p.EvaluationSchedules)
                    .HasForeignKey(d => d.EmployeeID)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.CognizantInterviewer1)
                    .WithMany(p => p.CognizantInterviewer1Evaluations)
                    .HasForeignKey(d => d.CognizantInterviewer1ID)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.CognizantInterviewer2)
                    .WithMany(p => p.CognizantInterviewer2Evaluations)
                    .HasForeignKey(d => d.CognizantInterviewer2ID)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });
        }
    }
}
