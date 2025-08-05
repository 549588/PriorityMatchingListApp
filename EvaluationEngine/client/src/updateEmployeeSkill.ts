// src/updateEmployeeSkill.ts
// API call to update EmployeeSkills table after evaluation

export const updateEmployeeSkill = async ({ candidateId, skill, score, remarks }: {
  candidateId: string;
  skill: string;
  score: number;
  remarks: string;
}) => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
  const res = await fetch(`${apiUrl}/update-employee-skill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateId, skill, score, remarks })
  });
  if (!res.ok) throw new Error('Failed to update employee skill');
  return res.json();
};
