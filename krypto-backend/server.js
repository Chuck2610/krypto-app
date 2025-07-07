const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Dummy-Datenbank (nur zur Demonstration)
const users = [];

// Registrierungsroute
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Alle Felder müssen ausgefüllt werden.' });
  }

  // Nutzer existiert bereits?
  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(409).json({ message: 'Benutzername existiert bereits.' });
  }

  users.push({ username, password }); // KEINE sichere Speicherung!
  return res.status(201).json({ message: 'Registrierung erfolgreich!' });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
