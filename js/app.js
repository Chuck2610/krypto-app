function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Bitte Benutzername und Passwort eingeben!");
    return;
  }

  alert("Registrierung erfolgreich für: " + username);
}
