const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const User = require ("../models/user")
const Gift = require ("../models/gift");
const Local = require("../models/local");

const fetchUsers = async (req, res) => {
    const user = await User.find();
    res.json({ user });
};

const fetchUser = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    res.json({ user })
}

const createUser = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Este e-mail já está em uso.' });
        }
        const hashedPassword = bcrypt.hashSync(senha, 8);
        const user = await User.create({ nome, email, senha: hashedPassword });
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar o usuário: " + error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { nome, email } = req.body;
        await User.findByIdAndUpdate(userId, { nome, email})
        const user = await User.findById(userId)
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Erro ao editar o usuário: " + error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Verifica se o ID do usuário logado corresponde ao ID da URL
        if (req.user._id.toString() !== userId) {
            console.log("Erro: Você não tem permissão para excluir este usuário.");
            return res.status(403).json({ error: "Você não tem permissão para excluir este usuário." });
        }

        // Deleta o usuário
        const deleteResult = await User.deleteOne({ _id: userId });

        if (deleteResult.deletedCount === 0) {
            console.log("Erro: Usuário não encontrado para exclusão.");
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        // Remove o cookie de autorização
        res.clearCookie("Authorization", {
            httpOnly: true,
            sameSite: 'none', 
            secure: true, 
            path: '/',
        });

        // Retorna sucesso
        res.json({ success: "Usuário deletado e logout realizado com sucesso." });
    } catch (error) {
        console.error("Erro ao deletar usuário:", error);  // Log de erro
        res.status(500).json({ error: "Erro ao deletar o usuário: " + error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, senha } = req.body

        const user = await User.findOne({ email });
        if(!user) return res.status(404).json({ message: 'Este e-mail não existe.' });

        const passwordMatch = bcrypt.compareSync(senha, user.senha);
        if(!passwordMatch) return res.status(401).json({ message: 'Email ou senha incorretos.' });

        const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
        const token = jwt.sign({ sub: user._id, exp }, process.env.SECRET)

        res.cookie("Authorization", token, {
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

const checkAuth = (req, res) => {
    try {
      res.sendStatus(200);   
    } catch (error) {
      return res.sendStatus(400);
    }
}

const logout = (req, res) => {
    try {
      res.clearCookie("Authorization", {
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
  
const getLoggedUser = (req, res) => {
    res.json({ user: req.user });
};

const getGift = async (req, res) => {
    try {
        const gifts = await Gift.find();
        res.json(gifts);
      } catch (err) {
        res.status(500).json({ error: 'Erro ao listar prêmios.' });
    }
};

const createGift = async (req, res) => {
    const { nome, descricao, custo, imagemUrl } = req.body;
    try {
      const newGift = new Gift({
        nome,
        descricao,
        custo,
        imagemUrl
      });
      await newGift.save();
      res.status(201).json(newGift); 
    } catch (err) {
      res.status(400).json({ error: 'Erro ao criar prêmio.', details: err.message });
    }
}

const claimGift = async (req, res) => {
    const { userId, giftId } = req.body;

    try {
        const user = await User.findById(userId);
        const gift = await Gift.findById(giftId);

        // Verifica se o usuário e o prêmio existem
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        if (!gift) {
            return res.status(404).json({ error: 'Prêmio não encontrado.' });
        }

        // Verifica se o prêmio já foi resgatado
        const redeemedPrize = user.prizes.find(prize => prize.prizeId.equals(giftId));
        if (redeemedPrize) {
            // Retorna o código se o prêmio já foi resgatado
            return res.json({ codigo: redeemedPrize.codigo });
        }

        // Verifica se o usuário tem pontos suficientes
        if (user.pontos < gift.custo) {
            return res.status(400).json({ error: 'Pontos insuficientes.' });
        }

        // Gera um código único para o prêmio
        const uniqueCode = `PR-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;

        // Atualiza os pontos do usuário e registra o prêmio resgatado
        user.pontos -= gift.custo;
        user.prizes.push({
            prizeId: giftId,
            codigo: uniqueCode,
        });

        await user.save();
        res.json({ codigo: uniqueCode });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao resgatar prêmio.' });
    }
};

const checkGift = async (req, res) => {
    const { userId, giftId } = req.params;
    try {
      const user = await User.findById(userId);
      const redemption = user.prizes.find(prize => prize.prizeId.equals(giftId));
      if (redemption) {
        return res.json({ resgatado: true, codigo: redemption.codigo });
      } else {
        return res.json({ resgatado: false });
      }
    } catch (err) {
      res.status(500).json({ error: 'Erro ao verificar status do prêmio.' });
    }
};

const deleteVisit = async (req, res) => {
    try {
        const { visitaId } = req.params;
        const { userId, localId } = req.body;

        // Encontrar e remover a visita específica
        const local = await Local.findOneAndUpdate(
            { 
                _id: localId, 
                'visitas._id': visitaId,
                'visitas.visitante': userId 
            },
            { 
                $pull: { 
                    visitas: { 
                        _id: visitaId, 
                        visitante: userId 
                    } 
                } 
            },
            { new: true }
        );

        if (!local) {
            return res.status(404).json({ 
                message: 'Visita não encontrada ou você não tem permissão para excluí-la' 
            });
        }

        res.status(200).json({ 
            message: 'Visita excluída com sucesso',
            local 
        });

    } catch (error) {
        console.error('Erro ao excluir visita:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor', 
            details: error.message 
        });
    }
};



module.exports = {
    fetchUser,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    login,
    checkAuth,
    logout,
    getLoggedUser,
    getGift,
    claimGift,
    checkGift,
    createGift,
    deleteVisit
}

