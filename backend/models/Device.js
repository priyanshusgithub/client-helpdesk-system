const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  deviceName: {
    type: String,
    required: true,
    trim: true
  },
  softwareVersion: {
    type: String,
    trim: true
  },
  site: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Site',
    default: null
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'maintenance'],
    default: 'offline'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);