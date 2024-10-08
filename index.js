const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');

app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false })); // Para manejar datos de formulario

// Almacén de usuarios y ejercicios
let users = [];
let exercises = [];

// Carga Formulario
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Ruta para crear un nuevo usuario
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const newUser = { username, _id: new Date().getTime().toString() }; // Generar un ID único
  users.push(newUser);
  res.json(newUser);
});

// Ruta para obtener todos los usuarios
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Ruta para agregar un ejercicio a un usuario
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const user = users.find(u => u._id === _id);
  
  if (user) {
    const exerciseDate = date ? new Date(date).toDateString() : new Date().toDateString();
    const exercise = { description, duration, date: exerciseDate };
    exercises.push({ _id, ...exercise });
    res.json({ ...user, log: exercises.filter(e => e._id === _id) });
  } else {
    res.status(404).send('Usuario no encontrado');
  }
});

// Ruta para obtener el log de ejercicios de un usuario
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const userExercises = exercises.filter(e => e._id === _id);
  const count = userExercises.length;
  res.json({ _id, count, log: userExercises });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
