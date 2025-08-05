using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PriorityMatchingList.Data;
using PriorityMatchingList.Models;

namespace PriorityMatchingList.Controllers
{
    [Authorize]
    public class PerformanceController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PerformanceController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Performance
        public async Task<IActionResult> Index()
        {
            try
            {
                var performances = await _context.EmployeePerformances
                    .Include(p => p.Employee)
                    .Include(p => p.RatingGivenBy)
                    .OrderByDescending(p => p.Year)
                    .ThenBy(p => p.Employee.LastName)
                    .ToListAsync();
                return View(performances);
            }
            catch (Exception ex)
            {
                ViewBag.Error = $"Error loading performance data: {ex.Message}";
                return View(new List<EmployeePerformance>());
            }
        }

        // GET: Performance/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var performance = await _context.EmployeePerformances
                .Include(p => p.Employee)
                .Include(p => p.RatingGivenBy)
                .FirstOrDefaultAsync(m => m.EmployeePerformanceID == id);

            if (performance == null)
            {
                return NotFound();
            }

            return View(performance);
        }

        // GET: Performance/Employee/5
        public async Task<IActionResult> ByEmployee(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var employee = await _context.Employees
                .Include(e => e.EmployeePerformances)
                    .ThenInclude(p => p.RatingGivenBy)
                .FirstOrDefaultAsync(e => e.EmployeeID == id);

            if (employee == null)
            {
                return NotFound();
            }

            return View(employee);
        }
    }
}
