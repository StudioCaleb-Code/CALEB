const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();

// --- 1. MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. ARCHIVOS ESTÁTICOS ---
app.use(express.static(path.join(__dirname, 'src', 'assets')));

// --- 3. CONEXIÓN MYSQL (POOL) ---
const db = mysql.createPool({
    host: process.env.MYSQLHOST || 'mysql.railway.internal',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'TogaSJjEcQCZiLosMDSrJeEbqzRXzgKu',
    database: process.env.MYSQLDATABASE || 'railway',
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('✅ MySQL conectado con pool');

// --- 4. RUTAS HTML (SPA ENTRY) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'dashboard', 'admin.html'));
});

app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'dashboard', 'form.html'));
});

// --- 5. JSON PURO (TU MENÚ /json) ---
app.get('/json', (req, res) => {
    const query = 'SELECT * FROM videojuegos ORDER BY id DESC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error JSON:', err);
            return res.status(500).json({ error: 'Error al obtener datos' });
        }

        res.json(results);
    });
});

// --- 6. API CRUD ---

// 🔹 LISTAR
app.get('/api/videojuegos', (req, res) => {
    const query = 'SELECT * FROM videojuegos ORDER BY id DESC';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener datos' });
        }
        res.json(results);
    });
});

// 🔹 CREAR
app.post('/api/videojuegos', (req, res) => {
    let { nombre, genero, anio } = req.body;

    if (!nombre || !genero || !anio) {
        return res.status(400).json({ error: 'Campos incompletos' });
    }

    anio = parseInt(anio);

    const query = 'INSERT INTO videojuegos (nombre, genero, anio) VALUES (?, ?, ?)';

    db.query(query, [nombre, genero, anio], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al insertar' });
        }

        res.status(201).json({
            mensaje: 'Juego creado',
            id: result.insertId
        });
    });
});

// 🔹 EDITAR
app.put('/api/videojuegos/:id', (req, res) => {
    const { id } = req.params;
    let { nombre, genero, anio } = req.body;

    if (!nombre || !genero || !anio) {
        return res.status(400).json({ error: 'Campos incompletos' });
    }

    anio = parseInt(anio);

    const query = `
        UPDATE videojuegos 
        SET nombre = ?, genero = ?, anio = ?
        WHERE id = ?
    `;

    db.query(query, [nombre, genero, anio, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Juego no encontrado' });
        }

        res.json({ mensaje: 'Actualizado correctamente' });
    });
});

// 🔹 ELIMINAR
app.delete('/api/videojuegos/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM videojuegos WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Juego no encontrado' });
        }

        res.json({ mensaje: 'Eliminado correctamente' });
    });
});

// --- 7. SERVIDOR ---
const PORT = process.env.PORT || 3306;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});