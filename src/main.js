import './style.css'
import { generatePortfolioHTML } from './template.js'

// --- State Management ---
let state = JSON.parse(localStorage.getItem('profolio-state')) || {
  currentStep: 1,
  name: '',
  bio: '',
  skills: [],
  education: [],
  experience: [],
  projects: [],
  isAdding: false // Track if we're currently adding a new item (exp/edu/proj)
};

const saveState = () => {
  localStorage.setItem('profolio-state', JSON.stringify(state));
  updatePreview();
};

// --- DOM Elements ---
const app = document.querySelector('#app');

// --- Form Rendering ---
const renderForm = () => {
  const sidebar = document.createElement('div');
  sidebar.className = 'builder-sidebar';

  sidebar.innerHTML = `
    <div class="builder-header">
      <div class="logo-icon">P</div>
      <h1 class="builder-title">ProFolio</h1>
    </div>

    <div class="steps-nav">
      ${[1, 2, 3, 4, 5].map(i => `<div class="step-dot ${state.currentStep >= i ? 'active' : ''}"></div>`).join('')}
    </div>

    <div id="form-content"></div>

    <div class="builder-footer" style="margin-top: auto; display: flex; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--glass-border)">
      ${state.currentStep > 1 ? '<button class="btn btn-secondary" id="prev-btn">Previous</button>' : ''}
      ${state.currentStep < 5 ? '<button class="btn btn-primary" style="flex: 1" id="next-btn">Next Step</button>' : '<button class="btn btn-primary" style="flex: 1" id="export-btn">Export Website</button>'}
    </div>
  `;

  return sidebar;
};

