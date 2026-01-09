const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: Number,
  date: { type: Date, default: Date.now },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    }
  ],
  description: String
});

module.exports = mongoose.model('transaction', transactionSchema);
