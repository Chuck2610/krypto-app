async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("https://dein-backend-url.onrender.com/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) {
    alert("Registrierung erfolgreich!");
    window.location.href = "login.html";
  } else {
    alert("Registrierung fehlgeschlagen!");
  }
}
