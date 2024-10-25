const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    // required: true
  },
  email: {
    type: String,
    // required: true,
    // unique: true,
    lowercase: true,
    index: true,
  },
  senha: {
    type: String,
    // required: true, 
  },
  pontos: {
    type: Number,
    default: 0
  },
  conta: {
    type: Number,
    default: 1
  },
  prizes: [{
    prizeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift' },  
    codigo: { type: String },  
    redeemedAt: { type: Date, default: Date.now },  
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
