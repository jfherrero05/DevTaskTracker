// ==========================================
// CONFIGURACIÓN
// ==========================================
const API_URL = 'http://localhost:3000/api/tasks';

// ==========================================
// 1. FUNCIÓN PARA OBTENER Y PINTAR TAREAS (READ)
// ==========================================
async function cargarTareas() {
    try {
        const respuesta = await fetch(API_URL);
        
        // Si la respuesta no es correcta, lanzamos error
        if (!respuesta.ok) {
            throw new Error('Error al conectar con el servidor');
        }

        const tareas = await respuesta.json();
        const lista = document.getElementById('tasks-list');
        
        // Limpiamos la lista para evitar duplicados
        lista.innerHTML = '';

        // Si no hay tareas, mostramos un mensaje
        if (tareas.length === 0) {
            lista.innerHTML = '<p class="loading">No hay tareas pendientes. ¡Buen trabajo!</p>';
            return;
        }

        // Recorremos cada tarea y creamos su tarjeta HTML
        tareas.forEach(tarea => {
            const div = document.createElement('div');
            div.className = 'task-card'; // Clase para el CSS
            
            // Inyectamos el HTML de la tarjeta
            div.innerHTML = `
                <h3>${tarea.titulo}</h3>
                <p>Tecnología: <strong>${tarea.tecnologia}</strong></p>
                <p>Estado: ${tarea.estado}</p>
                <button onclick="eliminarTarea('${tarea._id}')">🗑️ Borrar</button>
            `;
            lista.appendChild(div);
        });

    } catch (error) {
        console.error('Error cargando tareas:', error);
        alert('Error al cargar las tareas. Mira la consola para más detalles.');
    }
}

// ==========================================
// 2. FUNCIÓN PARA CREAR NUEVA TAREA (CREATE)
// ==========================================
document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue sola

    // Cogemos los datos del formulario HTML
    const tituloInput = document.getElementById('titulo');
    const tecnologiaInput = document.getElementById('tecnologia');

    const nuevaTarea = {
        titulo: tituloInput.value,
        tecnologia: tecnologiaInput.value,
        estado: 'pending' // Valor por defecto
    };

    try {
        // Enviamos los datos al Backend
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaTarea)
        });

        // Verificamos si se guardó bien
        if (respuesta.ok) {
            // Limpiamos el formulario
            tituloInput.value = ''; 
            // Recargamos la lista para ver la nueva tarea
            cargarTareas();
        } else {
            const errorData = await respuesta.json();
            alert('❌ Error al guardar: ' + JSON.stringify(errorData));
        }

    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de conexión con el servidor.');
    }
});

// ==========================================
// 3. FUNCIÓN PARA ELIMINAR TAREA (DELETE)
// ==========================================
async function eliminarTarea(id) {
    if (confirm('¿Estás seguro de que quieres borrar esta tarea?')) {
        try {
            const respuesta = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (respuesta.ok) {
                cargarTareas(); // Recargamos la lista
            } else {
                alert('Error al intentar borrar la tarea');
            }

        } catch (error) {
            console.error('Error eliminando:', error);
        }
    }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
// Cargamos las tareas nada más abrir la web
cargarTareas();