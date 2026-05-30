import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'bot'], // Strict validation ensuring only 'user' or 'bot' can send messages
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatLogSchema = new mongoose.Schema({
  // The specific legal module view where this conversation belongs
  category: { 
    type: String, 
    required: true 
  },
  // An array tracking the entire chronological back-and-forth stream
  messages: [messageSchema],
}, { 
  // Automatically adds and updates 'createdAt' and 'updatedAt' fields for database indexing
  timestamps: true 
});

const ChatLog = mongoose.model('ChatLog', chatLogSchema);

export default ChatLog;