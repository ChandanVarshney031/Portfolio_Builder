export const generatePortfolioHTML = (data) => {
  const { name, bio, skills, education, experience, projects } = data;

  const skillsHTML = skills.map(skill => `
    <div class="p-skill-chip">${skill}</div>
  `).join('');

  const educationHTML = education.map(edu => `
    <div class="p-timeline-item">
      <div class="p-timeline-date">${edu.year}</div>
      <div class="p-timeline-content">
        <h4>${edu.degree}</h4>
        <p>${edu.school}</p>
      </div>
    </div>
  `).join('');

  const experienceHTML = experience.map(exp => `
    <div class="p-timeline-item">
      <div class="p-timeline-date">${exp.duration}</div>
      <div class="p-timeline-content">
        <h4>${exp.role}</h4>
        <p>${exp.company}</p>
        <p class="p-text-small">${exp.description}</p>
      </div>
    </div>
  `).join('');

  const projectsHTML = projects.map(proj => `
    <div class="p-project-card">
      <div class="p-project-image" style="background: linear-gradient(45deg, #1e293b, #3b82f6)">
        <span style="font-size: 2.5rem;">🚀</span>
      </div>
      <div class="p-project-info">
        <h3>${proj.title}</h3>
        <p>${proj.description}</p>
        <div class="p-project-tags">
          ${proj.tech.split(',').map(t => `<span class="p-tag">${t.trim()}</span>`).join('')}
        </div>
        ${proj.link ? `<a href="${proj.link}" target="_blank" class="p-link">View Project →</a>` : ''}
      </div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name || 'Portfolio'} | Professional Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #050505;
      --card: #111111;
      --accent: #3b82f6;
      --text: #ffffff;
      --text-muted: #888888;
      --border: rgba(255, 255, 255, 0.08);
      --gradient: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    html { scroll-behavior: smooth; }
    
    body { 
      font-family: 'Inter', sans-serif; 
      background: var(--bg); 
      color: var(--text); 
      line-height: 1.6;
      overflow-x: hidden;
    }
    
    h1, h2, h3, h4 { font-family: 'Outfit', sans-serif; font-weight: 700; }
    
    .p-container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
    
    /* Navigation */
    nav {
      position: fixed;
      top: 0;
      width: 100%;
      padding: 1.5rem 0;
      background: rgba(5, 5, 5, 0.8);
      backdrop-filter: blur(10px);
      z-index: 100;
      border-bottom: 1px solid var(--border);
    }
    
    .nav-content { display: flex; justify-content: space-between; align-items: center; }
    .nav-logo { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 1.25rem; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .nav-links { display: flex; gap: 2rem; }
    .nav-links a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; transition: color 0.3s; }
    .nav-links a:hover { color: var(--text); }

    /* Hero */
    .p-hero {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      background: radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 40%),
                  radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 40%);
    }
    
    .p-hero h1 { 
      font-size: clamp(3rem, 10vw, 6rem); 
      line-height: 1; 
      margin-bottom: 1.5rem; 
      letter-spacing: -0.02em;
    }
    
    .p-hero .highlight {
      background: var(--gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .p-hero p { 
      font-size: clamp(1.1rem, 2vw, 1.5rem); 
      color: var(--text-muted); 
      max-width: 700px; 
      margin-bottom: 2rem;
    }

    /* Sections */
    section { padding: 10rem 0; border-bottom: 1px solid var(--border); }
    .section-title { font-size: 2.5rem; margin-bottom: 4rem; display: flex; align-items: center; gap: 1rem; }
    .section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

    /* Skills */
    .p-skills-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
    .p-skill-chip { 
      background: var(--card); 
      border: 1px solid var(--border); 
      padding: 0.8rem 1.8rem; 
      border-radius: 12px; 
      font-weight: 500;
      transition: all 0.3s;
    }
    .p-skill-chip:hover { border-color: var(--accent); transform: translateY(-3px); }

    /* Timeline */
    .p-timeline { display: flex; flex-direction: column; gap: 4rem; }
    .p-timeline-item { display: grid; grid-template-columns: 200px 1fr; gap: 2rem; }
    .p-timeline-date { font-weight: 700; color: var(--accent); font-family: 'Outfit', sans-serif; font-size: 1.1rem; }
    .p-timeline-content h4 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .p-timeline-content p { color: var(--text-muted); }
    .p-text-small { margin-top: 1rem; font-size: 0.95rem; line-height: 1.7; }

    /* Projects */
    .p-projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2.5rem; }
    .p-project-card { 
      background: var(--card); 
      border: 1px solid var(--border); 
      border-radius: 24px; 
      overflow: hidden; 
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
    }
    .p-project-card:hover { 
      transform: translateY(-12px); 
      border-color: rgba(59, 130, 246, 0.3);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .p-project-image { height: 220px; display: flex; align-items: center; justify-content: center; opacity: 0.8; }
    .p-project-info { padding: 2rem; }
    .p-project-info h3 { font-size: 1.5rem; margin-bottom: 0.75rem; }
    .p-project-info p { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; height: 3rem; overflow: hidden; }
    .p-project-tags { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1.5rem; }
    .p-tag { font-size: 0.75rem; background: rgba(59, 130, 246, 0.1); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 6px; font-weight: 600; }
    .p-link { color: var(--text); text-decoration: none; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; }
    .p-link:hover { color: var(--accent); }

    /* Footer */
    footer { padding: 6rem 0; border-top: 1px solid var(--border); }
    .footer-content { display: flex; justify-content: space-between; align-items: center; color: var(--text-muted); font-size: 0.9rem; }

    @media (max-width: 768px) {
      .p-timeline-item { grid-template-columns: 1fr; gap: 0.5rem; }
      .nav-links { display: none; }
      section { padding: 6rem 0; }
    }
  </style>
</head>
<body>
  <nav>
    <div class="p-container nav-content">
      <div class="nav-logo">${(name || 'P').split(' ')[0]}</div>
      <div class="nav-links">
        <a href="#skills">Skills</a>
        <a href="#experience">Experience</a>
        <a href="#projects">Projects</a>
        <a href="#education">Education</a>
      </div>
    </div>
  </nav>

  <div class="p-hero">
    <div class="p-container">
      <h1>I'm <span class="highlight">${name || 'Alexander Vance'}</span></h1>
      <p>${bio || 'A creative professional dedicated to building exceptional digital experiences and solving complex problems.'}</p>
      <div style="display: flex; gap: 1rem; margin-top: 2rem;">
        <a href="#projects" style="background: var(--gradient); color: white; padding: 1rem 2.5rem; border-radius: 100px; text-decoration: none; font-weight: 700;">View My Work</a>
      </div>
    </div>
  </div>

  <section id="skills">
    <div class="p-container">
      <h2 class="section-title">Expertise</h2>
      <div class="p-skills-grid">
        ${skillsHTML || '<p style="color: var(--text-muted)">Showcasing your technical toolkit soon.</p>'}
      </div>
    </div>
  </section>

  <section id="experience">
    <div class="p-container">
      <h2 class="section-title">Journey</h2>
      <div class="p-timeline">
        ${experienceHTML || '<p style="color: var(--text-muted)">Your professional history will appear here.</p>'}
      </div>
    </div>
  </section>

  <section id="projects">
    <div class="p-container">
      <h2 class="section-title">Selected Works</h2>
      <div class="p-projects-grid">
        ${projectsHTML || '<p style="color: var(--text-muted)">Bringing your projects to light.</p>'}
      </div>
    </div>
  </section>

  <section id="education">
    <div class="p-container">
      <h2 class="section-title">Education</h2>
      <div class="p-timeline">
        ${educationHTML || '<p style="color: var(--text-muted)">Academic achievements and certifications.</p>'}
      </div>
    </div>
  </section>

  <footer>
    <div class="p-container footer-content">
      <p>&copy; ${new Date().getFullYear()} ${name || 'Alexander Vance'}. All rights reserved.</p>
      <p>Built with <span style="color: var(--accent)">ProFolio</span></p>
    </div>
  </footer>
</body>
</html>
  `;
};
