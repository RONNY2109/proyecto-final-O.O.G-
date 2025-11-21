// /middleware/isAdmin.js

const isAdmin = (request, response, next) => {
    // 1. Verificar si el usuario fue adjuntado a la solicitud por un middleware anterior (ej. userExtractor).
    //    Si request.user no existe, significa que la autenticación (token) falló o no se ejecutó.
    if (!request.user) {
        // 401 Unauthorized: No está autenticado (o no se pudo verificar el token).
        return response.status(401).json({ 
            error: "Token no válido o no proporcionado." 
        });
    }

    // 2. Verificar el rol de administrador usando la propiedad booleana.
    //    Usamos request.user.isAdmin para la verificación condicional.
    if (request.user.isAdmin) { // Si isAdmin es true (es el valor por defecto que buscamos)
        next(); // Es administrador. Permite que la solicitud avance.
    } else {
        // 403 Forbidden: Está autenticado, pero NO tiene el permiso necesario.
        return response.status(403).json({
            error: "Acceso denegado. Se requieren permisos de administrador."
        });
    }
};

module.exports = { isAdmin };