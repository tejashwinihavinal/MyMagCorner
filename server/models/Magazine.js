import mongoose from 'mongoose';

const magazineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    categories: { type: [String], required: true },
    fileUrl: { type: String, required: true },
    coverImageUrl: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] }, // Ensure default is an empty array
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('Magazine', magazineSchema);