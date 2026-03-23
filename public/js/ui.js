import { formatTimeAgo } from './utils.js';

// ---- Elementos principales del DOM ----
const commentsList = document.getElementById('comments-list');
const commentsCount = document.getElementById('comments-count');

// ---- Utilidades Visuales del Formulario ----
const formError = document.getElementById('form-error');
const formErrorText = document.getElementById('form-error-text');
const submitBtn = document.getElementById('submit-btn');
const submitBtnText = document.getElementById('submit-btn-text');
const submitBtnSpinner = document.getElementById('submit-btn-spinner');

// Mostrar/Ocultar Banner de Error
export function showFormError(message) {
    if (message) {
        formErrorText.textContent = message;
        formError.classList.remove('hidden');
    } else {
        formError.classList.add('hidden');
    }
}

// Bloquear botón y mostrar spinner
export function setButtonLoading(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtnText.textContent = 'Publicando...';
        submitBtnSpinner.classList.remove('hidden');
    } else {
        submitBtn.disabled = false;
        submitBtnText.textContent = 'Publicar Comentario';
        submitBtnSpinner.classList.add('hidden');
    }
}

// ---- Renderizado de la Lista ----

// Dibujar estrellas doradas
function renderStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += `<span class="text-sb-gold">★</span>`; // Estrella llena
        } else {
            starsHTML += `<span class="text-slate-200">★</span>`; // Estrella vacía
        }
    }
    return starsHTML;
}

// Generador de String HTML para una Card
function createCommentCardHTML(comment) {
    const timeAgo = formatTimeAgo(comment.date);

    return `
    <!-- ID asignado y clase de animación de entrada -->
    <article id="comment-${comment.id}" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md ring-1 ring-slate-900/5 comment-card-enter relative group">
        
        <!-- Botón de Eliminar (Icono de Papelera oculto por defecto, visible con hover en PC) -->
        <button data-id="${comment.id}" class="delete-btn absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 bg-white p-1 rounded-md" aria-label="Eliminar reseña">
            <svg class="h-5 w-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>

        <div class="flex items-start justify-between mb-2 pr-8">
            <div>
                <h3 class="font-extrabold text-sb-dark text-base capitalize">${comment.username}</h3>
                <div class="flex items-center gap-2 mt-1">
                    <span class="text-[11px] font-bold text-sb-dark bg-sb-gold/20 px-2.5 py-0.5 rounded-full ring-1 ring-sb-gold/50">
                        ☕ ${comment.cafeName}
                    </span>
                    <span class="text-xs text-slate-400 font-medium">${timeAgo}</span>
                </div>
            </div>
        </div>

        <div class="mb-3 text-sm tracking-widest drop-shadow-sm">
            ${renderStars(comment.rating)}
        </div>

        <p class="text-slate-600 leading-relaxed text-sm sm:text-base">
            ${comment.message}
        </p>

    </article>
    `;
}

// Redibujar TODA la lista de comentarios
export function renderComments(comments) {
    commentsCount.textContent = comments.length;

    if (comments.length === 0) {
        commentsList.innerHTML = `
            <div id="empty-state" class="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed">
                <svg class="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p class="text-sm font-bold text-slate-500">Aún no hay reseñas. ¡Sé el primero!</p>
            </div>
        `;
        return;
    }

    const htmlCards = comments.map(c => createCommentCardHTML(c)).join('');
    commentsList.innerHTML = htmlCards;
}

// ---- Modificadores puntuales del DOM ----

// Inyectar un nuevo comentario al incio de la lista sin recargar todo
export function prependNewComment(comment) {
    // Si estaba mostrando el estado "vacío", limpiar primero
    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
        commentsList.innerHTML = '';
    }

    // Convertir el string HTML en un elemento Real para insertarlo
    commentsList.insertAdjacentHTML('afterbegin', createCommentCardHTML(comment));

    // Sumar 1 al contador
    const currentCount = parseInt(commentsCount.textContent, 10);
    commentsCount.textContent = currentCount + 1;
}

// Destruir una Card de la UI suavemente
export function removeCommentCard(id) {
    const card = document.getElementById(`comment-${id}`);
    if (card) {
        // Disparar animación de salida via CSS
        card.classList.remove('comment-card-enter');
        card.classList.add('comment-card-exit');

        // Esperar 300ms (lo que dura la animación fadeOutZoom) para quitarla del HTML
        setTimeout(() => {
            card.remove();

            // Actualizar contador
            const currentCount = parseInt(commentsCount.textContent, 10);
            if (currentCount > 0) {
                commentsCount.textContent = currentCount - 1;
            }

            // Re-evaluar si la lista quedó vacía tras borrar esto
            if (commentsList.children.length === 0 || currentCount === 1) {
                renderComments([]); // Forzar a dibujar el SVG vacío
            }
        }, 300);
    }
}