const renderStepContent = () => {
  const container = document.querySelector('#form-content');
  if (!container) return;

  if (state.isAdding) {
    renderAddingForm(container);
    return;
  }

  switch (state.currentStep) {
    case 1:
      container.innerHTML = `
        <div class="form-section">
          <h2>Personal Details</h2>
          <div class="input-group">
            <label>Full Name</label>
            <input type="text" id="input-name" value="${state.name}" placeholder="John Doe">
          </div>
          <div class="input-group">
            <label>Professional Bio</label>
            <textarea id="input-bio" placeholder="Full-stack developer passionate about building...">${state.bio}</textarea>
          </div>
        </div>
      `;
      break;
    case 2:
      container.innerHTML = `
        <div class="form-section">
          <h2>Skills</h2>
          <div class="input-group">
            <label>Add Skill (Press Enter)</label>
            <input type="text" id="skill-input" placeholder="React, Python, etc.">
            <div class="chips-container" id="skills-list">
              ${state.skills.map((s, i) => `
                <div class="chip">
                  ${s}
                  <span class="chip-remove" data-index="${i}">×</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
      break;
    case 3:
      container.innerHTML = `
        <div class="form-section">
          <h2>Experience</h2>
          <div id="experience-list">
            ${state.experience.length === 0 ? '<p style="color: var(--text-secondary); font-size: 0.9rem;">No experience added yet.</p>' : ''}
            ${state.experience.map((exp, i) => `
              <div class="list-item-card">
                <button class="remove-btn" data-type="experience" data-index="${i}">×</button>
                <div style="font-weight: 600; color: var(--accent-primary)">${exp.role}</div>
                <div style="font-size: 0.85rem;">${exp.company}</div>
                <div style="font-size: 0.8rem; opacity: 0.6">${exp.duration}</div>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-secondary" id="start-add-experience">Add Experience +</button>
        </div>
      `;
      break;
    case 4:
      container.innerHTML = `
        <div class="form-section">
          <h2>Education</h2>
          <div id="education-list">
            ${state.education.length === 0 ? '<p style="color: var(--text-secondary); font-size: 0.9rem;">No education added yet.</p>' : ''}
            ${state.education.map((edu, i) => `
              <div class="list-item-card">
                <button class="remove-btn" data-type="education" data-index="${i}">×</button>
                <div style="font-weight: 600; color: var(--accent-primary)">${edu.degree}</div>
                <div style="font-size: 0.85rem;">${edu.school}</div>
                <div style="font-size: 0.8rem; opacity: 0.6">${edu.year}</div>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-secondary" id="start-add-education">Add Education +</button>
        </div>
      `;
      break;
    case 5:
      container.innerHTML = `
        <div class="form-section">
          <h2>Projects</h2>
          <div id="projects-list">
            ${state.projects.length === 0 ? '<p style="color: var(--text-secondary); font-size: 0.9rem;">No projects added yet.</p>' : ''}
            ${state.projects.map((proj, i) => `
              <div class="list-item-card">
                <button class="remove-btn" data-type="projects" data-index="${i}">×</button>
                <div style="font-weight: 600; color: var(--accent-primary)">${proj.title}</div>
                <div style="font-size: 0.8rem; opacity: 0.6">${proj.tech}</div>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-secondary" id="start-add-project">Add Project +</button>
        </div>
      `;
      break;
  }

  attachEventListeners();
};

const renderAddingForm = (container) => {
  switch (state.currentStep) {
    case 3: // Experience
      container.innerHTML = `
        <div class="form-section">
          <h2>Add Experience</h2>
          <div class="input-group">
            <label>Job Role</label>
            <input type="text" id="add-role" placeholder="e.g. Senior Developer">
          </div>
          <div class="input-group">
            <label>Company</label>
            <input type="text" id="add-company" placeholder="e.g. Google">
          </div>
          <div class="input-group">
            <label>Duration</label>
            <input type="text" id="add-duration" placeholder="e.g. 2020 - Present">
          </div>
          <div class="input-group">
            <label>Description</label>
            <textarea id="add-description" placeholder="Describe your key achievements..."></textarea>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary" style="flex: 1" id="save-add">Save</button>
            <button class="btn btn-secondary" id="cancel-add">Cancel</button>
          </div>
        </div>
      `;
      break;
    case 4: // Education
      container.innerHTML = `
        <div class="form-section">
          <h2>Add Education</h2>
          <div class="input-group">
            <label>Degree / Qualification</label>
            <input type="text" id="add-degree" placeholder="e.g. BS in Computer Science">
          </div>
          <div class="input-group">
            <label>Institution</label>
            <input type="text" id="add-school" placeholder="e.g. MIT">
          </div>
          <div class="input-group">
            <label>Year</label>
            <input type="text" id="add-year" placeholder="e.g. 2022">
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary" style="flex: 1" id="save-add">Save</button>
            <button class="btn btn-secondary" id="cancel-add">Cancel</button>
          </div>
        </div>
      `;
      break;
    case 5: // Projects
      container.innerHTML = `
        <div class="form-section">
          <h2>Add Project</h2>
          <div class="input-group">
            <label>Project Title</label>
            <input type="text" id="add-title" placeholder="e.g. Portfolio Builder">
          </div>
          <div class="input-group">
            <label>Description</label>
            <textarea id="add-description" placeholder="Briefly explain the project..."></textarea>
          </div>
          <div class="input-group">
            <label>Technologies Used</label>
            <input type="text" id="add-tech" placeholder="e.g. React, Node.js, CSS">
          </div>
          <div class="input-group">
            <label>Project Link (Optional)</label>
            <input type="text" id="add-link" placeholder="https://github.com/...">
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary" style="flex: 1" id="save-add">Save</button>
            <button class="btn btn-secondary" id="cancel-add">Cancel</button>
          </div>
        </div>
      `;
      break;
  }
  attachAddingListeners();
};

const attachAddingListeners = () => {
  const cancelBtn = document.querySelector('#cancel-add');
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      state.isAdding = false;
      renderStepContent();
    };
  }

  const saveBtn = document.querySelector('#save-add');
  if (saveBtn) {
    saveBtn.onclick = () => {
      if (state.currentStep === 3) {
        const role = document.querySelector('#add-role').value;
        const company = document.querySelector('#add-company').value;
        const duration = document.querySelector('#add-duration').value;
        const description = document.querySelector('#add-description').value;
        if (role && company) {
          state.experience.push({ role, company, duration, description });
        }
      } else if (state.currentStep === 4) {
        const degree = document.querySelector('#add-degree').value;
        const school = document.querySelector('#add-school').value;
        const year = document.querySelector('#add-year').value;
        if (degree && school) {
          state.education.push({ degree, school, year });
        }
      } else if (state.currentStep === 5) {
        const title = document.querySelector('#add-title').value;
        const description = document.querySelector('#add-description').value;
        const tech = document.querySelector('#add-tech').value;
        const link = document.querySelector('#add-link').value;
        if (title) {
          state.projects.push({ title, description, tech, link });
        }
      }
      state.isAdding = false;
      saveState();
      renderStepContent();
    };
  }
};

const attachEventListeners = () => {
  // Navigation visibility
  const nextBtn = document.querySelector('#next-btn');
  const prevBtn = document.querySelector('#prev-btn');
  const exportBtn = document.querySelector('#export-btn');

  // Step 1 Inputs
  const nameInput = document.querySelector('#input-name');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      state.name = e.target.value;
      saveState();
    });
  }

  const bioInput = document.querySelector('#input-bio');
  if (bioInput) {
    bioInput.addEventListener('input', (e) => {
      state.bio = e.target.value;
      saveState();
    });
  }

  // Step 2 Skills
  const skillInput = document.querySelector('#skill-input');
  if (skillInput) {
    skillInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        state.skills.push(e.target.value.trim());
        e.target.value = '';
        saveState();
        renderStepContent();
      }
    });
  }

  document.querySelectorAll('.chip-remove').forEach(btn => {
    btn.onclick = () => {
      state.skills.splice(btn.dataset.index, 1);
      saveState();
      renderStepContent();
    };
  });

  // Start Adding Dynamic Items
  const addExp = document.querySelector('#start-add-experience');
  if (addExp) {
    addExp.onclick = () => {
      state.isAdding = true;
      renderStepContent();
    };
  }

  const addEdu = document.querySelector('#start-add-education');
  if (addEdu) {
    addEdu.onclick = () => {
      state.isAdding = true;
      renderStepContent();
    };
  }

  const addProj = document.querySelector('#start-add-project');
  if (addProj) {
    addProj.onclick = () => {
      state.isAdding = true;
      renderStepContent();
    };
  }

  // Remove buttons for lists
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.onclick = () => {
      const { type, index } = btn.dataset;
      state[type].splice(index, 1);
      saveState();
      renderStepContent();
    };
  });

  // Main Navigation
  if (nextBtn) {
    nextBtn.onclick = () => {
      state.currentStep++;
      initApp();
    };
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      state.currentStep--;
      initApp();
    };
  }

  if (exportBtn) {
    exportBtn.onclick = () => {
      const html = generatePortfolioHTML(state);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(state.name || 'Portfolio').replace(/\s+/g, '_')}.html`;
      a.click();
    };
  }
};

// --- Preview Rendering ---
const updatePreview = () => {
  const iframe = document.querySelector('#preview-frame');
  if (iframe) {
    const html = generatePortfolioHTML(state);
    iframe.srcdoc = html;
  }
};

const renderPreview = () => {
  const container = document.createElement('div');
  container.className = 'preview-container';
  container.innerHTML = `
    <iframe id="preview-frame" style="width: 100%; height: 100%; border: none;"></iframe>
  `;
  return container;
};

// --- App Initialization ---
const initApp = () => {
  app.innerHTML = '';
  const mainContainer = document.createElement('div');
  mainContainer.className = 'builder-container';
  
  mainContainer.appendChild(renderForm());
  mainContainer.appendChild(renderPreview());
  
  app.appendChild(mainContainer);
  renderStepContent();
  updatePreview();
};

initApp();
