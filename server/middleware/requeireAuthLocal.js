const jwt = require('jsonwebtoken');
const Local = require('../models/local')

async function requireAuthLocal(req, res, next){
    try {
        const token = req.cookies.Authorization;
        const decoded = jwt.verify(token, process.env.SECRET);

        if(Date.now() > decoded.exp) return res.sendStatus(401);
        const local = await Local.findById(decoded.sub);
        
        if(!local) return res.sendStatus(401);
        req.local = local;
        next();
    } catch (error) {
        return res.sendStatus(401)
    }
}

module.exports = requireAuthLocal;