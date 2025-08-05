using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PriorityMatchingList.Data;
using PriorityMatchingList.Models;
using System.Security.Claims;

namespace PriorityMatchingList.Controllers
{
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ApplicationDbContext context, ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Login(string? returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;

            if (ModelState.IsValid)
            {
                try
                {
                    // Find user by EmployeeID and Password
                    var user = await _context.Users
                        .Include(u => u.Employee)
                        .FirstOrDefaultAsync(u => u.EmployeeID == model.EmployeeID && 
                                                  u.Password == model.Password);

                    if (user != null)
                    {
                        // Check if user is active
                        if (user.Active == false)
                        {
                            ModelState.AddModelError(string.Empty, "Your account is inactive. Please contact administrator.");
                            return View(model);
                        }

                        // Create claims for the authenticated user
                        var claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                            new Claim(ClaimTypes.Name, user.Employee?.FullName ?? $"Employee {user.EmployeeID}"),
                            new Claim("EmployeeID", user.EmployeeID.ToString()),
                            new Claim("UserID", user.UserID.ToString())
                        };

                        // Add additional claims if employee data is available
                        if (user.Employee != null)
                        {
                            if (!string.IsNullOrEmpty(user.Employee.EmailID))
                                claims.Add(new Claim(ClaimTypes.Email, user.Employee.EmailID));
                            
                            if (!string.IsNullOrEmpty(user.Employee.Grade))
                                claims.Add(new Claim("Grade", user.Employee.Grade));
                            
                            if (!string.IsNullOrEmpty(user.Employee.Location))
                                claims.Add(new Claim("Location", user.Employee.Location));
                        }

                        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                        var authProperties = new AuthenticationProperties
                        {
                            IsPersistent = model.RememberMe,
                            ExpiresUtc = model.RememberMe ? DateTimeOffset.UtcNow.AddDays(30) : DateTimeOffset.UtcNow.AddHours(8)
                        };

                        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                            new ClaimsPrincipal(claimsIdentity), authProperties);

                        _logger.LogInformation("User {EmployeeID} logged in successfully", model.EmployeeID);

                        // Redirect to return URL or home page
                        if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
                        {
                            return Redirect(returnUrl);
                        }
                        return RedirectToAction("Index", "Home");
                    }
                    else
                    {
                        ModelState.AddModelError(string.Empty, "Invalid Employee ID or Password.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during login attempt for EmployeeID: {EmployeeID}", model.EmployeeID);
                    ModelState.AddModelError(string.Empty, "An error occurred during login. Please try again.");
                }
            }

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            _logger.LogInformation("User logged out");
            return RedirectToAction("Login");
        }

        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}
