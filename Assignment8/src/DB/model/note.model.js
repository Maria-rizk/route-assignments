import mongoose from 'mongoose';
const isNotAllUppercase = (val) => val !== val.toUpperCase();

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    validate: {
      validator: isNotAllUppercase,
      message: 'Title cannot be entirely uppercase.'
    }
  },
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);