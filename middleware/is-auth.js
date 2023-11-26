const json_web_token = require('jsonwebtoken');

module.exports = ( req, res, next) => {

    const authHeader = req.get('Authorization');
    
    if(!authHeader) 
    {
        const error = new Error('Not Authenticated');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];

    let decodeToken;

    try{

        decodeToken = json_web_token.verify(token,"DawinderAditya");
    
    } catch (err) {

        err.statusCode = 500;
        throw err;
    }

    req.userId = decodeToken.userId;
    next();
}