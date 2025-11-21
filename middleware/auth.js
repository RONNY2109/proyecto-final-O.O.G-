const jwt = require('jsonwebtoken');
const User = require('../models/user');

// error (401 Unauthorized) si no hay token
// error (403 Forbidden) si el token no es valido

const userExtractor = async (request, response, next) => {
    try {
        const token = request.cookies?.accessToken;
       
        
        if (!token) {
            return response.sendStatus(401);
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decoded.id);
        console.log( "user decodeado", user)
        request.user = user;
        
        
    } catch (error) {
        console.log(error)
        return response.sendStatus(403);
        
        
    }
    next();
};

module.exports = { userExtractor };