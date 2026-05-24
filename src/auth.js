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

    // Check if we're updating an existing portfolio or adding a new one
    const pIdx = users[userIdx].portfolios.findIndex(p => p.id === portfolioData.id);
    if (pIdx !== -1) {
      users[userIdx].portfolios[pIdx] = { ...portfolioData, updatedAt: new Date().toISOString() };
    } else {
      users[userIdx].portfolios.push({ ...portfolioData, id: Date.now(), createdAt: new Date().toISOString() });
    }

    localStorage.setItem('portfolio-users', JSON.stringify(users));
  },

  getPortfolios: (username) => {
    const user = auth.getUsers().find(u => u.username === username);
    return user ? user.portfolios : [];
  }
};
