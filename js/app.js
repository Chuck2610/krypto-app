const API_URL = "https://krypto-app-9h3q.onrender.com/api";

// Registrierung
async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      throw new Error("Registrierung fehlgeschlagen");
    }

    alert("Registrierung erfolgreich!");
    window.location.href = "login.html";

  } catch (err) {
    console.error("Fehler bei Registrierung:", err);
    alert("Fehler bei der Registrierung");
  }
}

// Login
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      throw new Error("Login fehlgeschlagen");
    }

    const data = await res.json();
    localStorage.setItem("token", data.token);
    alert("Login erfolgreich!");
    window.location.href = "dashboard.html";

  } catch (err) {
    console.error("Fehler beim Login:", err);
    alert("Login fehlgeschlagen");
  }
}

// Dashboard Auth-Prüfung (optional)
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Nicht eingeloggt!");
    window.location.href = "login.html";
  }
}
