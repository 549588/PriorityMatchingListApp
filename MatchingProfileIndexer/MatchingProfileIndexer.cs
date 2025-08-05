
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Linq;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MatchingProfileIndexer
{
    public class MatchingProfileIndexer
    {
        private readonly ILogger<MatchingProfileIndexer> _logger;

        public MatchingProfileIndexer(ILogger<MatchingProfileIndexer> logger)
        {
            _logger = logger;
        }

        [Function("MatchingProfileIndexer")]
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");
#if DEBUG
            System.Diagnostics.Debugger.Launch();
#endif

            string? serviceOrderId = req.Query["serviceOrderId"];
            if (string.IsNullOrEmpty(serviceOrderId))
            {
                return new BadRequestObjectResult("Missing serviceOrderId parameter.");
            }

            var dbConfig = new DbConfig();
            var results = new List<object>();
            using (var conn = new SqlConnection(dbConfig.GetConnectionString()))
            {
                conn.Open();

                // 1. Fetch ServiceOrder details
                var soCmd = new SqlCommand(@"
                    SELECT so.RequiredFrom, so.CCARole, so.Location, so.AccountName, so.HiringManager, so.ClientEvaluation, so.SOState, so.Grade
                    FROM ServiceOrder so
                    WHERE so.ServiceOrderId = @ServiceOrderId AND so.SOState = 'Open'", conn);
                soCmd.Parameters.AddWithValue("@ServiceOrderId", serviceOrderId);
                using var soReader = soCmd.ExecuteReader();
                if (!soReader.Read())
                {
                    return new NotFoundObjectResult("ServiceOrder not found or not open.");
                }
                var requiredFromDate = soReader["RequiredFrom"];
                var ccaRole = soReader["CCARole"];
                var location = soReader["Location"];
                var accountName = soReader["AccountName"];
                var hiringManager = soReader["HiringManager"];
                var clientEvaluation = soReader["ClientEvaluation"];
                var grade = soReader["Grade"];
                soReader.Close();

                // 2. Fetch ServiceOrderSkills
                var skillsCmd = new SqlCommand(@"
                    SELECT SkillId, Mandatory, SkillLevel
                    FROM ServiceOrderSkills
                    WHERE ServiceOrderId = @ServiceOrderId", conn);
                skillsCmd.Parameters.AddWithValue("@ServiceOrderId", serviceOrderId);
                var skills = new List<(int SkillId, bool Mandatory, int SkillLevel)>();
                using (var skillsReader = skillsCmd.ExecuteReader())
                {
                    while (skillsReader.Read())
                    {
                        skills.Add((
                            (int)skillsReader["SkillId"],
                            (bool)skillsReader["Mandatory"],
                            (int)skillsReader["SkillLevel"]
                        ));
                    }
                }

                // 3. Find matching employees
                // Collect employee matches for all skills
                var employeeSkillMap = new Dictionary<int, List<dynamic>>();
                foreach (var skill in skills)
                {
                    var empCmd = new SqlCommand(@"
                        SELECT e.EmployeeId, (e.FirstName + e.LastName) as Name, e.Grade, e.Location, e.AvailableForDeployment,
                               es.AIEvaluatedScore, es.SupervisorRatedSkillLevel, ep.Rating, a.AllocationEndDate
                        FROM Employee e
                        JOIN EmployeeSkills es ON e.EmployeeId = es.EmployeeId
                            AND es.SkillId = @SkillId
                            --AND es.Mandatory = 1 -- Only mandatory skills
                            AND es.SupervisorRatedSkillLevel >= @SkillLevel
                        LEFT JOIN EmployeePerformance ep ON e.EmployeeId = ep.EmployeeId
                        LEFT JOIN Allocation a ON e.EmployeeId = a.EmployeeId
                        WHERE e.AvailableForDeployment = 1
                          AND e.Grade = @Grade
                          AND (@Location = 'Remote' OR e.Location = @Location or e.locationpreference like '%'+@Location+'%')
                          AND  ( a.AllocationEndDate IS NULL OR a.AllocationEndDate < @RequiredFromDate)
                    ", conn);
                    empCmd.Parameters.AddWithValue("@SkillId", skill.SkillId);
                    empCmd.Parameters.AddWithValue("@SkillLevel", skill.SkillLevel);
                    empCmd.Parameters.AddWithValue("@Grade", grade);
                    empCmd.Parameters.AddWithValue("@Location", location);
                    empCmd.Parameters.AddWithValue("@RequiredFromDate", requiredFromDate);

                    using (var empReader = empCmd.ExecuteReader())
                    {
                        while (empReader.Read())
                        {
                            int empId = (int)empReader["EmployeeId"];
                            if (!employeeSkillMap.ContainsKey(empId))
                                employeeSkillMap[empId] = new List<dynamic>();
                            employeeSkillMap[empId].Add(new
                            {
                                EmployeeId = empReader["EmployeeId"],
                                Name = empReader["Name"],
                                Grade = empReader["Grade"],
                                Location = empReader["Location"],
                                AIEvaluatedScore = empReader["AIEvaluatedScore"],
                                SupervisorRatedSkillLevel = empReader["SupervisorRatedSkillLevel"],
                                //SkillLevel = empReader["SkillLevel"],
                                PerformanceScore = empReader["Rating"],
                                AllocationEndDate = empReader["AllocationEndDate"],
                                RequiredFromDate = requiredFromDate,
                                CCARole = ccaRole,
                                AccountName = accountName,
                                HiringManager = hiringManager,
                                ClientEvaluation = clientEvaluation
                            });
                        }
                    }
                }

                // Calculate MatchingIndexScore for each employee
                double ToDouble(object value)
                {
                    if (value is DBNull) return 0.0;
                    if (value is double d) return d;
                    if (value is float f) return (double)f;
                    if (value is int i) return (double)i;
                    if (value is long l) return (double)l;
                    if (value is decimal m) return (double)m;
                    if (value is string s && double.TryParse(s, out var result)) return result;
                    return Convert.ToDouble(value);
                }

                var priorityList = new List<dynamic>();
                foreach (var emp in employeeSkillMap)
                {
                    var empId = emp.Key;
                    var skillMatches = emp.Value;
                    // Normalize all scores to 0-100 scale before averaging
                    double NormalizeTo100(object value, double maxValue)
                    {
                        double v = ToDouble(value);
                        if (maxValue <= 0) return 0.0;
                        return (v / maxValue) * 100.0;
                    }

                    // Define max values for normalization (adjust as per your business rules)
                    const double maxSkillLevel = 5.0; // e.g., skill levels are 1-5
                    const double maxAIEvaluatedScore = 100.0; // e.g., AI scores are 1-5
                    const double maxPerformanceScore = 5.0; // e.g., performance ratings are 1-5

                    double avgSupervisorRatedSkill = skillMatches.Average(x => NormalizeTo100(x.SupervisorRatedSkillLevel, maxSkillLevel));
                    double avgAIEvaluatedScore = skillMatches.Average(x => NormalizeTo100(x.AIEvaluatedScore, maxAIEvaluatedScore));
                    // Average EmployeePerformance (PerformanceScore)
                    double avgPerformance = skillMatches.Average(x => NormalizeTo100(x.PerformanceScore, maxPerformanceScore));

                    double matchingIndexScore = avgPerformance * 0.25 + avgSupervisorRatedSkill * 0.25 + avgAIEvaluatedScore * 0.5;

                    string remarks = matchingIndexScore >= 80 ? "Excellent Match" : matchingIndexScore >= 60 ? "Good Match" : "Average Match";
                    // For demo, associateWilling is set to true
                    bool associateWilling = true;

                    priorityList.Add(new
                    {
                        EmployeeId = empId,
                        Name = skillMatches[0].Name,
                        Grade = skillMatches[0].Grade,
                        Location = skillMatches[0].Location,
                        MatchingIndexScore = matchingIndexScore,
                        Remarks = remarks,
                        AssociateWilling = associateWilling,
                        RequiredFromDate = requiredFromDate,
                        CCARole = ccaRole,
                        AccountName = accountName,
                        HiringManager = hiringManager,
                        ClientEvaluation = clientEvaluation
                    });
                }

                // Sort by MatchingIndexScore descending and assign priority
                var sortedPriorityList = priorityList.OrderByDescending(x => x.MatchingIndexScore).ToList();
                int priority = 1;
                foreach (var item in sortedPriorityList)
                {
                    // Insert into PriorityMatchingList table
                    var insertCmd = new SqlCommand(@"
                        INSERT INTO PriorityMatchingList (ServiceOrderId, EmployeeId, MatchingIndexScore, Remarks, Priority, AssociateWilling)
                        VALUES (@ServiceOrderId, @EmployeeId, @MatchingIndexScore, @Remarks, @Priority, @AssociateWilling)
                    ", conn);
                    insertCmd.Parameters.AddWithValue("@ServiceOrderId", serviceOrderId);
                    insertCmd.Parameters.AddWithValue("@EmployeeId", item.EmployeeId);
                    insertCmd.Parameters.AddWithValue("@MatchingIndexScore", item.MatchingIndexScore);
                    insertCmd.Parameters.AddWithValue("@Remarks", item.Remarks);
                    insertCmd.Parameters.AddWithValue("@Priority", priority);
                    insertCmd.Parameters.AddWithValue("@AssociateWilling", item.AssociateWilling);
                    insertCmd.ExecuteNonQuery();
                    priority++;
                }

                results = sortedPriorityList.Cast<object>().ToList();
            }

            return new OkObjectResult(results);
        }
    }
}
