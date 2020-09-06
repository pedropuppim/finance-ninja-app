export const TOKEN_KEY = "@finance-ninja";

//export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;


export const isAuthenticated = () => {
  const ls = JSON.parse(localStorage.getItem(TOKEN_KEY));
  return ls?.token ? true : false;
}

export const isAuthenticatedAndAdmin = () => {
  const ls = JSON.parse(localStorage.getItem(TOKEN_KEY));
  return ls?.user?.admin ? true : false;
}

export const getToken = () => {
  const ls = JSON.parse(localStorage.getItem(TOKEN_KEY));
  return ls?.token;
}

export const getExpire = () => {
  const ls = JSON.parse(localStorage.getItem(TOKEN_KEY));
  return ls?.expire;
}

export const getUser = () => {
  const ls = JSON.parse(localStorage.getItem(TOKEN_KEY));
  return ls?.user
}

export const login = data => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.clear();
};