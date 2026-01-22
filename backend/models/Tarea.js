const mongoose = require('mongoose');

// Definimos el esquema (el molde de los datos)
const tareaSchema = new mongoose.Schema({
    // 1. titulo: String, obligatorio
    titulo: {
        type: String,
        required: true, // Hace que este campo sea obligatorio
        trim: true      // (Opcional) Elimina espacios vacíos al principio y final
    },

    // 2. tecnologia: String (o Enum)
    tecnologia: {
        type: String,
        // El 'enum' obliga a que el valor sea UNO de esta lista. 
        enum: ['HTML', 'CSS', 'JavaScript', 'NodeJS', 'MongoDB', 'React']
    },

    // 3. estado: Boolean (o String 'pending'/'done')
    estado: {
        type: String,
        enum: ['pending', 'done'], // Solo permite estos dos valores
        default: 'pending'         // Si no pones nada, se guarda como 'pending' automáticamente
    },

    // 4. fecha: Date (default: now)
    fecha: {
        type: Date,
        default: Date.now // Guarda la fecha y hora exacta del momento en que se crea
    }
});

// Exportamos el modelo para poder usarlo en index.js
// 'Tarea' será el nombre de la colección en la base de datos (Mongoose lo guarda como 'tareas')
module.exports = mongoose.model('Tarea', tareaSchema);