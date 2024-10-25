const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const Local = require ("../models/local")

const createLocal = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const existingUser = await Local.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Este e-mail já está em uso.' });
        }
        const hashedPassword = bcrypt.hashSync(senha, 8);
        const user = await Local.create({ nome, email, senha: hashedPassword });
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar o usuário: " + error.message });
    }
}

const loginLocal = async (req, res) => {
    try {
        const { email, senha } = req.body

        const local = await Local.findOne({ email });
        if(!local) return res.status(404).json({ message: 'Este e-mail não existe.' });

        const passwordMatch = bcrypt.compareSync(senha, local.senha);
        if(!passwordMatch) return res.status(401).json({ message: 'Email ou senha incorretos.' });

        const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
        const token = jwt.sign({ sub: local._id, exp }, process.env.SECRET)

        res.cookie("Authorization-local", token, {
            expires: new Date(exp),
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

const checkAuthLocal = (req, res) => {
    try {
        const token = req.cookies['Authorization-local'];
        if (!token) {
            return res.sendStatus(401); 
        }
        const decoded = jwt.verify(token, process.env.SECRET);
        if (Date.now() > decoded.exp) {
            return res.sendStatus(401); 
        }
        res.sendStatus(200); 
    } catch (error) {
        return res.sendStatus(401);
    }
}

const logoutLocal = (req, res) => {
    try {
      res.clearCookie("Authorization-local", {
        httpOnly: true,
        sameSite: 'none', 
        secure: true, 
        path: '/',
      });
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
};

const getLoggedUserLocal = (req, res) => {
    res.json({ local: req.local });
};

module.exports = {
    createLocal,
    loginLocal,
    checkAuthLocal,
    logoutLocal,
    getLoggedUserLocal
}