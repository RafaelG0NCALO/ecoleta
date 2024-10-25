const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  custo: { type: Number, required: true },  // Quantos pontos custa o prêmio
  imagemUrl: { type: String },  // URL da imagem do prêmio
  createdAt: { type: Date, default: Date.now },
});

const Gift = mongoose.model('Gift', giftSchema);
module.exports = Gift;
