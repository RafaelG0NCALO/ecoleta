import { create } from 'zustand'; 
import axios from 'axios';

const localStore = create((set) => ({
 
    loggedInLocal: null,
    local: null,
    createFormLocal: { 
        nome: "", 
        email: "", 
        senha: "" ,
    },

    loginFormLocal:{ 
        email: "", 
        senha: "" ,
    },

    createUserLocal: async () => {
        const { createFormLocal } = localStore.getState();
        await axios.post("/local", createFormLocal);
        set({ 
          createFormLocal: { 
            nome: "", 
            email: "", 
            senha: ""
        }})  
    },
    updateCreateFormFieldLocal: (e) => {
        const { name, value } = e.target;
        set((state) => ({
             createFormLocal: {
                ...state.createFormLocal,
                [name]: value,
            }
        }));
    },
    loginLocal: async () => {
        const { loginFormLocal } = localStore.getState();
        await axios.post('/login-local', loginFormLocal);
        set({ loggedInLocal: true, loginFormLocal:{ 
          email: "", 
          senha: "" 
        }});
    },
    checkAuthLocal: async () => {
        try{
          await axios.get('/check-auth-local');
          set({ loggedInLocal: true });
        } catch(err){
          set({ loggedInLocal: false });
        }
    },
    updateLoginFormLocal: (e) => {
        const{ name, value } = e.target 
         set((state) => {
           return{
             loginFormLocal:{
               ...state.loginFormLocal,
               [name]: value,
             }
           }
         }) 
     },
     fetchUserProfileLocal: async () => {
      try {
        const res = await axios.get('/profile-user-local'); 
        set({ local: res.data.local });
      } catch (error) {
        console.log("Erro ao buscar o perfil do usuário:", error);
      }
    },
}));

export default localStore;