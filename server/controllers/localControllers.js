const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const Local = require ("../models/local");
const User = require("../models/user");

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

const addColeta = async (req, res) => {
    try {
        const token = req.cookies['Authorization-local'];
        if (!token) {
            return res.sendStatus(401);
        }
        const decoded = jwt.verify(token, process.env.SECRET);
        
        const userId = decoded.sub;
        const { city, location, residuos, uf } = req.body;

        const local = await Local.findById(userId);
        if (!local) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const novoLocal = {
            city,
            location,
            residuos,
            uf
        };
        
        local.local.push(novoLocal);
        await local.save();

        res.status(201).json({ message: 'Ponto de coleta cadastrado com sucesso.', local });
    } catch (error) {
        res.status(500).json({ error: "Erro ao cadastrar o ponto de coleta: " + error.message });
    }
};

const getLocais = async (req, res) => {
    try {
        console.log('Iniciando busca de locais');
        const locais = await Local.find();
        console.log('Locais encontrados:', locais);
        if (!locais) {
            return res.status(404).json({ message: "Nenhum local encontrado" });
        }
        const formattedLocais = locais.map(doc => {
            console.log('Processando documento:', doc);
            return {
                _id: doc._id,
                nome: doc.nome,
                local: Array.isArray(doc.local) ? doc.local : []
            };
        });
        console.log('Resposta formatada:', formattedLocais);
        res.status(200).json(formattedLocais);
    } catch (error) {
        console.error('Erro detalhado:', error);
        res.status(500).json({ 
            error: "Erro ao listar os locais", 
            details: error.message,
            stack: error.stack 
        });
    }
};

const registerVisit = async (req, res) => {
        try {
            const { localId, itens } = req.body;
            const visitanteId = req.user._id;

            const local = await Local.findById(localId);
            if (!local) {
                return res.status(404).json({ error: 'Local não encontrado' });
            }

            const novaVisita = {
                visitante: visitanteId,
                itens: itens.map(item => ({
                    descricao: item.descricao,
                    pontos: item.pontos || 0
                }))
            };

            local.visitas.push(novaVisita);
            await local.save();

            return res.status(201).json({
                message: 'Visita registrada com sucesso',
                visita: novaVisita
            });

        } catch (error) {
            console.error('Erro ao registrar visita:', error);
            return res.status(500).json({ 
                error: 'Erro interno do servidor'
            });
        }
}

