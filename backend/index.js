const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });// Cargar variables de entorno (seguridad)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Tarea = require('./models/Tarea'); // Tu modelo


// Configuración del servidor
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (Para que el servidor entienda JSON y permita conexiones externas)
app.use(cors());
app.use(express.static('frontend'));
app.use(express.json());

// 1. CONEXIÓN A BASE DE DATOS (RA3)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Base de datos conectada (Atlas)'))
    .catch((err) => console.error('❌ Error de conexión:', err));

// --- RUTAS DE LA API (RA2) ---

// RA2.b: GET /api/tasks - Devuelve todas las tareas
app.get('/api/tasks', async (req, res) => {
    try {
        const tareas = await Tarea.find(); // Busca todo en Atlas
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
});

// RA2.b: POST /api/tasks - Crea una nueva tarea
app.post('/api/tasks', async (req, res) => {
    try {
        // Recibimos los datos del frontend (req.body)
        const nuevaTarea = new Tarea({
            titulo: req.body.titulo,
            tecnologia: req.body.tecnologia,
            estado: req.body.estado // Opcional, tiene default
        });
        
        const tareaGuardada = await nuevaTarea.save();
        res.status(201).json(tareaGuardada); // 201 = Creado con éxito
    } catch (error) {
        res.status(400).json({ error: 'Error al guardar la tarea' });
    }
});

// RA2.d: DELETE /api/tasks/:id - Elimina una tarea
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await Tarea.findByIdAndDelete(id);
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

// Arrancar el servidor (RA2.a)
app.listen(PORT, () => {
    console.log(`🚀 Servidor arrancado en http://localhost:${PORT}`);
});