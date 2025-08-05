
// ...existing code...

import express from 'express';
import sql from 'mssql';
import { dbConfig } from './config';
import cors from 'cors';
import bodyParser from 'body-parser';
import { setEvaluationRoutes } from './routes/evaluationRoutes';
import { setQuestionRoutes } from './routes/questionRoutes';
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';

const app = express();
// Allow CORS for frontend
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
app.use(cors({ origin: frontendUrl, credentials: true }));
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }
    try {
        // Connect to DB
        const pool = await sql.connect(dbConfig);
        // Find employee by email
        const empResult = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT EmployeeID FROM Employee WHERE EmailID = @email');
        if (empResult.recordset.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        const employeeId = empResult.recordset[0].EmployeeID;
        // Find user by employeeId and check password
        const userResult = await pool.request()
            .input('employeeId', sql.Int, employeeId)
            .query('SELECT Password FROM Users WHERE EmployeeID = @employeeId');
        if (userResult.recordset.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        const dbPassword = userResult.recordset[0].Password;
        if (dbPassword !== password) {
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });
        }
        return res.json({ success: true, message: 'Login successful.' });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// Register info endpoint for frontend register screen
app.post('/register-info', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }
    try {
        const pool = await sql.connect(dbConfig);
        // Get employee info
        const empResult = await pool.request()
            .input('email', sql.VarChar, email)
            .query('SELECT EmployeeID,(FirstName+LastName) as FullName FROM Employee WHERE EmailID = @email');
        if (empResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Employee not found.' });
        }
        const employee = empResult.recordset[0];
        // Get skills for employee, join with Skills table
        const skillsResult = await pool.request()
            .input('employeeId', sql.Int, employee.EmployeeID)
            .query(`
                SELECT es.EmployeeSkillID, es.EmployeeRatedSkillLevel, es.SupervisorRatedSkillLevel, es.AIEvaluatedScore, s.SkillName, s.SkillDescription
                FROM EmployeeSkills es
                JOIN Skill s ON es.SkillID = s.SkillID
                WHERE es.EmployeeID = @employeeId
            `);
        // Map expertise level to EmployeeRatedSkillLevel, fix SupervisorRatedSkillLevel mapping
        const skills = skillsResult.recordset.map((row: any) => ({
            EmployeeSkillID: row.EmployeeSkillID,
            EmployeeRatedSkillLevel: row.EmployeeRatedSkillLevel,
            SupervisorRatedSkillLevel: row.SupervisorRatedSkillLevel,
            AIEvaluatedScore: row.AIEvaluatedScore,
            SkillName: row.SkillName,
            SkillDescription: row.SkillDescription
        }));
        return res.json({
            user: { name: employee.FullName, email, employeeId: employee.EmployeeID },
            skill: skills
        });
    } catch (err) {
        console.error('Register info error:', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});


// Update EmployeeSkills after evaluation
app.post('/update-employee-skill', async (req, res) => {
    const { candidateId, skill, score, remarks } = req.body;
    if (!candidateId || !skill || typeof score !== 'number' || !remarks) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    try {
        const pool = await sql.connect(dbConfig);
        // Find SkillID for the given skill name
        const skillResult = await pool.request()
            .input('skillName', sql.VarChar, skill)
            .query('SELECT SkillID FROM Skill WHERE SkillName = @skillName');
        if (skillResult.recordset.length === 0) {
            return res.status(404).json({ success: false, message: 'Skill not found.' });
        }
        const skillId = skillResult.recordset[0].SkillID;
        // Update EmployeeSkills row
        await pool.request()
            .input('employeeId', sql.Int, candidateId)
            .input('skillId', sql.Int, skillId)
            .input('score', sql.Int, score)
            .input('remarks', sql.VarChar, remarks)
            .input('evalDate', sql.DateTime, new Date())
            .query(`
                UPDATE EmployeeSkills
                SET AIEvaluatedScore = @score,
                    AIEvaluationDate = @evalDate,
                    AIEvaluationRemarks = @remarks
                WHERE EmployeeID = @employeeId AND SkillID = @skillId
            `);
        return res.json({ success: true });
    } catch (err) {
        console.error('Update employee skill error:', err);
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
});

app.use(bodyParser.urlencoded({ extended: true }));

setEvaluationRoutes(app);
setQuestionRoutes(app);

// Swagger setup
const swaggerPath = path.join(__dirname, 'swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Root route: List all API operations
app.get('/', (req, res) => {
    res.send(`
<h2>Quantify: Skill Evaluation API</h2>
<ul style="line-height:1.7;font-size:16px;">
  <li><b>POST /login</b> — Login user<br>
    <code>{ email, password }</code>
  </li>
  <li><b>POST /register-info</b> — Get registration info for user<br>
    <code>{ email }</code>
  </li>
  <li><b>POST /update-employee-skill</b> — Update employee skill after evaluation<br>
    <code>{ candidateId, skill, score, remarks }</code>
  </li>
</ul>
<div style="color:#888;font-size:13px;margin-top:1em;">All POST requests require <b>Content-Type: application/json</b>.<br>See docs or frontend for full payload examples.</div>
<div style="margin-top:2em;font-size:15px;"><a href="/api-docs" target="_blank">View Swagger API Docs</a></div>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});