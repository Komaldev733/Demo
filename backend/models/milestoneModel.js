const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({     
  type: { type: String, required: true }, 
  fileUrl: { type: String, required: true }, 
});

const milestoneSchema = new mongoose.Schema({     
  title: String,   
  amount: Number,  
  status: String,  
  dueDate: Date,   
  files: { type: [fileSchema], default: [] } 
});

module.exports = mongoose.model("Milestone", milestoneSchema);
