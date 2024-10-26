const jwt = require('jsonwebtoken');
const Local = require('../models/local');

async function requireAuthLocal(req, res, next) {
    try {
        const token = req.cookies['Authorization-local'];
        if (!token) return res.sendStatus(401);

        const decoded = jwt.verify(token, process.env.SECRET);

        const local = await Local.findById(decoded.sub);
        if (!local) return res.sendStatus(401);

        req.local = local;
        next(); 
    } catch (error) {
        console.error("Erro de autenticação:", error); 
        return res.sendStatus(401); 
    }
}

module.exports = requireAuthLocal;
