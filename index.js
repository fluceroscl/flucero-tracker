const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Almacén de usuarios y ejercicios
const users = [];
const exercises = [];

// Carga Formulario
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Ruta para obtener todos los usuarios
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Ruta para obtener el log de ejercicios de un usuario
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  
  let userExercises = exercises.filter(e => e._id === _id);

  if (from) {
    const fromDate = new Date(from);
    userExercises = userExercises.filter(e => new Date(e.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    userExercises = userExercises.filter(e => new Date(e.date) <= toDate);
  }

  if (limit) {
    userExercises = userExercises.slice(0, parseInt(limit));
  }

  const user = users.find(u => u._id === _id);

  res.json({
    _id,
    username: user ? user.username : '',
    count: userExercises.length,
    log: userExercises
  });
});

// Ruta para crear un nuevo usuario
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const newUser = { username, _id: Date.now().toString() };
  users.push(newUser);
  res.json(newUser);
});

// Ruta para agregar un ejercicio a un usuario
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const user = users.find(u => u._id === _id);
  
  if (!user) {
    return res.status(404).send('Usuario no encontrado');
  }

  const exerciseDate = date ? new Date(date) : new Date();
  const durationInt = parseInt(duration);
  const exercise = {
    _id,
    description,
    duration: durationInt,
    date: exerciseDate.toDateString()
  };
  
  exercises.push(exercise);
  
  res.json({
    _id: user._id,
    username: user.username,
    ...exercise
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`La aplicación está escuchando en el puerto ${PORT}`);
});
