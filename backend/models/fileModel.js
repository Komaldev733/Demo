const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: String,
  description: String,
  DocumentType: { type: String,required: true },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', fileSchema);
