export function getToken() {
  return localStorage.getItem('token') || null;
}

export function setToken(token) {
  localStorage.setItem('token', token);
}