import './style.css'
import { generatePortfolioHTML } from './template.js'
import { parseResumeText } from './parser.js'
import { auth } from './auth.js'

// --- State Management ---
let state = JSON.parse(localStorage.getItem('portfolio-state')) || {
  currentStep: 1,
  name: '',
  bio: '',
  githubUsername: '',
  skills: [],
  education: [],
  experience: [],
  projects: [],
  theme: 'minimal',
  mode: 'dark',
  isAdding: false,
  tempItem: null,
  currentUser: null,
  authMode: 'login', // 'login' or 'signup'
  showDashboard: false,
  analytics: {
    views: Math.floor(Math.random() * 1000) + 500,
    clicks: Math.floor(Math.random() * 200) + 50,
    visitors: Math.floor(Math.random() * 800) + 300
  }
};

const saveState = () => {
  localStorage.setItem('portfolio-state', JSON.stringify(state));
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
      <h1 class="builder-title">Portfolio</h1>
    </div>

    ${state.currentUser ? `
      <div class="user-profile">
        <div class="user-info">
          <div class="user-avatar">${state.currentUser.username[0].toUpperCase()}</div>
          <div style="font-size: 0.9rem; font-weight: 600;">${state.currentUser.username}</div>
        </div>
        <button class="btn btn-secondary" id="logout-btn" style="padding: 0.4rem 0.8rem; font-size: 0.7rem;">Logout</button>
      </div>
      <button class="btn btn-secondary" id="dashboard-btn" style="width: 100%; margin-bottom: 1rem;">
        ${state.showDashboard ? 'Back to Editor' : 'My Saved Portfolios'}
      </button>
    ` : ''}

    ${state.showDashboard ? '' : `
      <div class="theme-selector">
        <label>Portfolio Theme</label>
        <div class="theme-grid">
          <div class="theme-option ${state.theme === 'minimal' ? 'active' : ''}" data-theme="minimal">Minimal</div>
          <div class="theme-option ${state.theme === 'creative' ? 'active' : ''}" data-theme="creative">Creative</div>
          <div class="theme-option ${state.theme === 'corporate' ? 'active' : ''}" data-theme="corporate">Corporate</div>
          <div class="theme-option ${state.theme === 'modern' ? 'active' : ''}" data-theme="modern">Modern</div>
        </div>
        <div class="mode-toggle">
          <span>${state.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          <button class="toggle-btn ${state.mode}" id="mode-toggle-btn"></button>
        </div>
      </div>
    `}

    <div class="steps-nav">
      ${[1, 2, 3, 4, 5].map(i => `<div class="step-dot ${state.currentStep >= i ? 'active' : ''}"></div>`).join('')}
    </div>

    <div id="form-content"></div>

    <div class="builder-footer" style="margin-top: auto; display: flex; gap: 1rem; padding-top: 1rem; border-top: 1px solid var(--glass-border)">
      ${state.currentUser ? (state.showDashboard ? '' : `
        <button class="btn btn-secondary" id="save-portfolio-btn">Save Progress</button>
        ${state.currentStep < 5 ? '<button class="btn btn-primary" style="flex: 1" id="next-btn">Next Step</button>' : '<button class="btn btn-primary" style="flex: 1" id="export-btn">Export Website</button>'}
      `) : ''}
    </div>
  `;

  return sidebar;
};

const renderStepContent = () => {
  const container = document.querySelector('#form-content');
  if (!container) return;

  if (!state.currentUser) {
    renderAuthForm(container);
    return;
  }

  if (state.showDashboard) {
    renderDashboard(container);
    return;
  }

  if (state.isAdding) {
    renderAddingForm(container);
    return;
  }

  switch (state.currentStep) {
    case 1:
      container.innerHTML = `
        <div class="form-section">
          <h2>Personal Details</h2>
          
          <div class="import-section" id="resume-upload-zone">
            <span class="import-icon">📄</span>
            <p><strong>Import from Resume (PDF)</strong></p>
            <p style="font-size: 0.75rem; color: var(--text-secondary)">We'll auto-fill your skills and experience</p>
            <input type="file" id="resume-file" accept=".pdf" style="display: none">
          </div>

          <div class="input-group">
            <label>Full Name</label>
            <input type="text" id="input-name" value="${state.name}" placeholder="John Doe">
          </div>
          <div class="input-group">
            <label>GitHub Username (Optional)</label>
            <input type="text" id="input-github" value="${state.githubUsername || ''}" placeholder="e.g. janesmith">
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
          <div style="display: flex; gap: 0.5rem; flex-direction: column;">
            <button class="btn btn-secondary" id="start-add-project">Add Project Manually +</button>
            ${state.githubUsername ? `<button class="btn btn-secondary" id="fetch-github-projects" style="border-color: #2ea44f; color: #2ea44f;">Fetch from GitHub ✨</button>` : ''}
          </div>

          <div class="export-options" style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--glass-border);">
            <h3 style="font-size: 1rem; margin-bottom: 1rem;">Export & Share</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
              <button class="btn btn-secondary" id="export-pdf-btn" style="font-size: 0.8rem;">📄 Download PDF</button>
              <button class="btn btn-secondary" id="share-link-btn" style="font-size: 0.8rem;">🔗 Share Link</button>
            </div>
            <p id="share-status" style="font-size: 0.7rem; color: #10b981; margin-top: 0.5rem; display: none; text-align: center;">Link copied to clipboard!</p>
          </div>
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
  updatePreview(); 
};

