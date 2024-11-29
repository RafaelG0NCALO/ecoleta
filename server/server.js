if(process.env.NODE_ENV != 'production'){
    require("dotenv").config();
}

//Dependencias
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const connectToDB = require('./config/connectToDb');
const usersController = require('./controllers/usersControllers')
const localController = require('./controllers/localControllers')
const requireAuth = require('./middleware/requireAuth');
const requireAuthLocal = require('./middleware/requeireAuthLocal');

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
}));

connectToDB();

//CRUD usuario
app.get("/users", usersController.fetchUsers);
app.get("/users/:id", usersController.fetchUser);
app.post("/users", usersController.createUser);
app.put("/users/:id", requireAuth, usersController.updateUser);
app.delete("/users/:id", requireAuth, usersController.deleteUser);

//Login
app.post("/login", usersController.login);
app.get('/check-auth', requireAuth, usersController.checkAuth);
app.get("/logout", usersController.logout);

// Usuarios local visitas
app.get("/profile-user", requireAuth, usersController.getLoggedUser);
app.get("/profile-user-local", requireAuthLocal, localController.getLoggedUserLocal);
app.put('/edit-profile-user-local/:id', requireAuthLocal, localController.editUserLocal);
app.get('/listar-visitas/:id', requireAuthLocal, localController.listVisitsInLocal);
app.get('/listar-visitante/:id', requireAuthLocal, localController.fetchUserVisitInfo);
app.put('/status/:id', requireAuthLocal, localController.atualizarStatusVisita);
app.delete('/local/:id', requireAuthLocal, localController.deleteLocal);
app.put('/local/:id', requireAuthLocal, localController.editLocal);
app.delete('/local-user/:id', requireAuthLocal, localController.deleteContaLocal);

//visita
app.post("/visita", requireAuth, localController.registerVisit);
app.get('/visita', requireAuth, localController.listVisits);
app.delete('/visita/:visitaId', requireAuth, usersController.deleteVisit);

//Gift
app.get("/premios", requireAuth, usersController.getGift);
app.post("/premios", requireAuth, usersController.createGift);
app.post("/resgatar", requireAuth, usersController.claimGift);

//LOCAL DE COLETA
app.post("/local", localController.createLocal);
app.post("/login-local", localController.loginLocal);
app.get("/check-auth-local", requireAuthLocal, localController.checkAuthLocal);
app.post("/coleta", requireAuthLocal, localController.addColeta);
app.get("/logout-local", localController.logoutLocal);
app.get("/locais", requireAuth, localController.getLocais);

app.listen(process.env.PORT);