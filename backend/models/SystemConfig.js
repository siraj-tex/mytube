import mongoose from 'mongoose';

const systemConfigSchema = new mongoose.Schema(
  {
    rpm: {
      type: Number,
      default: 1, // $1 per 10 views
    },
  },
  { timestamps: true }
);

const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);
export default SystemConfig;
