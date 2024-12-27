import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/User.js';


const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/ToDo', {
  
});

const db = mongoose.connection;
db.on('error', (error) => console.error('Greška pri spajanju:', error));
db.once('open', () => console.log('Spojeni smo na MongoDB bazu'));

const provjeriToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).send('Ne postoji autorizacijsko zaglavlje');

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(403).send('Bearer token nije pronađen');

  try {
    const decodedToken = jwt.verify(token, 'your_jwt_secret'); 
    req.korisnik = decodedToken;
  } catch (err) {
    return res.status(401).send('Neispravni Token');
  }
  return next();
};

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// app.post('/books', provjeriToken, async (req, res) => {
//   const { title, author, review, readingMethod, rating, favouriteChar, newWords } = req.body;
//   const userId = req.korisnik.id; 

//   try {
//     const book = new Book({ title, author, review, readingMethod, rating, favouriteChar, newWords, userId });
//     const savedBook = await book.save(); 
//     res.status(201).json(savedBook);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.get('/books', provjeriToken, async (req, res) => {
//   const userId = req.korisnik.id; 

//   try {
//     const books = await Book.find({ userId }); 
//     res.json(books);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.delete('/books/:id', provjeriToken, async (req, res) => {
//   const { id } = req.params;

//   try {
//     console.log("Usa1")
//     const book = await Book.findByIdAndDelete(id);
//     if (!book) {
//       return res.status(404).json({ message: 'Book not found' });
//     }

//     if (book.userId.toString() !== req.korisnik.id) {
//       console.log("Usa2")
//       return res.status(403).json({ message: 'Unauthorized action' });
//     }

   
//     console.log("Usa3")
//     res.status(200).json({ message: 'Book deleted successfully' });
//     console.log("Usa4")
//   } catch (error) {
    
//     res.status(500).json({ error: error.message });
//     console.log("Usa5")
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
