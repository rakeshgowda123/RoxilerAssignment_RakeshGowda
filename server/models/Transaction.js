import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  price: Number,
  category: String,
  sold: Boolean,
  dateOfSale: Date,
  image: String
});

export default mongoose.model('Transaction', transactionSchema);