export const accounts = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    status: "admin"
  },
  {
    id: 2,
    username: "user1",
    password: "user123",
    status: "user"
  },
  {
    id: 3,
    username: "gamer",
    password: "game123",
    status: "user"
  }
];


export function addAccount(username, password) {
  const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
  const newAccount = {
    id: newId,
    username: username,
    password: password,
    status: "user"
  };
  accounts.push(newAccount);
  return newAccount;
}


export function findAccountByUsername(username) {
  return accounts.find(acc => acc.username === username);
}


export function validateLogin(username, password) {
  const account = findAccountByUsername(username);
  if (account && account.password === password) {
    return account;
  }
  return null;
}