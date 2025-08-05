using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PriorityMatchingList.Data;

namespace PriorityMatchingList.Controllers
{
    public class DatabaseTestController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DatabaseTestController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> TestConnection()
        {
            try
            {
                // Test the database connection
                await _context.Database.OpenConnectionAsync();
                await _context.Database.CloseConnectionAsync();
                
                ViewBag.ConnectionStatus = "Success";
                ViewBag.Message = "Successfully connected to SQL Server database: TestDB";
                ViewBag.ServerInfo = "Server: 20.0.97.202\\SQLDemo";
            }
            catch (Exception ex)
            {
                ViewBag.ConnectionStatus = "Error";
                ViewBag.Message = $"Failed to connect to database: {ex.Message}";
                ViewBag.ServerInfo = "Server: 20.0.97.202\\SQLDemo";
            }

            return View();
        }
    }
}
