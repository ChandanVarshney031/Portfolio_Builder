export const parseResumeText = (text) => {
  const result = {
    skills: [],
    experience: [],
    education: [],
    name: '',
    bio: ''
  };

  if (!text) return result;

  // 1. Identify Section Positions
  const sections = [
    { key: 'skills', patterns: [/TECHNICAL SKILLS/i, /SKILLS/i, /TECHNOLOGIES/i, /EXPERTISE/i, /TOOLS/i, /STACK/i] },
    { key: 'experience', patterns: [/PROFESSIONAL EXPERIENCE/i, /EXPERIENCE/i, /EMPLOYMENT/i, /WORK HISTORY/i, /PROJECTS/i, /CAREER/i, /Work Experience/i] },
    { key: 'education', patterns: [/EDUCATION/i, /ACADEMIC/i, /UNIVERSITY/i, /COLLEGE/i, /DEGREE/i] },
    { key: 'bio', patterns: [/SUMMARY/i, /PROFILE/i, /ABOUT/i, /OBJECTIVE/i, /Personal Profile/i] }
  ];

  const foundSections = [];
  sections.forEach(sec => {
    sec.patterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        foundSections.push({ key: sec.key, pos: match.index, length: match[0].length });
      }
    });
  });

  foundSections.sort((a, b) => a.pos - b.pos);

  // 2. Extract Name
  let headerText = foundSections.length > 0 ? text.substring(0, foundSections[0].pos) : text;
  headerText = headerText.replace(/^[^a-zA-Z]+/, '');
  const headerParts = headerText.split(/\n|\r|\||\t/).map(p => p.trim()).filter(p => p.length > 1);
  
  if (headerParts.length > 0) {
    let nameLine = headerParts[0];
    const words = nameLine.split(/\s+/).filter(w => w.length > 1);
    if (words.length > 0) {
        let candidate = words[0] + (words[1] ? ' ' + words[1] : '');
        if (words[2] && words[2].length > 1 && /^[A-Z]/.test(words[2]) && words[2].length < 15) {
            candidate += ' ' + words[2];
        }
        nameLine = candidate;
    }
    if (!/education|skills|experience|projects|phone|gmail|email|http/i.test(nameLine)) {
      result.name = nameLine.substring(0, 35);
    }
  }

  // 3. Extract content for each found section
  for (let i = 0; i < foundSections.length; i++) {
    const start = foundSections[i].pos + foundSections[i].length;
    const end = foundSections[i + 1] ? foundSections[i + 1].pos : text.length;
    let sectionText = text.substring(start, end).trim();
    const sectionKey = foundSections[i].key;

    if (sectionKey === 'skills') {
      const items = sectionText.split(/[,|•\t·/()]|\n|\s{2,}/);
      items.forEach(item => {
        const s = item.trim();
        if (s && s.length > 1 && s.length < 30 && !/^\d+$/.test(s)) result.skills.push(s);
      });
    } else if (sectionKey === 'education') {
      // Split by common dividers like | or large gaps
      const parts = sectionText.split(/\||\n|\s{4,}/);
      parts.forEach(part => {
        const cleanPart = part.trim();
        if (cleanPart.length < 10) return;

        const yearMatch = cleanPart.match(/\b(20\d{2}|19\d{2})\b/);
        if (yearMatch) {
          const detailParts = cleanPart.split(/ — | - | – | , /i).map(d => d.trim()).filter(d => d.length > 1);
          result.education.push({
            school: detailParts[0] || 'Institution',
            degree: detailParts[1] || detailParts[2] || 'Degree/Qualification',
            year: yearMatch[0]
          });
        }
      });
    } else if (sectionKey === 'experience') {
      // Experience often has more complex lines
      const lines = sectionText.split(/\n|\s{4,}/);
      lines.forEach(line => {
        const yearMatch = line.match(/\b(20\d{2}|19\d{2})\b/);
        if (yearMatch) {
          const detailParts = line.split(/ at | — | - | – | , | @ /i).map(d => d.trim()).filter(d => d.length > 1);
          result.experience.push({
            role: detailParts[0] || 'Role',
            company: detailParts[1] || 'Company',
            duration: line.match(/\b(20\d{2}|19\d{2}).*?\b(20\d{2}|19\d{2}|Present|Current)\b/i)?.[0] || yearMatch[0],
            description: ''
          });
        }
      });
    } else if (sectionKey === 'bio') {
      if (!result.bio) result.bio = sectionText.substring(0, 500);
    }
  }

  // Final Cleanup
  result.skills = [...new Set(result.skills)].slice(0, 15);
  result.experience = result.experience.slice(0, 5);
  result.education = result.education.slice(0, 3);

  return result;
};
