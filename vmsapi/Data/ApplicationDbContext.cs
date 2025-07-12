using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using vmsapi.Models;

namespace vmsapi.Data
{
    public class ApplicationDbContext : IdentityDbContext<MyUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<VisitorRequest> VisitorRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure VisitorRequest entity
            builder.Entity<VisitorRequest>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.DateTimeCreated)
                    .HasDefaultValueSql("GETDATE()");

                entity.Property(e => e.UUID)
                    .HasDefaultValueSql("NEWID()");

                // Expiry is now DateTime, no special configuration needed

                entity.HasIndex(e => e.UUID)
                    .IsUnique();

                // Foreign key relationship with MyUser
                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Note: Validation that only residents can create visitor requests
                // will be handled at the application level in the controller/service
            });
        }
    }
}
