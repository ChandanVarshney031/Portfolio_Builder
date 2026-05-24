export const generatePortfolioHTML = (data) => {
  const { name, bio, skills, education, experience, projects, theme = 'minimal', mode = 'dark', tempItem = null } = data;

  let displayExperience = [...experience];
  let displayEducation = [...education];
  let displayProjects = [...projects];

  if (tempItem) {
    if (tempItem.type === 'experience') displayExperience.push(tempItem);
    if (tempItem.type === 'education') displayEducation.push(tempItem);
    if (tempItem.type === 'projects') displayProjects.push(tempItem);
  }

  const formatBio = (bioText) => {
    if (!bioText) return '<p>Building the future, one line of code at a time.</p>';
    
    const lines = bioText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let html = '';
    let inList = false;

    lines.forEach(line => {
      if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
        if (!inList) {
          html += '<ul style="list-style-position: inside; margin-top: 1rem; color: var(--text-muted);">';
          inList = true;
        }
        html += `<li style="margin-bottom: 0.5rem;">${line.substring(1).trim()}</li>`;
      } else {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        html += `<p style="margin-bottom: 1rem; color: var(--text-muted);">${line}</p>`;
      }
    });

    if (inList) html += '</ul>';
    return html;
  };

  // --- Get Custom Icons ---
  const getProjectIcon = (proj) => {
    if (proj.icon) return proj.icon;
    if (proj.link && proj.link.includes('github.com')) return '🐙';
    return '🚀';
  };

  // --- Theme Selection HTML Generator ---
  const renderPortfolioContent = () => {
    const isDark = mode === 'dark';

    // 1. MINIMAL THEME
    if (theme === 'minimal') {
      const skillsHTML = skills.map(skill => `<div class="min-skill-chip">${skill}</div>`).join('');
      const experienceHTML = displayExperience.map(exp => `
        <div class="min-timeline-item">
          <div class="min-timeline-date">${exp.duration || 'Duration'}</div>
          <div class="min-timeline-content">
            <h4>${exp.role || 'Role'}</h4>
            <p class="min-company">${exp.company || 'Company'}</p>
            <p class="min-desc">${exp.description || ''}</p>
          </div>
        </div>
      `).join('');

      const educationHTML = displayEducation.map(edu => `
        <div class="min-timeline-item">
          <div class="min-timeline-date">${edu.year || 'Year'}</div>
          <div class="min-timeline-content">
            <h4>${edu.degree || 'Degree'}</h4>
            <p class="min-company">${edu.school || 'Institution'}</p>
          </div>
        </div>
      `).join('');

      const projectsHTML = displayProjects.map(proj => `
        <div class="min-project-card">
          <div class="min-project-image">
            <span class="min-project-emoji">${getProjectIcon(proj)}</span>
          </div>
          <div class="min-project-info">
            <h3>${proj.title || 'Project Title'}</h3>
            <p>${proj.description || 'Project description...'}</p>
            <div class="min-project-tags">
              ${(proj.tech || '').split(',').map(t => t.trim() ? `<span class="min-tag">${t.trim()}</span>` : '').join('')}
            </div>
            ${proj.link ? `<a href="${proj.link}" target="_blank" class="min-link">${proj.link.includes('github.com') ? 'View Source →' : 'Live Demo →'}</a>` : ''}
          </div>
        </div>
      `).join('');

      return `
        <!-- Minimal Theme Header -->
        <header class="min-header">
          <div class="min-avatar">${(name || 'Portfolio')[0].toUpperCase()}</div>
          <h1 class="min-name">${name || 'Chandan Varshney'}</h1>
          <p class="min-title">${(bio || '').split('\n')[0] || 'Creative Professional'}</p>
          <div class="min-socials">
            <a href="#projects">Portfolio</a>
            <a href="#experience">About</a>
          </div>
        </header>

        <div class="p-container">
          <!-- Projects Section -->
          <section id="projects" class="reveal">
            <h2 class="min-section-title">Selected Works</h2>
            <div class="min-projects-grid">${projectsHTML || '<p class="empty-msg">No projects added yet.</p>'}</div>
          </section>

          <!-- Expertise/Skills Section -->
          <section id="skills" class="reveal">
            <h2 class="min-section-title">Expertise</h2>
            <div class="min-skills-container">${skillsHTML || '<p class="empty-msg">No skills added yet.</p>'}</div>
          </section>

          <!-- Experience Section -->
          <section id="experience" class="reveal">
            <h2 class="min-section-title">Experience</h2>
            <div class="min-timeline">${experienceHTML || '<p class="empty-msg">No experience added yet.</p>'}</div>
          </section>

          <!-- Education Section -->
          <section id="education" class="reveal">
            <h2 class="min-section-title">Education</h2>
            <div class="min-timeline">${educationHTML || '<p class="empty-msg">No education added yet.</p>'}</div>
          </section>

        </div>
      `;
    }

    // 2. CREATIVE THEME
    if (theme === 'creative') {
      const skillsHTML = skills.map((skill, index) => `
        <div class="crt-skill-chip" style="transform: rotate(${(index % 2 === 0 ? -2 : 2) * (index % 3 + 1)}deg);">
          ${skill}
        </div>
      `).join('');

      const projectsHTML = displayProjects.map(proj => `
        <div class="crt-project-card">
          <div class="crt-project-glow"></div>
          <div class="crt-project-icon">${getProjectIcon(proj)}</div>
          <h3 class="crt-project-title">${proj.title || 'Project Title'}</h3>
          <p class="crt-project-desc">${proj.description || 'Project description...'}</p>
          <div class="crt-project-tags">
            ${(proj.tech || '').split(',').map(t => t.trim() ? `<span class="crt-tag">${t.trim()}</span>` : '').join('')}
          </div>
          ${proj.link ? `<a href="${proj.link}" target="_blank" class="crt-btn-outline">Explore Source</a>` : ''}
        </div>
      `).join('');

      const experienceHTML = displayExperience.map(exp => `
        <div class="crt-timeline-card">
          <span class="crt-time-badge">${exp.duration || 'Duration'}</span>
          <h4 class="crt-timeline-role">${exp.role || 'Role'}</h4>
          <p class="crt-timeline-company">${exp.company || 'Company'}</p>
          <p class="crt-timeline-desc">${exp.description || ''}</p>
        </div>
      `).join('');

      const educationHTML = displayEducation.map(edu => `
        <div class="crt-timeline-card">
          <span class="crt-time-badge">${edu.year || 'Year'}</span>
          <h4 class="crt-timeline-role">${edu.degree || 'Degree'}</h4>
          <p class="crt-timeline-company">${edu.school || 'Institution'}</p>
        </div>
      `).join('');

      return `
        <div class="crt-glow-bg"></div>
        <div class="p-container crt-workspace">
          <!-- Creative Header -->
          <header class="crt-header">
            <div class="crt-header-badge">Creative Theme</div>
            <h1 class="crt-main-title">
              <span class="crt-name-glow">${(name || 'ALEX CHEN').toUpperCase()}</span>
              <span class="crt-divider">|</span>
              <span class="crt-role-glow">${((bio || '').split('\n')[0] || 'Visual Artist').toUpperCase()}</span>
            </h1>
            <div class="crt-bio-content">${formatBio(bio)}</div>
            <div style="margin-top: 2.5rem;">
              <a href="#projects" class="crt-action-btn">Explore Works</a>
            </div>
          </header>

          <!-- Creative Works / Projects Section -->
          <section id="projects" class="reveal crt-section">
            <h2 class="crt-section-title">Projects</h2>
            <div class="crt-projects-grid">${projectsHTML || '<p class="empty-msg">No projects added yet.</p>'}</div>
          </section>

          <!-- Expertise / Skills Section -->
          <section id="skills" class="reveal crt-section">
            <h2 class="crt-section-title">Skills</h2>
            <div class="crt-skills-container">${skillsHTML || '<p class="empty-msg">No skills added yet.</p>'}</div>
          </section>

          <!-- Work Experience Section -->
          <section id="experience" class="reveal crt-section">
            <h2 class="crt-section-title">Experience</h2>
            <div class="crt-timeline-grid">${experienceHTML || '<p class="empty-msg">No experience added yet.</p>'}</div>
          </section>

          <!-- Education Section -->
          <section id="education" class="reveal crt-section">
            <h2 class="crt-section-title">Education</h2>
            <div class="crt-timeline-grid">${educationHTML || '<p class="empty-msg">No education added yet.</p>'}</div>
          </section>

        </div>
      `;
    }

    // 3. CORPORATE THEME
    if (theme === 'corporate') {
      const skillsHTML = skills.map((skill, index) => {
        const proficiency = 90 - (index * 7) > 50 ? 90 - (index * 7) : 65;
        return `
          <div class="corp-skill-item">
            <div class="corp-skill-header">
              <span class="corp-skill-label">${skill}</span>
              <span class="corp-skill-percent">${proficiency}%</span>
            </div>
            <div class="corp-skill-track">
              <div class="corp-skill-fill" style="width: ${proficiency}%;"></div>
            </div>
          </div>
        `;
      }).join('');

      const projectsHTML = displayProjects.map(proj => `
        <div class="corp-project-card">
          <div class="corp-proj-icon">${getProjectIcon(proj)}</div>
          <h3 class="corp-proj-title">${proj.title || 'Project Title'}</h3>
          <p class="corp-proj-desc">${proj.description || 'Project description...'}</p>
          <div class="corp-proj-tags">
            ${(proj.tech || '').split(',').map(t => t.trim() ? `<span class="corp-tag">${t.trim()}</span>` : '').join('')}
          </div>
          ${proj.link ? `<a href="${proj.link}" target="_blank" class="corp-proj-link">View Details →</a>` : ''}
        </div>
      `).join('');

      const experienceHTML = displayExperience.map(exp => `
        <div class="corp-timeline-card">
          <div class="corp-timeline-header">
            <span class="corp-timeline-company">${exp.company || 'Company'}</span>
            <span class="corp-timeline-duration">${exp.duration || 'Duration'}</span>
          </div>
          <h4 class="corp-timeline-role">${exp.role || 'Role'}</h4>
          <p class="corp-timeline-desc">${exp.description || ''}</p>
        </div>
      `).join('');

      const educationHTML = displayEducation.map(edu => `
        <div class="corp-timeline-card">
          <div class="corp-timeline-header">
            <span class="corp-timeline-company">${edu.school || 'Institution'}</span>
            <span class="corp-timeline-duration">${edu.year || 'Year'}</span>
          </div>
          <h4 class="corp-timeline-role">${edu.degree || 'Degree'}</h4>
        </div>
      `).join('');

      return `
        <div class="p-container corp-workspace">
          <!-- Corporate Header -->
          <header class="corp-header">
            <h1 class="corp-title">
              <span class="corp-name">${name || 'David Miller'}</span>
              <span class="corp-divider">|</span>
              <span class="corp-role">${(bio || '').split('\n')[0] || 'Product Manager'}</span>
            </h1>
            <div class="corp-bio-para">${formatBio(bio)}</div>
          </header>

          <!-- Timeline Section -->
          <section id="experience" class="reveal corp-section">
            <h2 class="corp-section-title">Experience Timeline</h2>
            <div class="corp-timeline-container">${experienceHTML || '<p class="empty-msg">No experience added yet.</p>'}</div>
          </section>

          <!-- Skills Section -->
          <section id="skills" class="reveal corp-section">
            <h2 class="corp-section-title">Skills & Competency</h2>
            <div class="corp-skills-grid">${skillsHTML || '<p class="empty-msg">No skills added yet.</p>'}</div>
          </section>

          <!-- Projects Section -->
          <section id="projects" class="reveal corp-section">
            <h2 class="corp-section-title">Key Projects</h2>
            <div class="corp-projects-grid">${projectsHTML || '<p class="empty-msg">No projects added yet.</p>'}</div>
          </section>

          <!-- Education Section -->
          <section id="education" class="reveal corp-section">
            <h2 class="corp-section-title">Education</h2>
            <div class="corp-timeline-container">${educationHTML || '<p class="empty-msg">No education added yet.</p>'}</div>
          </section>

        </div>
      `;
    }

    // 4. MODERN THEME (GLASSMORPHIC)
    if (theme === 'modern') {
      const skillsHTML = skills.map(skill => `
        <span class="mod-pill">${skill}</span>
      `).join('');

      const projectsHTML = displayProjects.map(proj => `
        <div class="mod-glass-card mod-project-card">
          <div class="mod-project-icon-circle">
            <span>${getProjectIcon(proj)}</span>
          </div>
          <h3 class="mod-project-title">${proj.title || 'Project'}</h3>
          <p class="mod-project-desc">${proj.description || 'Project description...'}</p>
          <div class="mod-project-tags">
            ${(proj.tech || '').split(',').map(t => t.trim() ? `<span class="mod-tag">${t.trim()}</span>` : '').join('')}
          </div>
          ${proj.link ? `<a href="${proj.link}" target="_blank" class="mod-project-link">Explore Source →</a>` : ''}
        </div>
      `).join('');

      const experienceHTML = displayExperience.map(exp => `
        <div class="mod-glass-card mod-experience-card">
          <span class="mod-badge">${exp.duration || 'Duration'}</span>
          <h4 class="mod-exp-title">${exp.role || 'Role'}</h4>
          <div class="mod-exp-company">${exp.company || 'Company'}</div>
          <p class="mod-exp-desc">${exp.description || ''}</p>
        </div>
      `).join('');

      const educationHTML = displayEducation.map(edu => `
        <div class="mod-glass-card mod-experience-card">
          <span class="mod-badge">${edu.year || 'Year'}</span>
          <h4 class="mod-exp-title">${edu.degree || 'Degree'}</h4>
          <div class="mod-exp-company">${edu.school || 'Institution'}</div>
        </div>
      `).join('');

      return `
        <div class="mod-glass-bg"></div>
        <div class="p-container mod-workspace">
          <!-- Top Glass Nav Branding -->
          <div class="mod-logo-branding">Portfolio</div>

          <!-- Modern Glass Header -->
          <header class="mod-header">
            <h1 class="mod-main-title">
              <span class="mod-name">${name || 'Mia Wong'}</span>
              <span class="mod-divider">|</span>
              <span class="mod-role">${(bio || '').split('\n')[0] || 'Digital Creator'}</span>
            </h1>
            <div class="mod-tags-container">
              ${skillsHTML ? skillsHTML : '<span class="mod-pill">Web Design</span><span class="mod-pill">Branding</span>'}
            </div>
            <div class="mod-glass-card mod-bio-card">
              <div class="mod-card-label">My Profile</div>
              <div class="mod-bio-text">${formatBio(bio)}</div>
            </div>
          </header>

          <!-- Modern Projects Grid -->
          <section id="projects" class="reveal mod-section">
            <h2 class="mod-section-title">Highlights & Works</h2>
            <div class="mod-projects-grid">${projectsHTML || '<p class="empty-msg">No projects added yet.</p>'}</div>
          </section>

          <!-- Modern Experience Grid -->
          <section id="experience" class="reveal mod-section">
            <h2 class="mod-section-title">Experience</h2>
            <div class="mod-experience-grid">${experienceHTML || '<p class="empty-msg">No experience added yet.</p>'}</div>
          </section>

          <!-- Modern Education Grid -->
          <section id="education" class="reveal mod-section">
            <h2 class="mod-section-title">Education</h2>
            <div class="mod-experience-grid">${educationHTML || '<p class="empty-msg">No education added yet.</p>'}</div>
          </section>

        </div>
      `;
    }
  };

  const getThemeStyles = () => {
    const isDark = mode === 'dark';

    // Core Colors and Animations
    let baseStyles = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { font-family: 'Inter', sans-serif; line-height: 1.6; overflow-x: hidden; }
      h1, h2, h3, h4 { font-family: 'Outfit', sans-serif; }
      .p-container { max-width: 1100px; margin: 0 auto; padding: 2rem; }
      section { padding: 5rem 0; position: relative; }
      
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      .reveal { animation: fadeInUp 0.8s ease forwards; }
      
      .empty-msg { font-size: 0.95rem; opacity: 0.5; font-style: italic; }
      
      @media (max-width: 768px) {
        section { padding: 3rem 0; }
        .p-container { padding: 1rem; }
      }
    `;

    // 1. MINIMAL THEME CSS
    if (theme === 'minimal') {
      const minBg = isDark ? '#080808' : '#ffffff';
      const minText = isDark ? '#ffffff' : '#111111';
      const minTextMuted = isDark ? '#888888' : '#666666';
      const minBorder = isDark ? '#222222' : '#eaeaea';
      const minImgBg = isDark ? '#1a1a1a' : '#f5f5f5';

      return baseStyles + `
        body { background: ${minBg}; color: ${minText}; font-family: 'Lora', serif; }
        .min-header { text-align: center; padding: 6rem 1rem 3rem 1rem; border-bottom: 1px solid ${minBorder}; }
        .min-avatar { width: 80px; height: 80px; border-radius: 50%; background: ${minBorder}; display: inline-flex; align-items: center; justify-content: center; font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 2rem; color: ${minText}; margin-bottom: 1.5rem; }
        .min-name { font-size: 2.5rem; font-weight: 700; font-family: 'Lora', serif; letter-spacing: -0.5px; }
        .min-title { font-size: 1.1rem; color: ${minTextMuted}; margin-top: 0.5rem; font-family: 'Lora', serif; font-style: italic; }
        .min-socials { display: flex; justify-content: center; gap: 2rem; margin-top: 1.5rem; }
        .min-socials a { color: ${minText}; text-decoration: none; font-size: 0.9rem; font-weight: 600; border-bottom: 1px solid ${minBorder}; padding-bottom: 2px; font-family: 'Inter', sans-serif; transition: opacity 0.2s; }
        .min-socials a:hover { opacity: 0.7; }
        
        .min-section-title { font-size: 1.6rem; font-weight: 700; border-left: 3px solid ${minText}; padding-left: 0.8rem; margin-bottom: 2.5rem; font-family: 'Lora', serif; }
        
        .min-projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2.5rem; }
        .min-project-card { border: 1px solid ${minBorder}; overflow: hidden; background: ${minBg}; }
        .min-project-image { height: 180px; background: ${minImgBg}; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
        .min-project-info { padding: 1.5rem; }
        .min-project-info h3 { font-size: 1.25rem; margin-bottom: 0.5rem; font-family: 'Lora', serif; }
        .min-project-info p { font-size: 0.9rem; color: ${minTextMuted}; font-family: 'Inter', sans-serif; line-height: 1.5; margin-bottom: 1rem; }
        .min-project-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.2rem; }
        .min-tag { font-size: 0.75rem; background: ${minImgBg}; color: ${minText}; padding: 0.2rem 0.5rem; font-family: 'Inter', sans-serif; }
        .min-link { font-size: 0.85rem; color: ${minText}; text-decoration: none; font-weight: 700; border-bottom: 1px solid ${minText}; font-family: 'Inter', sans-serif; transition: opacity 0.2s; }
        .min-link:hover { opacity: 0.7; }
        
        .min-skills-container { display: flex; flex-wrap: wrap; gap: 1rem; }
        .min-skill-chip { padding: 0.6rem 1.5rem; border: 1px solid ${minBorder}; font-size: 0.9rem; color: ${minText}; font-family: 'Inter', sans-serif; }
        
        .min-timeline { display: flex; flex-direction: column; gap: 2rem; border-left: 1px solid ${minBorder}; padding-left: 2rem; margin-left: 0.5rem; }
        .min-timeline-item { position: relative; margin-bottom: 1rem; }
        .min-timeline-item::before { content: ''; position: absolute; left: calc(-2rem - 5px); top: 5px; width: 9px; height: 9px; border-radius: 50%; background: ${minText}; }
        .min-timeline-date { font-size: 0.85rem; font-weight: 700; color: ${minTextMuted}; font-family: 'Inter', sans-serif; margin-bottom: 0.3rem; }
        .min-timeline-content h4 { font-size: 1.15rem; font-family: 'Lora', serif; }
        .min-company { font-size: 0.9rem; font-weight: 600; color: ${minText}; margin-bottom: 0.5rem; font-family: 'Inter', sans-serif; }
        .min-desc { font-size: 0.9rem; color: ${minTextMuted}; font-family: 'Inter', sans-serif; line-height: 1.5; }
        
        .min-contact-section { text-align: center; padding: 4rem 1rem; border-top: 1px solid ${minBorder}; }
        .min-contact-section p { color: ${minTextMuted}; max-width: 500px; margin: 0 auto; font-family: 'Lora', serif; font-style: italic; }
        .min-btn { display: inline-block; padding: 0.8rem 2.2rem; background: ${minText}; color: ${minBg}; text-decoration: none; font-family: 'Inter', sans-serif; font-size: 0.9rem; font-weight: 600; margin-top: 1rem; transition: opacity 0.2s; }
        .min-btn:hover { opacity: 0.9; }
      `;
    }

    // 2. CREATIVE THEME CSS
    if (theme === 'creative') {
      return baseStyles + `
        body { background: #06060c; color: #ffffff; font-family: 'Outfit', sans-serif; }
        .crt-glow-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: -1; background: radial-gradient(circle at 85% 15%, rgba(244, 63, 94, 0.2), transparent 50%), radial-gradient(circle at 15% 85%, rgba(139, 92, 246, 0.2), transparent 50%), #06060c; }
        .crt-workspace { padding-top: 6rem; padding-bottom: 6rem; }
        
        .crt-header { text-align: left; margin-bottom: 6rem; position: relative; }
        .crt-header-badge { display: inline-block; background: rgba(244, 63, 94, 0.1); color: #f43f5e; border: 1.5px solid rgba(244, 63, 94, 0.3); padding: 0.4rem 1rem; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1.5rem; }
        .crt-main-title { font-size: clamp(2rem, 6vw, 4rem); font-weight: 900; line-height: 1.1; margin-bottom: 1.5rem; letter-spacing: -1.5px; }
        .crt-name-glow { color: #ffffff; }
        .crt-divider { color: #f43f5e; margin: 0 0.5rem; }
        .crt-role-glow { background: linear-gradient(135deg, #f43f5e, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .crt-bio-content { font-size: 1.15rem; color: #a1a1aa; max-width: 700px; line-height: 1.6; }
        
        .crt-action-btn { display: inline-block; padding: 1rem 2.5rem; background: linear-gradient(135deg, #f43f5e, #8b5cf6); color: white; text-decoration: none; font-weight: 800; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 50px; box-shadow: 0 0 20px rgba(244, 63, 94, 0.3); transition: all 0.3s; }
        .crt-action-btn:hover { transform: scale(1.05) translateY(-2px); box-shadow: 0 0 30px rgba(244, 63, 94, 0.6); }
        
        .crt-section { margin-bottom: 7rem; }
        .crt-section-title { font-size: clamp(3rem, 10vw, 6rem); font-weight: 900; text-transform: uppercase; line-height: 0.9; color: transparent; -webkit-text-stroke: 1.5px rgba(255,255,255,0.08); margin-bottom: 3rem; letter-spacing: -3px; }
        
        .crt-projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 3rem; }
        .crt-project-card { background: #0b0b14; border: 1.5px solid rgba(255, 255, 255, 0.05); padding: 2.5rem; border-radius: 20px; position: relative; overflow: hidden; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .crt-project-glow { position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, transparent 60%); pointer-events: none; transition: opacity 0.3s; }
        .crt-project-icon { font-size: 2.5rem; margin-bottom: 1.2rem; }
        .crt-project-title { font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 0.8rem; letter-spacing: -0.5px; }
        .crt-project-desc { color: #a1a1aa; font-size: 0.95rem; line-height: 1.5; margin-bottom: 1.5rem; }
        .crt-project-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.8rem; }
        .crt-tag { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); color: #e4e4e7; font-size: 0.75rem; padding: 0.25rem 0.6rem; border-radius: 4px; font-weight: 600; }
        .crt-btn-outline { display: inline-block; padding: 0.7rem 1.5rem; border: 1.5px solid rgba(244, 63, 94, 0.4); border-radius: 30px; color: #fff; text-decoration: none; font-size: 0.8rem; font-weight: 700; transition: all 0.3s; }
        .crt-btn-outline:hover { background: #f43f5e; border-color: #f43f5e; box-shadow: 0 0 15px rgba(244, 63, 94, 0.4); }
        .crt-project-card:hover { transform: translateY(-8px); border-color: rgba(244, 63, 94, 0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .crt-project-card:hover .crt-project-glow { background: radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 60%); }
        
        .crt-skills-container { display: flex; flex-wrap: wrap; gap: 1.2rem; }
        .crt-skill-chip { padding: 0.8rem 2rem; background: #0b0b14; border: 2px solid #ffffff; font-weight: 900; color: #fff; font-size: 1rem; text-transform: uppercase; transition: all 0.3s; cursor: default; }
        .crt-skill-chip:hover { background: #8b5cf6; border-color: #8b5cf6; color: #fff; transform: scale(1.1) rotate(0deg) !important; box-shadow: 0 0 20px rgba(139,92,246,0.5); }
        
        .crt-timeline-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
        .crt-timeline-card { background: #0b0b14; border: 1px solid rgba(255,255,255,0.05); padding: 2rem; border-radius: 16px; position: relative; }
        .crt-time-badge { display: inline-block; background: rgba(139, 92, 246, 0.15); color: #c084fc; font-size: 0.75rem; font-weight: 800; padding: 0.3rem 0.8rem; border-radius: 30px; margin-bottom: 1rem; }
        .crt-timeline-role { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.3rem; }
        .crt-timeline-company { font-size: 0.95rem; color: #f43f5e; font-weight: 700; margin-bottom: 0.8rem; }
        .crt-timeline-desc { font-size: 0.9rem; color: #a1a1aa; line-height: 1.5; }
        
        .crt-contact-section { text-align: center; padding: 6rem 1rem; background: radial-gradient(circle, rgba(244, 63, 94, 0.05) 0%, transparent 70%); border-radius: 30px; margin-top: 5rem; }
      `;
    }

    // 3. CORPORATE THEME CSS
    if (theme === 'corporate') {
      const corpBg = isDark ? '#0f172a' : '#f8fafc';
      const corpCard = isDark ? '#1e293b' : '#ffffff';
      const corpText = isDark ? '#f8fafc' : '#0f172a';
      const corpTextMuted = isDark ? '#94a3b8' : '#64748b';
      const corpBorder = isDark ? '#334155' : '#e2e8f0';
      const corpAccent = '#1e3a8a';
      const corpAccentGlow = 'rgba(30, 58, 138, 0.3)';

      return baseStyles + `
        body { background: ${corpBg}; color: ${corpText}; font-family: 'Inter', sans-serif; }
        .corp-workspace { padding-top: 5rem; padding-bottom: 6rem; }
        
        .corp-header { margin-bottom: 5rem; padding-bottom: 3rem; border-bottom: 1.5px solid ${corpBorder}; }
        .corp-title { font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; color: ${corpText}; letter-spacing: -0.5px; }
        .corp-name { color: ${corpText}; }
        .corp-divider { color: ${corpTextMuted}; margin: 0 0.8rem; font-weight: 300; }
        .corp-role { color: ${corpTextMuted}; font-weight: 400; }
        .corp-bio-para { font-size: 1.1rem; color: ${corpTextMuted}; max-width: 800px; margin-top: 1.5rem; line-height: 1.6; }
        
        .corp-section { margin-bottom: 5rem; }
        .corp-section-title { font-size: 1.4rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: ${corpText}; margin-bottom: 2.5rem; display: flex; align-items: center; }
        .corp-section-title::after { content: ''; flex: 1; height: 1px; background: ${corpBorder}; margin-left: 1.5rem; }
        
        .corp-timeline-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .corp-timeline-card { background: ${corpCard}; border: 1.5px solid ${corpBorder}; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .corp-timeline-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
        .corp-timeline-company { font-size: 1.2rem; font-weight: 800; color: ${corpText}; }
        .corp-timeline-duration { font-size: 0.85rem; font-weight: 600; color: ${corpTextMuted}; text-transform: uppercase; letter-spacing: 0.5px; }
        .corp-timeline-role { font-size: 1rem; font-weight: 600; color: ${isDark ? '#38bdf8' : '#0284c7'}; margin-bottom: 0.8rem; }
        .corp-timeline-desc { font-size: 0.95rem; color: ${corpTextMuted}; line-height: 1.5; }
        
        .corp-skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
        .corp-skill-item { background: ${corpCard}; border: 1px solid ${corpBorder}; padding: 1.5rem; border-radius: 10px; }
        .corp-skill-header { display: flex; justify-content: space-between; margin-bottom: 0.6rem; font-weight: 600; font-size: 0.95rem; }
        .corp-skill-label { color: ${corpText}; }
        .corp-skill-percent { color: ${isDark ? '#38bdf8' : '#0284c7'}; }
        .corp-skill-track { height: 6px; background: ${corpBorder}; border-radius: 10px; overflow: hidden; }
        .corp-skill-fill { height: 100%; background: ${isDark ? '#38bdf8' : '#0284c7'}; border-radius: 10px; transition: width 1s ease-out; }
        
        .corp-projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
        .corp-project-card { background: ${corpCard}; border: 1.5px solid ${corpBorder}; padding: 2rem; border-radius: 12px; transition: all 0.3s; }
        .corp-project-card:hover { transform: translateY(-4px); border-color: ${isDark ? '#38bdf8' : '#0284c7'}; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .corp-proj-icon { font-size: 2rem; margin-bottom: 1rem; }
        .corp-proj-title { font-size: 1.25rem; font-weight: 800; color: ${corpText}; margin-bottom: 0.5rem; }
        .corp-proj-desc { color: ${corpTextMuted}; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.2rem; }
        .corp-proj-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.5rem; }
        .corp-tag { font-size: 0.75rem; background: ${corpBorder}; color: ${corpText}; padding: 0.2rem 0.5rem; border-radius: 3px; font-weight: 500; }
        .corp-proj-link { font-size: 0.85rem; color: ${isDark ? '#38bdf8' : '#0284c7'}; text-decoration: none; font-weight: 700; }
        
        .corp-contact-section { margin-top: 5rem; }
        .corp-contact-card { background: ${corpCard}; border: 1.5px solid ${corpBorder}; padding: 2.5rem; border-radius: 16px; }
        .corp-contact-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid ${corpBorder}; }
        .corp-contact-row:last-child { border-bottom: 0; }
        .corp-contact-row span:first-child { font-weight: 600; color: ${corpText}; }
        .corp-contact-val { color: ${corpTextMuted}; font-size: 0.95rem; }
      `;
    }

    // 4. MODERN THEME CSS (GLASSMORPHIC)
    if (theme === 'modern') {
      const gradientBg = 'linear-gradient(135deg, #ff8a65, #f06292, #4fc3f7)';

      return baseStyles + `
        body { background: ${gradientBg}; color: #ffffff; font-family: 'Outfit', sans-serif; min-height: 100vh; }
        .mod-workspace { padding-top: 7rem; padding-bottom: 7rem; position: relative; z-index: 2; }
        
        .mod-logo-branding { position: absolute; top: 2.5rem; left: 2rem; font-weight: 800; font-size: 1.3rem; letter-spacing: -0.5px; opacity: 0.9; }
        
        .mod-header { text-align: left; margin-bottom: 5rem; }
        .mod-main-title { font-size: clamp(2.2rem, 6vw, 4.5rem); font-weight: 800; color: #fff; letter-spacing: -2px; margin-bottom: 1rem; line-height: 1.05; }
        .mod-name { text-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .mod-divider { opacity: 0.5; margin: 0 0.5rem; }
        .mod-role { opacity: 0.9; font-weight: 500; text-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        
        .mod-tags-container { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-top: 1.5rem; margin-bottom: 2.5rem; }
        .mod-pill { background: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1.5px solid rgba(255, 255, 255, 0.3); color: #fff; padding: 0.5rem 1.2rem; border-radius: 30px; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        
        .mod-glass-card { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1.5px solid rgba(255, 255, 255, 0.25); border-radius: 24px; padding: 2.5rem; box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.06); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .mod-glass-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.4); box-shadow: 0 15px 35px 0 rgba(0,0,0,0.1); }
        
        .mod-bio-card { max-width: 800px; }
        .mod-card-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; opacity: 0.6; margin-bottom: 0.8rem; }
        .mod-bio-text { font-size: 1.1rem; line-height: 1.6; opacity: 0.95; }
        
        .mod-section { margin-bottom: 6rem; }
        .mod-section-title { font-size: 2.2rem; font-weight: 800; color: #fff; margin-bottom: 3rem; text-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        
        .mod-projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2.5rem; }
        .mod-project-card { display: flex; flex-direction: column; }
        .mod-project-icon-circle { width: 60px; height: 60px; background: rgba(255, 255, 255, 0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 1.5rem; }
        .mod-project-title { font-size: 1.35rem; font-weight: 800; color: #fff; margin-bottom: 0.6rem; }
        .mod-project-desc { font-size: 0.95rem; opacity: 0.85; line-height: 1.5; margin-bottom: 1.5rem; flex: 1; }
        .mod-project-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.8rem; }
        .mod-tag { font-size: 0.75rem; background: rgba(255,255,255,0.15); color: #fff; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; }
        .mod-project-link { font-size: 0.85rem; color: #fff; text-decoration: none; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.5); padding-bottom: 2px; align-self: flex-start; transition: border-color 0.2s; }
        .mod-project-link:hover { border-color: #fff; }
        
        .mod-experience-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
        .mod-experience-card { position: relative; }
        .mod-badge { display: inline-block; background: rgba(255, 255, 255, 0.25); border-radius: 20px; font-size: 0.7rem; font-weight: 700; padding: 0.3rem 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 1.2rem; }
        .mod-exp-title { font-size: 1.25rem; font-weight: 800; color: #fff; }
        .mod-exp-company { font-size: 0.95rem; opacity: 0.9; font-weight: 600; margin-top: 0.2rem; margin-bottom: 1rem; }
        .mod-exp-desc { font-size: 0.9rem; opacity: 0.85; line-height: 1.5; }
        
        .mod-contact-section { margin-top: 6rem; }
        .mod-contact-container { text-align: center; padding: 4rem 2rem; }
        .mod-contact-action-btn { display: inline-block; padding: 1rem 2.5rem; background: #ffffff; color: #f06292; font-weight: 800; font-size: 0.95rem; border-radius: 50px; text-decoration: none; box-shadow: 0 10px 25px rgba(0,0,0,0.1); transition: all 0.3s; }
        .mod-contact-action-btn:hover { transform: scale(1.05); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }
      `;
    }
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name || 'Portfolio'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;600;700;800;900&family=Lora:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>${getThemeStyles()}</style>
</head>
<body>
  ${renderPortfolioContent()}

  <script>
    // --- Intersection Observer for Scroll Reveals ---
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
        }
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach(s => observer.observe(s));
  </script>
</body>
</html>
  `;
};
