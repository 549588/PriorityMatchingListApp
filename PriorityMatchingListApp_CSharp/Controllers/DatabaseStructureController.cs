using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PriorityMatchingList.Data;
using System.Data;

namespace PriorityMatchingList.Controllers
{
    [Authorize]
    public class DatabaseStructureController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DatabaseStructureController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> CheckTables()
        {
            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                
                var serviceOrderColumns = new List<string>();
                var employeeColumns = new List<string>();
                
                // Check ServiceOrder table
                var command1 = connection.CreateCommand();
                command1.CommandText = "SELECT TOP 1 * FROM dbo.ServiceOrder";
                var reader1 = await command1.ExecuteReaderAsync();
                
                for (int i = 0; i < reader1.FieldCount; i++)
                {
                    serviceOrderColumns.Add($"{reader1.GetName(i)} ({reader1.GetFieldType(i).Name})");
                }
                await reader1.CloseAsync();
                
                // Check Employee table
                var command2 = connection.CreateCommand();
                command2.CommandText = "SELECT TOP 1 * FROM dbo.Employee";
                var reader2 = await command2.ExecuteReaderAsync();
                
                for (int i = 0; i < reader2.FieldCount; i++)
                {
                    employeeColumns.Add($"{reader2.GetName(i)} ({reader2.GetFieldType(i).Name})");
                }
                await reader2.CloseAsync();
                
                await connection.CloseAsync();
                
                ViewBag.ServiceOrderColumns = serviceOrderColumns;
                ViewBag.EmployeeColumns = employeeColumns;
                ViewBag.Message = "Database structure retrieved successfully!";
                ViewBag.Status = "Success";
            }
            catch (Exception ex)
            {
                ViewBag.Message = $"Error: {ex.Message}";
                ViewBag.Status = "Error";
                ViewBag.ServiceOrderColumns = new List<string>();
                ViewBag.EmployeeColumns = new List<string>();
            }
            
            return View();
        }
    }
}
