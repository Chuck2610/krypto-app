// public/js/app.js

const BASE_URL = 'https://krypto-app-9h3q.onrender.com';

// Registrierung
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const password = e.target.password.value;

  try {
    const res = await fetch(`${BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    alert('Registrierung fehlgeschlagen: ' + err.message);
  }
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = e.target.username.value;
  const password = e.target.password.value;

  try {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Login erfolgreich!');
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Login fehlgeschlagen');
    }
  } catch (err) {
    alert('Fehler bei der Verbindung zum Server: ' + err.message);
  }
});
