const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const methodOverride = require('method-override'); // Agregado para manejar DELETE y PUT

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Usamos method-override para poder manejar el DELETE desde los formularios
app.use(methodOverride('_method'));

// Conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Machuelo449', // Reemplaza con tu contraseña
  database: 'Celis_BD',
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Rutas

// Ruta principal: muestra la lista de usuarios
app.get('/', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.render('index', { users: results, message: req.query.message || '' });
  });
});

// Ruta para mostrar el formulario de agregar un nuevo usuario
app.get('/add', (req, res) => {
  res.render('form', { user: null });
});

// Ruta para agregar un nuevo usuario
app.post('/add', (req, res) => {
  const { name, email, phone, address } = req.body;
  const query = 'INSERT INTO users (name, email, phone, address) VALUES (?, ?, ?, ?)';
  db.query(query, [name, email, phone, address], err => {
    if (err) throw err;
    res.redirect('/?message=Usuario agregado correctamente');
  });
});

// Ruta para mostrar el formulario de editar un usuario
app.get('/edit/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) throw err;
    res.render('form', { user: results[0] });
  });
});

// Ruta para actualizar un usuario
app.post('/edit/:id', (req, res) => {
  const { name, email, phone, address } = req.body;
  const query = 'UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?';
  db.query(query, [name, email, phone, address, req.params.id], err => {
    if (err) throw err;
    res.redirect('/?message=Usuario actualizado correctamente');
  });
});

// Ruta para eliminar un usuario
app.delete('/delete/:id', (req, res) => {
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [req.params.id], err => {
    if (err) throw err;
    res.redirect('/?message=Usuario eliminado correctamente');
  });
});

// Servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
