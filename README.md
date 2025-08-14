# Flashcard App - Full Stack Learning Project

A complete full-stack flashcard application built with Node.js, Express, MongoDB, and vanilla JavaScript. This project demonstrates the fundamental concepts of full-stack development, including API design, database integration, and frontend-backend communication.

## 🚀 Features

### Study Mode
- Interactive flashcard flipping with smooth animations
- Progress tracking during study sessions
- Review count tracking for each card
- Responsive design for all devices

### Management Features
- Create, read, update, and delete flashcards
- Categorize flashcards by subject or topic
- Set difficulty levels (Easy, Medium, Hard)
- Filter and search through your collection
- Real-time updates without page refresh

### Technical Features
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- Modern, responsive UI with CSS Grid and Flexbox
- Toast notifications for user feedback
- Modal dialogs for data entry and confirmation

## 🏗️ Architecture

This application follows a clear separation of concerns:

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ODM
- **Communication**: RESTful API endpoints

## 📋 Prerequisites

Before running this application, make sure you have:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running
- A code editor (VS Code recommended)

## 🛠️ Installation

1. **Clone or download the project files**
   ```bash
   # If you have git installed
   git clone <repository-url>
   cd flashcard-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/flashcard-app
   ```

4. **Start MongoDB**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Windows
   net start MongoDB
   
   # On Linux
   sudo systemctl start mongod
   ```

5. **Run the application**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗄️ Database Setup

The application will automatically create the database and collections when you first run it. However, if you want to add some sample data:

1. **Start the application**
2. **Use the "Add New Card" button** to create your first flashcard
3. **Or use MongoDB Compass** to manually add documents to the `flashcards` collection

## 📚 API Endpoints

The backend provides the following RESTful API endpoints:

### Flashcards
- `GET /api/flashcards` - Get all flashcards
- `GET /api/flashcards/category/:category` - Get flashcards by category
- `POST /api/flashcards` - Create a new flashcard
- `PUT /api/flashcards/:id` - Update a flashcard
- `DELETE /api/flashcards/:id` - Delete a flashcard
- `PATCH /api/flashcards/:id/review` - Update review count

### Categories
- `GET /api/categories` - Get all unique categories

## 🎯 Learning Objectives

This project teaches you:

1. **Backend Development**
   - Setting up an Express.js server
   - Creating RESTful API endpoints
   - Database integration with MongoDB
   - Data validation and error handling

2. **Frontend Development**
   - Modern CSS with Grid and Flexbox
   - JavaScript ES6+ features
   - DOM manipulation and event handling
   - Responsive design principles

3. **Full-Stack Concepts**
   - Client-server communication
   - API design patterns
   - Data persistence
   - State management

4. **Development Practices**
   - Project structure and organization
   - Environment configuration
   - Error handling and user feedback
   - Responsive design

## 🔧 Customization

### Adding New Features
- **New card types**: Extend the Mongoose schema in `server.js`
- **Additional filters**: Add new filter options in the frontend
- **Study modes**: Implement spaced repetition or other algorithms
- **User authentication**: Add user accounts and personal collections

### Styling Changes
- Modify `public/styles.css` to change the appearance
- Update color schemes, fonts, or layouts
- Add new animations or transitions

### Backend Extensions
- Add new API endpoints in `server.js`
- Implement data validation middleware
- Add logging and monitoring
- Integrate with external services

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your connection string in `.env`
   - Verify MongoDB is accessible on the expected port

2. **Port Already in Use**
   - Change the PORT in your `.env` file
   - Or kill the process using the current port

3. **Dependencies Not Found**
   - Run `npm install` again
   - Check your Node.js version
   - Clear npm cache: `npm cache clean --force`

4. **Frontend Not Loading**
   - Check browser console for errors
   - Verify the server is running
   - Check file paths in the HTML

## 📖 Next Steps

After mastering this project, consider:

1. **Adding User Authentication**
   - Implement user registration and login
   - Personal flashcard collections
   - User preferences and settings

2. **Advanced Study Features**
   - Spaced repetition algorithms
   - Study statistics and analytics
   - Export/import functionality

3. **Mobile App Development**
   - Convert to React Native or Flutter
   - Offline functionality
   - Push notifications

4. **Backend Enhancements**
   - Add Redis for caching
   - Implement rate limiting
   - Add comprehensive logging
   - Set up automated testing

## 🤝 Contributing

This is a learning project, but if you find bugs or have suggestions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built for educational purposes
- Inspired by popular flashcard apps like Anki
- Uses modern web technologies and best practices

---

**Happy Learning! 🎓**

If you have questions or need help, feel free to reach out or check the code comments for additional guidance.
# FlashCards
