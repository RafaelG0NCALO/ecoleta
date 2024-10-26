import { create } from 'zustand'; 
import axios from 'axios';

const userStore = create((set) => ({

    loggedIn: null,
    user: null, 
     
    createForm: { 
      nome: "", 
      email: "", 
      senha: "" ,
    },
    loginForm:{ 
      email: "", 
      senha: "" ,
    },

    updateLoginForm: (e) => {
       const{ name, value } = e.target 
        set((state) => {
          return{
            loginForm:{
              ...state.loginForm,
              [name]: value,
            }
          }
        }) 
    },

    updateCreateFormField: (e) => {
        const { name, value } = e.target;
        set((state) => ({
            createForm: {
                ...state.createForm,
                [name]: value,
            }
        }));
    },

    login: async () => {
      const { loginForm } = userStore.getState();
      const res = await axios.post('/login', loginForm);
      set({ loggedIn: true, loginForm:{ 
        email: "", 
        senha: "" 
      }});
    },

    checkAuth: async () => {
      try{
        await axios.get('/check-auth');
        set({ loggedIn: true });
      } catch(err){
        set({ loggedIn: false });
      }
    },

    createUser: async () => {
        const { createForm } = userStore.getState();
        const res = await axios.post("/users", createForm);
        set({ 
          createForm: { 
            nome: "", 
            email: "", 
            senha: ""
        }})  
    },

    updateUser: async (userId, userData) => {
      try {
          const res = await axios.put(`/users/${userId}`, userData); 
          set({ user: res.data.user }); 
      } catch (error) {
          console.error("Erro ao atualizar o usuário:", error);
          throw error;
      }
    },

    fetchUserProfile: async () => {
      try {
        const res = await axios.get('/profile-user'); 
        set({ user: res.data.user });
      } catch (error) {
        console.log("Erro ao buscar o perfil do usuário:", error);
      }
    },

    logout: async () => {
      await axios.get('/logout'); 
      set({ loggedIn: false, user: null });
    },
    
}));

export default userStore;
