const mongoose = require('mongoose');

const localSchema = new mongoose.Schema({
  nome: {
    type: String,
  },
  email: {
    type: String,
    lowercase: true,
    index: true,
  },
  senha: {
    type: String,
  },
  conta: {
    type: Number,
    default: 2
  },
  visitas: [{
    visitante: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
    dataVisita: { type: Date, default: Date.now },  
    status: { type: Boolean, default: false },  
    itens: [{
      descricao: { type: String }, 
      pontos: { type: Number, default: 0 }  
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Local = mongoose.model('Local', localSchema);
module.exports = Local;

