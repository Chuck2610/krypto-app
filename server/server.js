// server/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
const port = 3000;
const usersFile = path.join(__dirname, 'users.json');
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Registrierung
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  let users = [];
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile));
  }
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Benutzer existiert bereits' });
  }
  users.push({ username, password });
  fs.writeFileSync(usersFile, JSON.stringify(users));
  res.json({ message: 'Registrierung erfolgreich' });
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile));
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ message: 'Login erfolgreich' });
  } else {
    res.status(401).json({ message: 'Falsche Anmeldedaten' });
  }
});

// Datei hochladen
app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'Datei hochgeladen', filename: req.file.filename });
});

app.listen(port, () => console.log(`Server läuft auf http://localhost:${port}`));
