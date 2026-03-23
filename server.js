const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend (Fase 2)
app.use(express.static(path.join(__dirname, 'public')));

// Almacenamiento en memoria
let comments = [
    {
        id: 1,
        username: "Raul",
        message: "Hola mundo!",
        date: "2026-03-17T10:00:00.000Z"
    }
];
let nextId = 2; // autoincrement

// GET - Obtener comentarios
// Ordenados del más reciente al más antiguo
app.get('/comments', (req, res) => {
    const sortedComments = [...comments].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(sortedComments);
});

// POST - Crear comentario
app.post('/comments', (req, res) => {
    const { username, message, date } = req.body;

    // Validación solicitada
    if (!username || username.trim() === '') {
        return res.status(400).json({ error: "El nombre de usuario no puede estar vacío" });
    }
    if (!message || message.trim().length < 5) {
        return res.status(400).json({ error: "El mensaje debe tener al menos 5 caracteres" });
    }

    const newComment = {
        id: nextId++,
        username: username.trim(),
        message: message.trim(),
        // Usar la fecha recibida del frontend o la actual como respaldo
        date: date || new Date().toISOString()
    };

    comments.push(newComment);
    res.status(201).json(newComment);
});

// DELETE - Eliminar comentario
app.delete('/comments/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const initialLength = comments.length;

    comments = comments.filter(c => c.id !== id);

    if (comments.length === initialLength) {
        return res.status(404).json({ error: "Comentario no encontrado" });
    }

    res.json({ message: "Comentario eliminado correctamente" });
});

// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de la Web API corriendo en http://localhost:${PORT}`);
});
