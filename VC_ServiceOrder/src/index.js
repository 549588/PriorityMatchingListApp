
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const ServiceOrderForm = () => {
  const [skills, setSkills] = useState([
    { skillId: '', mandatory: 'No', level: '' }
  ]);
  // Skill details list
  const [skillOptions, setSkillOptions] = useState([]);

  const handleSkillChange = (idx, field, value) => {
    // For skill level, allow only digits 0-5
    if (field === 'level') {
      if (value === '' || (/^[0-5]$/.test(value))) {
        setSkills(skills => skills.map((s, i) => i === idx ? { ...s, [field]: value } : s));
      }
    } else {
      setSkills(skills => skills.map((s, i) => i === idx ? { ...s, [field]: value } : s));
    }
  };

  const addSkill = () => {
    setSkills(skills => [...skills, { skillId: '', mandatory: 'No', level: '' }]);
  };

  const deleteSkill = idx => {
    setSkills(skills => skills.length > 1 ? skills.filter((_, i) => i !== idx) : skills);
  };

  // Form state
  const [form, setForm] = useState({
    accountName: '',
    location: '',
    hiringManager: '', // will hold employeeId
    ccaRole: '',
    requiredFrom: '',
    clientEval: true,
    soState: '',
    assignedToResource: '',
    grade: ''
  });

  // Hiring manager list
  const [hiringManagers, setHiringManagers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/employees/all')
      .then(res => res.json())
      .then(data => setHiringManagers(data))
      .catch(() => setHiringManagers([]));
    // Fetch skill details for dropdown
    fetch('http://localhost:8080/skills/all')
      .then(res => res.json())
      .then(data => setSkillOptions(data))
      .catch(() => setSkillOptions([]));
  }, []);

  // Handle input changes
  const handleChange = e => {
    const { name, value, type } = e.target;
    if (name === 'clientEval') {
      setForm(f => ({ ...f, clientEval: value === 'Yes' }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Submit handler
  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      accountName: form.accountName,
      location: form.location,
      hiringManager: form.hiringManager,
      ccaRole: form.ccaRole,
      requiredFrom: form.requiredFrom,
      clientEval: form.clientEval,
      skills: skills.map(s => ({
        skillId: s.skillId,
        mandatory: s.mandatory,
        skillLevel: s.level
      })),
      soState: form.soState,
      assignedToResource: form.assignedToResource,
      grade: form.grade
    };
    try {
      const res = await fetch('http://localhost:8080/serviceorders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Form submitted successfully!');
      } else {
        alert('Submission failed.');
      }
    } catch (err) {
      alert('Error submitting form.');
    }
  };

  return (
    <form
      style={{
        background: '#fff',
        padding: 32,
        borderRadius: 12,
        boxShadow: '0 2px 16px #ccc',
        width: '100%',
        height: '100%',
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
      onSubmit={handleSubmit}
    >
      <table style={{ width: '100%', maxWidth: 900, borderCollapse: 'separate', borderSpacing: '24px 16px' }}>
        <tbody>
          <tr>
            <td style={{ width: '50%' }}>
              <label htmlFor="accountName" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Account Name</label>
              <input type="text" id="accountName" name="accountName" value={form.accountName} onChange={handleChange} style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: '1em' }} />
            </td>
            <td style={{ width: '50%' }}>
              <label htmlFor="location" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Location</label>
              <input type="text" id="location" name="location" value={form.location} onChange={handleChange} style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: '1em' }} />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="ccaRole" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>CCA Role</label>
              <select id="ccaRole" name="ccaRole" value={form.ccaRole} onChange={handleChange} style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: '1em' }}>
                <option value="">Select Role</option>
                <option value="Developer">Developer</option>
                <option value="Sr. Developer">Sr. Developer</option>
                <option value="Architect">Architect</option>
                <option value="Tester">Tester</option>
                <option value="Service Manager">Service Manager</option>
              </select>
            </td>
            <td>
              <label htmlFor="hiringManager" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Hiring Manager</label>
              <select
                id="hiringManager"
                name="hiringManager"
                value={form.hiringManager}
                onChange={handleChange}
                style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: '1em' }}
              >
                <option value="">Select Hiring Manager</option>
                {hiringManagers.map(emp => (
                  <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="requiredFrom" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Required from</label>
              <input type="date" id="requiredFrom" name="requiredFrom" value={form.requiredFrom} onChange={handleChange} style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: '1em' }} />
            </td>
            <td>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Client evaluation needed</label>
              <div>
                <label style={{ marginRight: 24, fontSize: '1em' }}>
                  <input type="radio" name="clientEval" value="Yes" checked={form.clientEval === true} onChange={handleChange} /> Yes
                </label>
                <label style={{ fontSize: '1em' }}>
                  <input type="radio" name="clientEval" value="No" checked={form.clientEval === false} onChange={handleChange} /> No
                </label>
              </div>
            </td>
          </tr>
          {skills.map((skill, idx) => (
            <tr key={idx}>
              <td colSpan={2}>
                <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 2 }}>
                    <label htmlFor={`skillDetails${idx}`} style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Skill Details</label>
                    <select
                      id={`skillDetails${idx}`}
                      name={`skillDetails${idx}`}
                      value={skill.skillId}
                      onChange={e => handleSkillChange(idx, 'skillId', e.target.value)}
                      style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: '1em' }}
                    >
                      <option value="">Select Skill</option>
                      {skillOptions.map(opt => (
                        <option key={opt.skillId} value={opt.skillId}>{opt.skillDetails}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Mandatory</label>
                    <div>
                      <label style={{ marginRight: 12 }}>
                        <input
                          type="radio"
                          name={`mandatory${idx}`}
                          value="Yes"
                          checked={skill.mandatory === 'Yes'}
                          onChange={e => handleSkillChange(idx, 'mandatory', e.target.value)}
                        /> Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`mandatory${idx}`}
                          value="No"
                          checked={skill.mandatory === 'No'}
                          onChange={e => handleSkillChange(idx, 'mandatory', e.target.value)}
                        /> No
                      </label>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label htmlFor={`skillLevel${idx}`} style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Skill Level</label>
                    <select
                      id={`skillLevel${idx}`}
                      name={`skillLevel${idx}`}
                      value={skill.level}
                      onChange={e => handleSkillChange(idx, 'level', e.target.value)}
                      style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: '1em' }}
                    >
                      <option value="">Select Level</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  <button type="button" onClick={addSkill} style={{ padding: '10px 15px', fontSize: '1em', borderRadius: 6, background: '#27ae60', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginBottom: 0, marginRight: '12px' }}>Add skill</button>
                  <button type="button" onClick={() => deleteSkill(idx)} style={{ padding: '10px 15px', fontSize: '1em', borderRadius: 6, background: '#c0392b', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginBottom: 0 }}>Delete skill</button>
                </div>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <label htmlFor="soState" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>SO state</label>
              <input type="text" id="soState" name="soState" value={form.soState} onChange={handleChange} style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: '1em' }} />
            </td>
            <td>
              <label htmlFor="assignedToResource" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Assigned to resource</label>
              <input type="text" id="c" name="assignedToResource" value={form.assignedToResource} onChange={handleChange} style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: '1em' }} disabled />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <label htmlFor="grade" style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Grade</label>
              <input type="text" id="grade" name="grade" value={form.grade} onChange={handleChange} style={{ width: '100%', padding: 12, borderRadius: 6, border: '1px solid #ccc', fontSize: '1em' }} />
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ textAlign: 'center', paddingTop: 24 }}>
              <button type="submit" style={{ padding: '14px 48px', fontSize: '1.1em', borderRadius: 8, background: '#2980b9', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '1px' }}>Submit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}

const App = () => {
  const [page, setPage] = useState('home');

  React.useEffect(() => {
    // Attach click handler to Service Order menu
    const menuItem = document.querySelector('nav ul li');
    if (menuItem) {
      menuItem.onclick = () => setPage('serviceOrder');
    }
    // Clean up
    return () => {
      if (menuItem) menuItem.onclick = null;
    };
  }, []);

  return (
    <div>
      {page === 'home' ? (
        <h1>Home</h1>
      ) : (
        <ServiceOrderForm />
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
