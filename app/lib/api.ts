// app/lib/api.ts

const API_URL = 'http://localhost:8080/api';

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return await res.json();
}

export async function signup(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return await res.json();
}

export function saveToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', token);
  }
}

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt');
  }
  return null;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt');
  }
}

export async function getProfile() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_URL}/user/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return await res.json();
}
