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

//Elino

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Task = mongoose.model('Task', TaskSchema);

// API rute
// Dohvaćanje zadataka korisnika
app.get('/tasks', provjeriToken, async (req, res) => {
  try {
    // Filtriramo zadatke prema korisničkom ID-u
    const tasks = await Task.find({ userId: req.korisnik.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Dodavanje zadatka
app.post('/tasks', provjeriToken, async (req, res) => {
  try {
    // Dodajemo zadatak povezanu s korisničkim ID-em
    const newTask = new Task({
      name: req.body.name,
      userId: req.korisnik.id,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Brisanje zadatka
app.delete('/tasks/:id', provjeriToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Provjera postoji li zadatak
    if (!task) {
      return res.status(404).json({ message: 'Zadatak nije pronađen' });
    }

    // Provjera vlasništva nad zadatkom
    if (task.userId.toString() !== req.korisnik.id) {
      return res.status(403).json({ message: 'Nemate dopuštenje za brisanje ovog zadatka' });
    }

    // Brisanje zadatka
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});


//Antea

const ScheduleSchema = new mongoose.Schema({
  name: { type: String, required: false },  // Ako nije potrebno, postavi required: false

  time: { type: String, required: true },  // Provjeri da li je `time` validan
  description: { type: String, required: true },  // Provjeri da li je `description` validan
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});


const Schedule = mongoose.model('Schedule', ScheduleSchema);


// API rute
// Dohvaćanje rasporeda korisnika

app.get('/schedules', provjeriToken, async (req, res) => {
  try {
    // Filtriramo zadatke prema korisničkom ID-u
    const schedules = await Schedule.find({ userId: req.korisnik.id });
    res.json(schedules);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


//spremanje dijela rasporeda


app.post('/schedules', provjeriToken, async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log za podatke iz frontenda
    console.log('User ID:', req.korisnik.id); // Log za korisnički ID iz tokena

    const newSchedule = new Schedule({
      time: req.body.time,
      description: req.body.description,
      userId: req.korisnik.id, // Korisnički ID
    });

    await newSchedule.save();
    res.status(201).json(newSchedule);
  } 
  catch (err) {
    console.error('Greška pri dodavanju rasporeda:', err); // Logiraj detaljnu grešku
    res.status(500).send(err.message);
  }
});

//azuriranje rasporeda

app.put('/schedules/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  console.log('Ažuriranje rasporeda sa ID-jem:', id);
  console.log('Podaci koje šaljete:', updatedData); // Log za podatke iz frontenda

  try {
    // Ispravno koristiti model Schedule
    const updatedSchedule = await Schedule.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Raspored nije pronađen' });
    }

    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error('Greška pri ažuriranju rasporeda:', error); // Detaljan ispis greške
    res.status(500).json({ message: 'Greška pri ažuriranju rasporeda', error });
  }
});



// Brisanje rasporeda
app.delete('/schedule/:id', provjeriToken, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    // Provjera postoji li taj dio rasporeda
    if (!schedule) {
      return res.status(404).json({ message: 'Raspored nije pronađen' });
    }

    // Provjera vlasništva nad rasporedom
    if (schedule.userId.toString() !== req.korisnik.id) {
      return res.status(403).json({ message: 'Nemate dopuštenje za brisanje ovog dijela rasporeda' });
    }

    // Brisanje dijela rasporeda
    await Schedule.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