const listVisits = async (req, res) => {
    try {
        const visitanteId = req.user._id;
        const locaisComVisitas = await Local.find({ 'visitas.visitante': visitanteId })
            .select('_id nome visitas local');

        if (!locaisComVisitas || locaisComVisitas.length === 0) {
            return res.status(404).json({ error: 'Nenhuma visita registrada para este usuário.' });
        }

        const visitasDoVisitante = locaisComVisitas.map(local => ({
            localId: local._id,  // Include the local's ID
            local: local.nome, 
            cidade: local.local[0]?.city, 
            location: local.local[0]?.location, 
            visitas: local.visitas.filter(visita => visita.visitante.toString() === visitanteId.toString())
        }));

        return res.status(200).json({ visitas: visitasDoVisitante });
    } catch (error) {
        console.error('Erro ao listar visitas:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};     

const editUserLocal = async (req, res) => {
    try {
        const { id } = req.params;  
        const { local } = req.body; 

        const user = await Local.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        user.local = local;
        await user.save();
        res.status(200).json({ message: 'Dados atualizados com sucesso!', local: user.local });
    } catch (error) {
        console.error('Erro ao atualizar dados do local:', error);
        res.status(500).json({ error: 'Erro ao atualizar dados.' });
    }
};

const listVisitsInLocal = async (req, res) => {
    try {
        const local = req.local; 
        const localId = req.params.id;

        if (local._id.toString() !== localId) {
            return res.status(403).json({ message: 'Você não tem permissão para acessar as visitas deste local.' });
        }
        const visitas = local.visitas;

        if (!visitas || visitas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma visita encontrada para este local.' });
        }
        const visitasComItens = visitas.map(visita => {
            return {
                _id: visita._id, 
                visitante: visita.visitante,
                dataVisita: visita.dataVisita, 
                status: visita.status, 
                itens: visita.itens.map(item => ({
                    descricao: item.descricao,  
                    pontos: item.pontos  
                }))
            };
        });
        return res.status(200).json({
            visitas: visitasComItens
        });
    } catch (error) {
        console.error('Erro ao listar visitas:', error);
        return res.status(500).json({ message: 'Erro interno ao tentar listar as visitas.' });
    }
};

const fetchUserVisitInfo = async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId); // Encontrar o usuário pelo ID
  
      if (!user) {
        return res.status(404).json({ message: 'Visitante não encontrado' });
      }
      res.json({ nome: user.nome }); // Retorna o nome do visitante
    } catch (error) {
      console.error('Erro ao buscar visitante', error);
      res.status(500).json({ message: 'Erro ao buscar visitante' });
    }
  };

  const atualizarStatusVisita = async (req, res) => {
    try {
      const visitanteId = req.params.id; 
      const { pontos, visitaId } = req.body; 
  
      const visitante = await User.findById(visitanteId);
      if (!visitante) {
        return res.status(404).json({ error: 'Visitante não encontrado' });
      }
  
      visitante.pontos += pontos;
  
      const local = await Local.findOne({ 'visitas._id': visitaId });
  
      if (!local) {
        return res.status(404).json({ error: 'Visita não encontrada' });
      }
  
      const visita = local.visitas.id(visitaId); 
      if (visita) {
        visita.status = true; 
      }
  
      await visitante.save();
      await local.save();
  
      res.status(200).json({
        message: 'Pontos atualizados e visita confirmada com sucesso!',
        pontos: visitante.pontos,
        visitaStatus: visita.status,
      });
  
    } catch (error) {
      console.error("Erro ao atualizar pontos e status da visita:", error);
      res.status(500).json({ error: 'Erro ao atualizar os pontos e status da visita' });
    }
  };
  
  const deleteLocal = async (req, res) => {
    const localId = req.params.id;  // ID do local passado na URL

    try {
        const local = await Local.findById(localId);

        if (!local) {
            return res.status(404).json({ message: 'Local não encontrado' });
        }

        if (local._id.toString() !== req.local._id.toString()) {
            return res.status(403).json({ message: 'Você não tem permissão para deletar esse local.' });
        }

        local.visitas = [];
        local.local = undefined;  

        await local.save();  

        res.clearCookie("Authorization-local", {
            httpOnly: true,
            sameSite: 'none', 
            secure: true, 
            path: '/',
        });

        return res.status(200).json({ message: 'Local e suas visitas deletados com sucesso e logout realizado.' });
    } catch (error) {
        console.error('Erro ao tentar deletar o local e suas visitas:', error);
        return res.status(500).json({ message: 'Erro interno ao tentar deletar o local e suas visitas.' });
    }
};
  
const editLocal = async (req, res) => {
    const localId = req.params.id;  
    const { nome, email } = req.body;  
    try {
        const local = await Local.findById(localId);

        if (!local) {
            return res.status(404).json({ message: 'Local não encontrado' });
        }

        if (local._id.toString() !== req.local._id.toString()) {
            return res.status(403).json({ message: 'Você não tem permissão para editar este local.' });
        }

        if (nome) local.nome = nome;
        if (email) local.email = email;
        await local.save();

        return res.status(200).json({ message: 'Local atualizado com sucesso.', local });
    } catch (error) {
        console.error('Erro ao tentar editar o local:', error);
        return res.status(500).json({ message: 'Erro interno ao tentar editar o local.' });
    }
};

const deleteContaLocal = async (req, res) => {
    const userId = req.params.id;  

    try {
        const local = await Local.findById(userId);
        if (!local) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (local._id.toString() !== req.local._id.toString()) {
            return res.status(403).json({ message: 'Você não tem permissão para deletar esta conta.' });
        }
        await Local.deleteOne({ _id: userId });

        res.clearCookie("Authorization-local", {
            httpOnly: true,
            sameSite: 'none', 
            secure: true, 
            path: '/',
        });

        res.status(200).json({ message: 'Conta deletada com sucesso e logout realizado.' });
    } catch (error) {
        console.error('Erro ao tentar deletar a conta do local:', error);
        return res.status(500).json({ message: 'Erro interno ao tentar deletar a conta.' });
    }
};


module.exports = {
    createLocal,
    loginLocal,
    checkAuthLocal,
    logoutLocal,
    getLoggedUserLocal,
    addColeta,
    getLocais,
    registerVisit,
    listVisits,
    editUserLocal,
    listVisitsInLocal,
    fetchUserVisitInfo,
    atualizarStatusVisita,
    deleteLocal,
    editLocal,
    deleteContaLocal
}