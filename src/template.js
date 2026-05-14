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

  const skillsHTML = skills.map(skill => `<div class="p-skill-chip">${skill}</div>`).join('');
  const educationHTML = displayEducation.map(edu => `
    <div class="p-timeline-item">
      <div class="p-timeline-date">${edu.year || 'Year'}</div>
      <div class="p-timeline-content">
        <h4>${edu.degree || 'Degree'}</h4>
        <p>${edu.school || 'Institution'}</p>
      </div>
    </div>
  `).join('');

  const experienceHTML = displayExperience.map(exp => `
    <div class="p-timeline-item">
      <div class="p-timeline-date">${exp.duration || 'Duration'}</div>
      <div class="p-timeline-content">
        <h4>${exp.role || 'Role'}</h4>
        <p>${exp.company || 'Company'}</p>
        <p class="p-text-small">${exp.description || ''}</p>
      </div>
    </div>
  `).join('');

  const projectsHTML = displayProjects.map(proj => `
    <div class="p-project-card">
      <div class="p-project-image"><span>${proj.icon || '🚀'}</span></div>
      <div class="p-project-info">
        <h3>${proj.title || 'Project Title'}</h3>
        <p>${proj.description || 'Project description...'}</p>
        <div class="p-project-tags">${(proj.tech || '').split(',').map(t => t.trim() ? `<span class="p-tag">${t.trim()}</span>` : '').join('')}</div>
        ${proj.link ? `<a href="${proj.link}" target="_blank" class="p-link">View Project →</a>` : ''}
      </div>
    </div>
  `).join('');

  const getThemeStyles = () => {
    const isDark = mode === 'dark';
    const darkColors = `--bg: #050505; --card: #111111; --text: #ffffff; --text-muted: #888888; --border: rgba(255,255,255,0.1); --accent: #3b82f6; --gradient: linear-gradient(135deg, #3b82f6, #8b5cf6);`;
    const lightColors = `--bg: #ffffff; --card: #f8f9fa; --text: #1a1a1a; --text-muted: #666666; --border: rgba(0,0,0,0.1); --accent: #2563eb; --gradient: linear-gradient(135deg, #2563eb, #7c3aed);`;

    let baseStyles = `
      :root { ${isDark ? darkColors : lightColors} }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; padding-top: 80px; overflow-x: hidden; }
      h1, h2, h3, h4 { font-family: 'Outfit', sans-serif; }
      .p-container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
      section { padding: 8rem 0; border-bottom: 1px solid var(--border); position: relative; }
      .p-hero { min-height: 80vh; display: flex; align-items: center; }
      .p-skill-chip { transition: all 0.3s; }
      .p-project-card { transition: all 0.3s; }
      
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      .reveal { animation: fadeInUp 0.8s ease forwards; }
    `;

    if (theme === 'creative') {
      return baseStyles + `
        --accent: #f43f5e;
        --gradient: linear-gradient(135deg, #f43f5e, #fb923c);
        body { background: ${isDark ? '#000' : '#fff'}; }
        .p-hero h1 { font-size: clamp(3rem, 15vw, 10rem); font-weight: 900; line-height: 0.8; text-transform: uppercase; letter-spacing: -5px; }
        .p-hero p { font-size: 1.5rem; margin-top: 2rem; border-left: 10px solid var(--accent); padding-left: 1rem; }
        .p-skill-chip { border-radius: 0; border: 3px solid var(--text); font-weight: 800; background: var(--bg); transform: rotate(-2deg); }
        .p-skill-chip:hover { transform: rotate(0deg) scale(1.1); background: var(--accent); color: white; }
        .p-project-card { border-radius: 0; border: 4px solid var(--text); box-shadow: 10px 10px 0 var(--accent); }
        .p-project-card:hover { transform: translate(-5px, -5px); box-shadow: 15px 15px 0 var(--text); }
        .section-title { font-size: 5rem; font-weight: 900; text-transform: uppercase; color: transparent; -webkit-text-stroke: 1px var(--text-muted); }
      `;
    } 
    
    if (theme === 'corporate') {
      return baseStyles + `
        --accent: #1e293b;
        --gradient: none;
        body { font-family: 'Lora', serif; background: ${isDark ? '#0f172a' : '#f1f5f9'}; }
        h1, h2, h3, h4 { font-family: 'Inter', sans-serif; font-weight: 600; color: ${isDark ? '#f8fafc' : '#0f172a'}; }
        .p-container { max-width: 900px; }
        .p-hero { text-align: center; border-bottom: 5px solid var(--accent); padding-bottom: 4rem; }
        .p-hero h1 { font-size: 3.5rem; border-bottom: 2px solid var(--border); display: inline-block; padding-bottom: 1rem; }
        .p-skill-chip { border-radius: 4px; background: var(--accent); color: white; padding: 0.5rem 1rem; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
        .p-project-card { border-radius: 8px; border: 1px solid var(--border); background: var(--card); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .p-timeline-date { font-family: 'Inter', sans-serif; color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; }
        .section-title { text-align: center; font-size: 1.8rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4rem; }
        .section-title::after { content: ''; display: block; width: 50px; height: 3px; background: var(--accent); margin: 1rem auto; }
      `;
    }

    if (theme === 'modern') {
      return baseStyles + `
        --accent: #22d3ee;
        --gradient: linear-gradient(135deg, #22d3ee, #818cf8);
        body { background: ${isDark ? '#020617' : '#f0f9ff'}; }
        .p-hero { position: relative; justify-content: center; text-align: center; }
        .p-hero::before { content: ''; position: absolute; top: -100px; left: -100px; width: 400px; height: 400px; background: var(--accent); filter: blur(150px); opacity: 0.2; border-radius: 50%; }
        .p-hero h1 { font-size: 5rem; background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.3)); }
        .p-skill-chip { border-radius: 20px; background: rgba(255,255,255,${isDark ? '0.05' : '0.6'}); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); padding: 1rem 2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .p-skill-chip:hover { transform: translateY(-5px); border-color: var(--accent); box-shadow: 0 0 20px rgba(34,211,238,0.4); }
        .p-project-card { border-radius: 30px; background: rgba(255,255,255,${isDark ? '0.03' : '0.8'}); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); }
        .p-project-card:hover { transform: scale(1.02); border-color: var(--accent); }
        .p-timeline-item { position: relative; padding-left: 2rem; border-left: 2px solid var(--border); }
        .p-timeline-item::before { content: ''; position: absolute; left: -7px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px var(--accent); }
      `;
    }

    // Default Minimal
    return baseStyles + `
      .p-hero h1 { font-size: clamp(3rem, 8vw, 5rem); }
      .highlight { background: var(--gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .p-skill-chip { padding: 0.8rem 1.8rem; border: 1px solid var(--border); border-radius: 12px; }
      .p-skill-chip:hover { border-color: var(--accent); transform: translateY(-3px); }
      .p-timeline-item { display: grid; grid-template-columns: 200px 1fr; gap: 2rem; margin-bottom: 3rem; }
      .p-timeline-date { font-weight: 700; color: var(--accent); }
      .p-project-card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
      .p-project-card:hover { transform: translateY(-10px); border-color: var(--accent); }
      .p-project-image { height: 200px; background: var(--border); display: flex; align-items: center; justify-content: center; }
      .p-tag { font-size: 0.75rem; background: rgba(59, 130, 246, 0.1); color: var(--accent); padding: 0.2rem 0.6rem; border-radius: 4px; margin-right: 0.4rem; }
    `;
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Outfit:wght@700;900&family=Lora:wght@400;600&display=swap" rel="stylesheet">
  <style>${getThemeStyles()}</style>
</head>
<body>
  <nav style="position: fixed; top: 0; width: 100%; height: 80px; display: flex; align-items: center; background: rgba(var(--bg), 0.8); backdrop-filter: blur(10px); z-index: 100; border-bottom: 1px solid var(--border);">
    <div class="p-container" style="display: flex; justify-content: space-between; width: 100%;">
      <div style="font-weight: 900; font-size: 1.5rem; color: var(--accent);">${(name || 'P').split(' ')[0]}</div>
    </div>
  </nav>

  <div class="p-hero reveal">
    <div class="p-container">
      <h1>I'm <span class="highlight">${name || 'Chandan Varshney'}</span></h1>
      <div style="max-width: 700px; font-size: 1.1rem; margin-top: 1rem;">
        ${formatBio(bio)}
      </div>
    </div>
  </div>

  <section id="skills" class="reveal">
    <div class="p-container">
      <h2 class="section-title">Expertise</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 1rem;">${skillsHTML || '<p>Adding skills...</p>'}</div>
    </div>
  </section>

  <section id="experience" class="reveal">
    <div class="p-container">
      <h2 class="section-title">Experience</h2>
      <div style="display: flex; flex-direction: column; gap: 3rem;">${experienceHTML || '<p>Adding history...</p>'}</div>
    </div>
  </section>

  <section id="projects" class="reveal">
    <div class="p-container">
      <h2 class="section-title">Projects</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">${projectsHTML || '<p>Coming soon...</p>'}</div>
    </div>
  </section>

  <section id="education" class="reveal">
    <div class="p-container">
      <h2 class="section-title">Education</h2>
      <div style="display: flex; flex-direction: column; gap: 2rem;">${educationHTML || '<p>Academic journey...</p>'}</div>
    </div>
  </section>

  <footer style="padding: 4rem 0; text-align: center; color: var(--text-muted);">
    <p>&copy; ${new Date().getFullYear()} ${name || 'Portfolio'}.</p>
  </footer>

  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('reveal');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('section, .p-hero').forEach(s => observer.observe(s));
  </script>
</body>
</html>
  `;
};