const renderAuthForm = (container) => {
  container.innerHTML = `
    <div class="auth-container">
      <div class="auth-tabs">
        <div class="auth-tab ${state.authMode === 'login' ? 'active' : ''}" id="tab-login">Login</div>
        <div class="auth-tab ${state.authMode === 'signup' ? 'active' : ''}" id="tab-signup">Sign Up</div>
      </div>
      <h2>${state.authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
      <div class="input-group">
        <label>Username</label>
        <input type="text" id="auth-username" placeholder="Enter username">
      </div>
      <div class="input-group">
        <label>Password</label>
        <input type="password" id="auth-password" placeholder="Enter password">
      </div>
      <button class="btn btn-primary" id="auth-submit-btn">
        ${state.authMode === 'login' ? 'Login' : 'Sign Up'}
      </button>
      <p id="auth-error" style="color: #ef4444; font-size: 0.8rem; text-align: center; margin-top: 0.5rem; display: none;"></p>
    </div>
  `;
  attachAuthListeners();
};

const renderDashboard = (container) => {
  const portfolios = auth.getPortfolios(state.currentUser.username);
  container.innerHTML = `
    <div class="form-section">
      <div class="analytics-header">
        <h2>Analytics Dashboard</h2>
        <p style="font-size: 0.8rem; color: var(--text-secondary)">Real-time performance of your portfolios</p>
      </div>

      <div class="analytics-grid">
        <div class="stat-card">
          <div class="stat-value">${state.analytics.views}</div>
          <div class="stat-label">Profile Views</div>
          <div class="stat-trend positive">+12% this week</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${state.analytics.visitors}</div>
          <div class="stat-label">Unique Visitors</div>
          <div class="stat-trend positive">+5% this week</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${state.analytics.clicks}</div>
          <div class="stat-label">Project Clicks</div>
          <div class="stat-trend negative">-2% this week</div>
        </div>
      </div>

      <div class="analytics-chart">
        <div class="chart-bar-container">
          ${[65, 45, 85, 55, 95, 75, 80].map(h => `
            <div class="chart-bar" style="height: ${h}%"></div>
          `).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.6rem; color: var(--text-secondary); margin-top: 0.5rem;">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>

      <h2 style="margin-top: 1rem;">My Saved Portfolios</h2>
      <div class="portfolio-list">
        ${portfolios.length === 0 ? '<p style="color: var(--text-secondary)">No saved portfolios yet.</p>' : ''}
        ${portfolios.map(p => `
          <div class="portfolio-item" data-id="${p.id}">
            <div>
              <div style="font-weight: 600;">${p.name || 'Untitled Portfolio'}</div>
              <div class="portfolio-meta">Updated: ${new Date(p.updatedAt).toLocaleDateString()}</div>
            </div>
            <span style="color: var(--accent-primary)">Load →</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  attachDashboardListeners();
};

const attachAuthListeners = () => {
  document.querySelector('#tab-login').onclick = () => { state.authMode = 'login'; renderStepContent(); };
  document.querySelector('#tab-signup').onclick = () => { state.authMode = 'signup'; renderStepContent(); };

  document.querySelector('#auth-submit-btn').onclick = () => {
    const username = document.querySelector('#auth-username').value;
    const password = document.querySelector('#auth-password').value;
    const errorEl = document.querySelector('#auth-error');

    if (!username || !password) {
      errorEl.textContent = 'All fields are required';
      errorEl.style.display = 'block';
      return;
    }

    try {
      if (state.authMode === 'login') {
        state.currentUser = auth.login(username, password);
      } else {
        state.currentUser = auth.signup(username, password);
      }
      initApp();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
    }
  };
};

