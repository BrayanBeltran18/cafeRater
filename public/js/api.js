// Ruta relativa
const API_URL = '/comments';

// GET - Obtener la lista de reseñas
export async function getComments() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('No se pudo conectar al servidor.');

        return await response.json();
    } catch (error) {
        console.error('Error GET comments:', error);
        throw error;
    }
}

// POST - Enviar una nueva reseña
export async function createComment(commentData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });

        // Manejar errores retornados por el backend
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error publicando la reseña.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error POST comment:', error);
        throw error;
    }
}

// DELETE - Borrar una reseña usando su ID
export async function deleteComment(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('No se pudo eliminar el comentario.');

        return await response.json();
    } catch (error) {
        console.error('Error DELETE comment:', error);
        throw error;
    }
}
