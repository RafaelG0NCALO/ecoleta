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

    formData: { nome: '', email: '' },

    loginFormLocal:{ 
        email: "", 
        senha: "" ,
    },

    coletaForm: {
      city: "",
      location: "",
      residuos: "",
      uf: ""
    },

    locais: [],

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

    logoutLocal: async () => {
      await axios.get('/logout-local'); 
      set({ loggedInLocal: false, local: null });
    },

    addColeta: async (formData) => {
      try {
          const response = await axios.post('/coleta', formData);
          console.log(response.data.message); // Mensagem de sucesso
          set({ coletaForm: { city: "", location: "", residuos: "", uf: "" } }); // Limpar o formulário
      } catch (error) {
          console.error("Erro ao cadastrar o ponto de coleta:", error.response?.data?.error || error.message);
      }
  },
  
    updateColetaFormField: (e) => {
        const { name, value } = e.target;
        set((state) => ({
            coletaForm: {
                ...state.coletaForm,
                [name]: value,
            }
        }));
    },

    fetchLocais: async () => {
      set({ loading: true, error: null });
      try {
          const response = await axios.get('/locais');
          set({ locais: response.data.local });
      } catch (error) {
          console.log(error)
      }
    },

    updateLocal: async (localId, localData) => {
      try {
          const res = await axios.put(`/local/${localId}`, localData); 
          set({ local: res.data.local }); 
      } catch (error) {
          console.error("Erro ao atualizar o usuário:", error);
          throw error;
      }
    },

    deleteLocal: async (userId) => {
      try {
          await axios.delete(`/local-user/${userId}`);
          set({ loggedInLocal: false, local: null });
          console.log('Conta deletada com sucesso.');
      } catch (error) {
          console.error("Erro ao tentar deletar a conta:", error);
          throw error;
      }
  },
  

}));

export default localStore;