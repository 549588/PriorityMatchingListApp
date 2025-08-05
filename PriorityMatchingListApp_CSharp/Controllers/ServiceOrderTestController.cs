using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PriorityMatchingList.Data;
using System.Data;

namespace PriorityMatchingList.Controllers
{
    [Authorize]
    public class ServiceOrderTestController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ServiceOrderTestController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> TestServiceOrderStructure()
        {
            try
            {
                // Try to get the first few service orders with raw SQL to see what columns exist
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                
                var command = connection.CreateCommand();
                command.CommandText = "SELECT TOP 5 * FROM dbo.ServiceOrder";
                
                var reader = await command.ExecuteReaderAsync();
                var columnInfo = new List<string>();
                
                // Get column names
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    columnInfo.Add($"{reader.GetName(i)} ({reader.GetFieldType(i).Name})");
                }
                
                await reader.CloseAsync();
                await connection.CloseAsync();
                
                ViewBag.ColumnInfo = columnInfo;
                ViewBag.Message = "ServiceOrder table structure retrieved successfully!";
                ViewBag.Status = "Success";
            }
            catch (Exception ex)
            {
                ViewBag.Message = $"Error: {ex.Message}";
                ViewBag.Status = "Error";
                ViewBag.ColumnInfo = new List<string>();
            }
            
            return View();
        }
    }
}
