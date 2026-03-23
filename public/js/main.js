import { getComments, createComment, deleteComment } from './api.js';
import { validateCommentData } from './utils.js';
import {
    renderComments,
    showFormError,
    setButtonLoading,
    prependNewComment,
    removeCommentCard
} from './ui.js';

// DOM Elements
const commentForm = document.getElementById('comment-form');
const commentsList = document.getElementById('comments-list'); // Para event delegation

// 1. Inicialización: Cargar reseñas al abrir la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const comments = await getComments();
        renderComments(comments);
    } catch (error) {
        showFormError("No se pudo conectar con el servidor para cargar las reseñas.");
    }
});

// 2. Evento: Crear nueva reseña
commentForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitar recarga de página obligatoria

    // Extraer datos del formulario y mapearlos al JSON esperado
    const formData = new FormData(commentForm);
    const fecha = new Date().toISOString();

    const data = {
        username: formData.get('username'),
        cafeName: formData.get('cafeName'),
        rating: formData.get('rating'),
        message: formData.get('message'),
        date: fecha
    };

    // Validar localmente (Evitar peticiones de red inútiles)
    const validation = validateCommentData(data);
    if (!validation.isValid) {
        showFormError(validation.errorText);
        return;
    }

    // Datos limpios, preparar UI para el envío
    showFormError(null);
    setButtonLoading(true);

    try {
        // Promesa a /comments POST
        const newComment = await createComment(data);

        // Limpiar formulario y añadir la card arriba dinámicamente
        commentForm.reset();
        prependNewComment(newComment);

        // Hacer scroll suave hacia arriba para ver el nuevo comentario
        if (commentsList.scrollTop > 0) {
            commentsList.scrollTo({ top: 0, behavior: 'smooth' });
        }

    } catch (error) {
        showFormError(error.message);
    } finally {
        // Ocultar spinner
        setButtonLoading(false);
    }
});

// 3. Evento: Eliminar reseña
commentsList.addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (!deleteBtn) return;

    const commentId = deleteBtn.getAttribute('data-id');

    // Confirmación antes de eliminar
    if (!window.confirm(`¿Estás seguro de que quieres eliminar esta reseña para siempre?`)) {
        return;
    }

    // Feedback visual (desactivar botón en lo que responde el servidor)
    deleteBtn.disabled = true;
    deleteBtn.style.opacity = '0.5';

    try {
        // Promesa a /comments/:id DELETE
        await deleteComment(commentId);

        // Destruir la tarjeta del DOM con la animación CSS
        removeCommentCard(commentId);
    } catch (error) {
        alert("Ocurrió un error al intentar eliminar: " + error.message);
        deleteBtn.disabled = false;
        deleteBtn.style.opacity = '1';
    }
});
