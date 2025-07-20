import React, { useState } from 'react';

const ResumePage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    summary: '',
    experience: [{ jobTitle: '', company: '', startDate: '', endDate: '', description: '' }],
    education: [{ school: '', degree: '', startDate: '', endDate: '' }],
    skills: ''
  });

  const handleChange = (e, index, section) => {
    const { name, value } = e.target;
    if (section) {
      const list = [...formData[section]];
      list[index][name] = value;
      setFormData({ ...formData, [section]: list });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddSection = (section) => {
    if (section === 'experience') {
      setFormData({
        ...formData,
        experience: [...formData.experience, { jobTitle: '', company: '', startDate: '', endDate: '', description: '' }]
      });
    } else if (section === 'education') {
      setFormData({
        ...formData,
        education: [...formData.education, { school: '', degree: '', startDate: '', endDate: '' }]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/generate-resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.error('Failed to generate resume');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Resume Generator</h2>
      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <input type="text" className="form-control" id="fullName" name="fullName" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input type="tel" className="form-control" id="phoneNumber" name="phoneNumber" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input type="text" className="form-control" id="address" name="address" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="summary" className="form-label">Summary</label>
          <textarea className="form-control" id="summary" name="summary" rows="3" onChange={handleChange}></textarea>
        </div>

        {/* Work Experience */}
        <h3>Work Experience</h3>
        {formData.experience.map((exp, index) => (
          <div key={index} className="mb-3 border p-3">
            <input type="text" name="jobTitle" placeholder="Job Title" className="form-control mb-2" onChange={(e) => handleChange(e, index, 'experience')} />
            <input type="text" name="company" placeholder="Company" className="form-control mb-2" onChange={(e) => handleChange(e, index, 'experience')} />
            <input type="text" name="startDate" placeholder="Start Date" className="form-control mb-2" onChange={(e) => handleChange(e, index, 'experience')} />
            <input type="text" name="endDate" placeholder="End Date" className="form-control mb-2" onChange={(e) => handleChange(e, index, 'experience')} />
            <textarea name="description" placeholder="Description" className="form-control" onChange={(e) => handleChange(e, index, 'experience')}></textarea>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={() => handleAddSection('experience')}>Add Experience</button>

        {/* Education */}
        <h3>Education</h3>
        {formData.education.map((edu, index) => (
          <div key={index} className="mb-3 border p-3">
            <input type="text" name="school" placeholder="School" className="form-control mb-2" onChange={(e) => handleChange(e, index, 'education')} />
            <input type="text" name="degree" placeholder="Degree" className="form-control mb-2" onChange={(e) => handleChange(e, index, 'education')} />
            <input type="text" name="startDate" placeholder="Start Date" className="form-control mb-2" onChange={(e) => handleChange(e, index, 'education')} />
            <input type="text" name="endDate" placeholder="End Date" className="form-control mb-2" onChange={(e) => handleChange(e, index, 'education')} />
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={() => handleAddSection('education')}>Add Education</button>

        {/* Skills */}
        <div className="mb-3">
          <label htmlFor="skills" className="form-label">Skills (comma-separated)</label>
          <input type="text" className="form-control" id="skills" name="skills" onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary">Generate Resume</button>
      </form>
    </div>
  );
};

export default ResumePage;
