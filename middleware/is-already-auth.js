const json_web_token = require('jsonwebtoken');

module.exports = ( req, res, next) => {

    const authHeader = req.get('Authorization');
    
    if(!authHeader) 
    {
       return res.status(200).json({

            authenticated : false ,
            reason : 'token not set',
            statusCode :401
        })
    }

    const token = authHeader.split(' ')[1];

    let decodeToken;

    try{

        decodeToken = json_web_token.verify(token,"DawinderAditya");
        
    } catch (err) {

       return res.status(200).json({
             
            authenticated : false,
            reason : 'token validation failed',
            statusCode : 401
        })
    }

    req.userId = decodeToken.userId;
    next();

}