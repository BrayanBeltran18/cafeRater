/**
 * Lógica pura separada del DOM. Validaciones y formateo de fechas.
 */

// Formateador de tiempo relativo
export function formatTimeAgo(isoDateString) {
    if (!isoDateString) return "Hace un momento";

    const date = new Date(isoDateString);
    const now = new Date();

    // Diferencia en segundos
    const diffInSeconds = Math.round((date - now) / 1000);

    // Configurar formateador relativo en español
    const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto', style: 'long' });

    // Unidades de tiempo
    const MINUTE = 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    const absDiff = Math.abs(diffInSeconds);

    if (absDiff < MINUTE) {
        return "Hace un momento";
    } else if (absDiff < HOUR) {
        return rtf.format(Math.round(diffInSeconds / MINUTE), 'minute');
    } else if (absDiff < DAY) {
        return rtf.format(Math.round(diffInSeconds / HOUR), 'hour');
    } else {
        return rtf.format(Math.round(diffInSeconds / DAY), 'day');
    }
}

// Validador de datos del formulario (Pure function)
export function validateCommentData(data) {
    const errors = [];

    if (!data.username || data.username.trim() === '') {
        errors.push("Tu nombre es obligatorio.");
    }

    if (!data.cafeName || data.cafeName.trim() === '') {
        errors.push("El nombre de la cafetería es obligatorio.");
    }

    if (!data.rating || isNaN(parseInt(data.rating, 10))) {
        errors.push("Debes asignar una calificación válida.");
    }

    if (!data.message || data.message.trim().length < 5) {
        errors.push("La reseña debe tener al menos 5 caracteres de longitud.");
    }

    return {
        isValid: errors.length === 0,
        errorText: errors.join(" ")
    };
}
