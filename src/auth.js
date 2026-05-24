export const auth = {
  getUsers: () => JSON.parse(localStorage.getItem('portfolio-users')) || [],
  
  signup: (username, password) => {
    const users = auth.getUsers();
    if (users.find(u => u.username === username)) {
      throw new Error('Username already exists');
    }
    const newUser = { username, password, portfolios: [] };
    users.push(newUser);
    localStorage.setItem('portfolio-users', JSON.stringify(users));
    return newUser;
  },

  login: (username, password) => {
    const users = auth.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    return user;
  },

  savePortfolio: (username, portfolioData) => {
    const users = auth.getUsers();
    const userIdx = users.findIndex(u => u.username === username);
    if (userIdx === -1) return;

    // Check if we're updating an existing portfolio by ID or by name (case-insensitive deduplication)
    let pIdx = users[userIdx].portfolios.findIndex(p => p.id === portfolioData.id);
    if (pIdx === -1 && portfolioData.name) {
      pIdx = users[userIdx].portfolios.findIndex(p => (p.name || '').trim().toLowerCase() === (portfolioData.name || '').trim().toLowerCase());
    }

    if (pIdx !== -1) {
      const original = users[userIdx].portfolios[pIdx];
      // Update in-place, preserving original ID and createdAt timestamp
      users[userIdx].portfolios[pIdx] = { 
        ...portfolioData, 
        id: original.id, 
        createdAt: original.createdAt || new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      };
      
      // Update active portfolioData ID so caller has the correct persistent ID
      portfolioData.id = original.id;
    } else {
      // Add as new portfolio
      users[userIdx].portfolios.push({ 
        ...portfolioData, 
        id: portfolioData.id || Date.now(), 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      });
    }

    localStorage.setItem('portfolio-users', JSON.stringify(users));
  },

  getPortfolios: (username) => {
    const users = auth.getUsers();
    const userIdx = users.findIndex(u => u.username === username);
    if (userIdx === -1) return [];
    
    let portfolios = users[userIdx].portfolios || [];
    
    // Deduplicate by name, keeping the most recently updated one
    const seenNames = new Map();
    const sorted = [...portfolios].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
    
    const deduplicated = [];
    sorted.forEach(p => {
      const nameKey = (p.name || 'Untitled Portfolio').trim().toLowerCase();
      if (!seenNames.has(nameKey)) {
        seenNames.set(nameKey, true);
        deduplicated.push(p);
      }
    });
    
    // Clean up duplicate records in localStorage
    if (deduplicated.length < portfolios.length) {
      users[userIdx].portfolios = deduplicated;
      localStorage.setItem('portfolio-users', JSON.stringify(users));
    }
    
    return deduplicated;
  }
};