const attachDashboardListeners = () => {
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.onclick = () => {
      const portfolios = auth.getPortfolios(state.currentUser.username);
      const portfolio = portfolios.find(p => p.id == item.dataset.id);
      if (portfolio) {
        state = { ...state, ...portfolio, showDashboard: false };
        initApp();
      }
    };
  });
};

const updateTempItem = (data) => {
  let type = '';
  if (state.currentStep === 3) type = 'experience';
  else if (state.currentStep === 4) type = 'education';
  else if (state.currentStep === 5) type = 'projects';
  
  state.tempItem = { ...data, type };
  updatePreview();
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
      state.tempItem = null;
      saveState();
      renderStepContent();
    };
  }

  // Real-time updates for adding form
  const inputs = document.querySelectorAll('.form-section input, .form-section textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const data = {};
      inputs.forEach(i => {
        const field = i.id.replace('add-', '');
        data[field] = i.value;
      });
      updateTempItem(data);
    });
  });
};

const attachEventListeners = () => {
  // Navigation visibility
  const nextBtn = document.querySelector('#next-btn');
  const prevBtn = document.querySelector('#prev-btn');
  const exportBtn = document.querySelector('#export-btn');

  // Step 1 Resume Upload
  const uploadZone = document.querySelector('#resume-upload-zone');
  const fileInput = document.querySelector('#resume-file');
  
  if (uploadZone && fileInput) {
    uploadZone.onclick = () => fileInput.click();
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      uploadZone.innerHTML = `<span class="import-icon">⏳</span><p>Parsing Resume...</p>`;
      
      try {
        const reader = new FileReader();
        reader.onload = async function() {
          try {
            const typedarray = new Uint8Array(this.result);
            
            // Fix: Use window.pdfjsLib which is standard for CDN loads
            const pdfjsLib = window.pdfjsLib;
            if (!pdfjsLib) {
              throw new Error('PDF.js library not loaded');
            }

            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            
            const loadingTask = pdfjsLib.getDocument({ data: typedarray });
            const pdf = await loadingTask.promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              
              let lastY = -1;
              let pageText = '';
              
              for (const item of textContent.items) {
                const currentY = item.transform[5];
                if (lastY !== -1 && Math.abs(currentY - lastY) > 5) {
                  pageText += '\n';
                }
                pageText += item.str + ' ';
                lastY = currentY;
              }
              fullText += pageText + '\n';
            }
            
            console.log('Extracted text:', fullText);
            const parsed = parseResumeText(fullText);
            
            // Merge parsed data into state (Overwrite for fresh start)
            let count = 0;
            if (parsed.name) { state.name = parsed.name; count++; }
            if (parsed.bio) { state.bio = parsed.bio; count++; }
            
            if (parsed.skills?.length) {
              state.skills = [...parsed.skills];
              count += parsed.skills.length;
            }
            if (parsed.experience?.length) {
              state.experience = [...parsed.experience];
              count += parsed.experience.length;
            }
            if (parsed.education?.length) {
              state.education = [...parsed.education];
              count += parsed.education.length;
            }
            
            saveState();
            initApp();
            
            if (count > 0) {
              alert(`Resume imported! We found ${count} items (name, skills, etc.) and auto-filled them.`);
            } else {
              alert('Resume parsed, but we couldn\'t identify specific sections. Please ensure your PDF is selectable text.');
            }
          } catch (innerErr) {
            console.error('Inner parsing error:', innerErr);
            alert(`Error parsing PDF: ${innerErr.message}`);
            initApp();
          }
        };
        reader.readAsArrayBuffer(file);
      } catch (err) {
        console.error('Outer parsing error:', err);
        alert('Error reading file. Please try again.');
        initApp();
      }
    };
  }

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

  const githubInput = document.querySelector('#input-github');
  if (githubInput) {
    githubInput.addEventListener('input', (e) => {
      state.githubUsername = e.target.value;
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

  const fetchGithub = document.querySelector('#fetch-github-projects');
  if (fetchGithub) {
    fetchGithub.onclick = async () => {
      if (!state.githubUsername) return;
      fetchGithub.innerHTML = 'Fetching... ⏳';
      try {
        const response = await fetch(`https://api.github.com/users/${state.githubUsername}/repos?sort=updated&per_page=5`);
        const repos = await response.json();
        
        if (Array.isArray(repos)) {
          repos.forEach(repo => {
            // Avoid duplicates
            if (!state.projects.find(p => p.title === repo.name)) {
              state.projects.push({
                title: repo.name,
                description: repo.description || 'No description provided.',
                tech: repo.language || 'Code',
                link: repo.html_url
              });
            }
          });
          saveState();
          renderStepContent();
        }
      } catch (err) {
        alert('Could not fetch repos. Check username or rate limits.');
      } finally {
        fetchGithub.innerHTML = 'Fetch from GitHub ✨';
      }
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

  // Auth and Dashboard
  const logoutBtn = document.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      state.currentUser = null;
      state.showDashboard = false;
      initApp();
    };
  }

  const dashboardBtn = document.querySelector('#dashboard-btn');
  if (dashboardBtn) {
    dashboardBtn.onclick = () => {
      state.showDashboard = !state.showDashboard;
      initApp();
    };
  }

  const savePortfolioBtn = document.querySelector('#save-portfolio-btn');
  if (savePortfolioBtn) {
    savePortfolioBtn.onclick = () => {
      if (!state.currentUser) return;
      auth.savePortfolio(state.currentUser.username, {
        ...state,
        id: state.id || Date.now(), // Preserve ID if it exists
        updatedAt: new Date().toISOString()
      });
      alert('Portfolio saved successfully!');
      initApp();
    };
  }

  // Theme Switching
  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.onclick = () => {
      state.theme = opt.dataset.theme;
      saveState();
      initApp(); // Re-render sidebar to show active theme
    };
  });

  const modeBtn = document.querySelector('#mode-toggle-btn');
  if (modeBtn) {
    modeBtn.onclick = () => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      saveState();
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

  const pdfBtn = document.querySelector('#export-pdf-btn');
  if (pdfBtn) {
    pdfBtn.onclick = () => {
      const iframe = document.querySelector('#preview-frame');
      if (iframe) {
        iframe.contentWindow.print();
      }
    };
  }

  const shareBtn = document.querySelector('#share-link-btn');
  if (shareBtn) {
    shareBtn.onclick = () => {
      // Create a shareable state object (excluding auth data)
      const shareData = { ...state, currentUser: null, showDashboard: false };
      const serialized = btoa(unescape(encodeURIComponent(JSON.stringify(shareData))));
      const url = `${window.location.origin}${window.location.pathname}#view=${serialized}`;
      
      navigator.clipboard.writeText(url).then(() => {
        const status = document.querySelector('#share-status');
        status.style.display = 'block';
        setTimeout(() => status.style.display = 'none', 3000);
      });
    };
  }
};

// --- Preview Rendering ---
const updatePreview = () => {
  const iframe = document.querySelector('#preview-frame');
  if (iframe) {
    const dataToRender = state.currentUser ? state : { ...demoState, mode: state.mode, theme: state.theme };
    const html = generatePortfolioHTML(dataToRender);
    iframe.srcdoc = html;
  }
};

const demoState = {
  name: 'John Doe',
  bio: 'A passionate Full Stack Developer with 5+ years of experience building scalable web applications. I love turning complex problems into simple, beautiful designs.',
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Docker', 'AWS', 'PostgreSQL', 'Tailwind CSS'],
  experience: [
    { role: 'Senior Developer', company: 'Tech Solutions Inc.', duration: '2021 - Present', description: 'Leading a team of 10 developers to build modern SaaS platforms.' },
    { role: 'Software Engineer', company: 'Creative Agency', duration: '2018 - 2021', description: 'Developed highly interactive user interfaces and managed cloud deployments.' }
  ],
  education: [
    { degree: 'B.S. Computer Science', school: 'Tech University', year: '2018' }
  ],
  projects: [
    { title: 'CloudSync', description: 'A real-time file synchronization service.', tech: 'Go, WebSockets, S3' }
  ],
  theme: 'minimal',
  mode: 'dark'
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
  // Check for shared state in URL
  const hash = window.location.hash;
  if (hash.startsWith('#view=')) {
    try {
      const serialized = hash.replace('#view=', '');
      const sharedData = JSON.parse(decodeURIComponent(escape(atob(serialized))));
      state = { ...state, ...sharedData, currentStep: 1 }; // Load into editor
      // Clear hash to avoid reloading on refresh
      window.history.replaceState(null, null, ' ');
    } catch (err) {
      console.error('Failed to load shared state', err);
    }
  }

  // Update body theme
  if (state.mode === 'light') {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }

  app.innerHTML = '';
  const mainContainer = document.createElement('div');
  mainContainer.className = 'builder-container';
  
  mainContainer.appendChild(renderForm());
  mainContainer.appendChild(renderPreview());
  
  app.appendChild(mainContainer);
  renderStepContent();
  attachEventListeners();
  updatePreview();
};

initApp();
