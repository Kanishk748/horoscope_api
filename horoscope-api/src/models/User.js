import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  sign: { type: String, required: true },
  text: { type: String, required: true }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  birthdate: { type: String, required: true }, // YYYY-MM-DD
  zodiac: { type: String, required: true },
  history: { type: [HistorySchema], default: [] }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
