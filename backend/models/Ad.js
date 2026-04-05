import mongoose from 'mongoose';

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['video', 'image'],
      required: true,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Ad = mongoose.model('Ad', adSchema);
export default Ad;
