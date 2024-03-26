// blacklisted token list
// for better optimization redis should be used!
const blacklist = [];

module.exports = {
  getBlacklist: () => blacklist,
  addToBlacklist: (token) => blacklist.push(token),
  removeFromBlacklist: (token) => {
    const index = blacklist.indexOf(token);
    if (index !== -1) {
      blacklist.splice(index, 1);
    }
  },
};
