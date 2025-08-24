document.addEventListener('DOMContentLoaded', function() {
    const resumeForm = document.getElementById('resume-form');
    const workExperienceContainer = document.getElementById('work-experience-container');
    const addWorkExperienceButton = document.getElementById('add-work-experience');
    const educationContainer = document.getElementById('education-container');
    const addEducationButton = document.getElementById('add-education');
    const resumeOutput = document.getElementById('resume-output');
    const resumeLoader = document.getElementById('resume-loader');
    const resumeError = document.getElementById('resume-error');

    let workExperienceCount = 0;
    let educationCount = 0;

    addWorkExperienceButton.addEventListener('click', () => {
        workExperienceCount++;
        const workExperienceFields = `
            <div class="work-experience-item">
                <h4>Work Experience #${workExperienceCount}</h4>
                <label for="job-title-${workExperienceCount}">Job Title:</label>
                <input type="text" id="job-title-${workExperienceCount}" name="job-title-${workExperienceCount}" required>
                <label for="company-${workExperienceCount}">Company:</label>
                <input type="text" id="company-${workExperienceCount}" name="company-${workExperienceCount}" required>
                <label for="work-dates-${workExperienceCount}">Dates:</label>
                <input type="text" id="work-dates-${workExperienceCount}" name="work-dates-${workExperienceCount}">
                <label for="work-description-${workExperienceCount}">Description:</label>
                <textarea id="work-description-${workExperienceCount}" name="work-description-${workExperienceCount}"></textarea>
            </div>
        `;
        workExperienceContainer.insertAdjacentHTML('beforeend', workExperienceFields);
    });

    addEducationButton.addEventListener('click', () => {
        educationCount++;
        const educationFields = `
            <div class="education-item">
                <h4>Education #${educationCount}</h4>
                <label for="degree-${educationCount}">Degree:</label>
                <input type="text" id="degree-${educationCount}" name="degree-${educationCount}" required>
                <label for="school-${educationCount}">School:</label>
                <input type="text" id="school-${educationCount}" name="school-${educationCount}" required>
                <label for="education-dates-${educationCount}">Dates:</label>
                <input type="text" id="education-dates-${educationCount}" name="education-dates-${educationCount}">
            </div>
        `;
        educationContainer.insertAdjacentHTML('beforeend', educationFields);
    });

    resumeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        resumeOutput.innerHTML = '';
        resumeError.style.display = 'none';
        resumeLoader.style.display = 'block';

        const formData = new FormData(resumeForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('http://127.0.0.1:5000/generate_resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': 'YOUR_API_KEY' // Replace with a secure way to get the API key
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'resume.pdf';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                resumeOutput.innerHTML = '<p>Resume downloaded successfully!</p>';
            } else {
                const errorData = await response.json();
                resumeError.innerText = `Error: ${errorData.error}`;
                resumeError.style.display = 'block';
            }
        } catch (err) {
            console.error('Error generating resume:', err);
            resumeError.innerText = 'Failed to generate resume. Please try again later.';
            resumeError.style.display = 'block';
        } finally {
            resumeLoader.style.display = 'none';
        }
    });
});