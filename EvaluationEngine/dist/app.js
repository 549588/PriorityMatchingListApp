"use strict";
// ...existing code...
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mssql_1 = __importDefault(require("mssql"));
const config_1 = require("./config");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const evaluationRoutes_1 = require("./routes/evaluationRoutes");
const questionRoutes_1 = require("./routes/questionRoutes");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const app = (0, express_1.default)();
// Allow CORS for frontend
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
app.use((0, cors_1.default)({ origin: frontendUrl, credentials: true }));
const PORT = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
// Login endpoint
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    try {
        // Connect to DB
        const pool = yield mssql_1.default.connect(config_1.dbConfig);
        // Find employee by email
        const empResult = yield pool.request()
            .input('email', mssql_1.default.VarChar, email)
            .query('SELECT EmployeeID FROM Employee WHERE EmailID = @email');
        if (empResult.recordset.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        const employeeId = empResult.recordset[0].EmployeeID;
        // Find user by employeeId and check password
        const userResult = yield pool.request()
            .input('employeeId', mssql_1.default.Int, employeeId)
            .query('SELECT Password FROM Users WHERE EmployeeID = @employeeId');
        if (userResult.recordset.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        const dbPassword = userResult.recordset[0].Password;
        if (dbPassword !== password) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        return res.json({ success: true, message: 'Login successful.' });
    }
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
}));
// Register info endpoint for frontend register screen
app.post('/register-info', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    try {
        const pool = yield mssql_1.default.connect(config_1.dbConfig);
        // Get employee info
        const empResult = yield pool.request()
            .input('email', mssql_1.default.VarChar, email)
            .query('SELECT EmployeeID,(FirstName+LastName) as FullName FROM Employee WHERE EmailID = @email');
        if (empResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found.' });
        }
        const employee = empResult.recordset[0];
        // Get skills for employee, join with Skills table
        const skillsResult = yield pool.request()
            .input('employeeId', mssql_1.default.Int, employee.EmployeeID)
            .query(`
                SELECT es.EmployeeSkillID, es.EmployeeRatedSkillLevel, es.YearsOfExperience, s.SkillName, s.SkillDescription
                FROM EmployeeSkills es
                JOIN Skill s ON es.SkillID = s.SkillID
                WHERE es.EmployeeID = @employeeId
            `);
        return res.json({
            user: { name: employee.FullName, email, employeeId: employee.EmployeeID },
            skill: skillsResult.recordset
        });
    }
    catch (err) {
        console.error('Register info error:', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
(0, evaluationRoutes_1.setEvaluationRoutes)(app);
(0, questionRoutes_1.setQuestionRoutes)(app);
// Swagger setup
const swaggerPath = path.join(__dirname, 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// Root route: List all API operations
app.get('/', (req, res) => {
    res.send(`
<h2>Quantify: Skill Evaluation API</h2>
<ul style="line-height:1.7;font-size:16px;">
  <li><b>POST /evaluate</b> — Register & get questions<br>
    <code>{ email, skills, techStack, skillLevel }</code>
  </li>
  <li><b>POST /save-score</b> — Save score<br>
    <code>{ score, candidateName, skill }</code>
  </li>
  <li><b>GET /questions</b> — Fetch questions<br>
    <code>?skill=java&skillLevel=low</code>
  </li>
  <li><b>POST /questions/fetchQuestions</b> — Fetch questions<br>
    <code>{ skill, skillLevel }</code>
  </li>
  <li><b>POST /questions/submit</b> — Submit answers<br>
    <code>{ email, answers, skill, skillLevel, candidateName }</code>
  </li>
</ul>
<div style="color:#888;font-size:13px;margin-top:1em;">All POST requests require <b>Content-Type: application/json</b>.<br>See docs or frontend for full payload examples.</div>
<div style="margin-top:2em;font-size:15px;"><a href="/api-docs" target="_blank">View Swagger API Docs</a></div>
    `);
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
