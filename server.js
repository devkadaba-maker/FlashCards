const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flashcard-app', mongoOptions);

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
  console.error('Please check your MongoDB connection string and network connectivity');
});

db.on('connected', () => {
  console.log('MongoDB connected successfully!');
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

db.once('open', () => {
  console.log('Connected to MongoDB successfully!');
  console.log('Database:', db.name);
  console.log('Host:', db.host);
  console.log('Port:', db.port);
});

// Flashcard Schema
const flashcardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    default: 'General',
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastReviewed: {
    type: Date,
    default: Date.now
  },
  reviewCount: {
    type: Number,
    default: 0
  }
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

// API Routes

// Get all flashcards
app.get('/api/flashcards', async (req, res) => {
  try {
    const flashcards = await Flashcard.find().sort({ createdAt: -1 });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flashcards', error: error.message });
  }
});

// Get flashcards by category
app.get('/api/flashcards/category/:category', async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ category: req.params.category });
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flashcards by category', error: error.message });
  }
});

// Create a new flashcard
app.post('/api/flashcards', async (req, res) => {
  try {
    const { question, answer, category, difficulty } = req.body;
    
    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const flashcard = new Flashcard({
      question,
      answer,
      category: category || 'General',
      difficulty: difficulty || 'Medium'
    });

    const savedFlashcard = await flashcard.save();
    res.status(201).json(savedFlashcard);
  } catch (error) {
    res.status(500).json({ message: 'Error creating flashcard', error: error.message });
  }
});

// Update a flashcard
app.put('/api/flashcards/:id', async (req, res) => {
  try {
    const { question, answer, category, difficulty } = req.body;
    
    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      { question, answer, category, difficulty },
      { new: true, runValidators: true }
    );

    if (!updatedFlashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    res.json(updatedFlashcard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating flashcard', error: error.message });
  }
});

// Delete a flashcard
app.delete('/api/flashcards/:id', async (req, res) => {
  try {
    const deletedFlashcard = await Flashcard.findByIdAndDelete(req.params.id);
    
    if (!deletedFlashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting flashcard', error: error.message });
  }
});

// Update review count and last reviewed date
app.patch('/api/flashcards/:id/review', async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }

    flashcard.reviewCount += 1;
    flashcard.lastReviewed = new Date();
    await flashcard.save();

    res.json(flashcard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review count', error: error.message });
  }
});

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Flashcard.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/`);
});
