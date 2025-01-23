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
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));




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

////////////////////////////////////////////////////
//Anamarijino -Goals For The day 
////////////////////////////////////////////////////


const GoalsSchema=new mongoose.Schema({
  text: {type: String, required:true},
  completed: {type:Boolean, default:false},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Goal=mongoose.model('Goal', GoalsSchema);

app.get('/goals', provjeriToken, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.korisnik.id }); // Fetch goals for this user
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Ispunjenost goal-a s provjerom je li već ispunjen
app.put('/goals/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const goal = await Goal.findById(id);

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Provjeri je li goal ispunjen
    if (goal.completed) {
      return res.status(400).json({ error: 'Goal is already completed and cannot be marked as not done' });
    }

    // Označi ga kao ispunjenog
    goal.completed = true;
    await goal.save();
    res.status(200).json(goal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update goal' });
  }
});


//dodavanje novog goal
app.post('/goals',provjeriToken, async(req, res)=>{
  //dodajemo novi goal povezan s Id-em
  try{

    const newGoal=new Goal({
      text: req.body.text,
      userId:req.korisnik.id,
  });
  await newGoal.save();
  res.status(201).json(newGoal);
  }catch(err){
    res.status(500).send(err.message);
  }
 
});

//ispunjenje goal-a
app.put('/goals/:id', async(req,res)=>{
  const {id}= req.params;

  try{
    const goal=await Goal.findById(id);
    if(!goal){
      return res.status(404).json({error:'Goal not found'});
    }
    goal.completed=!goal.completed;
    await goal.save();
    res.status(200).json(goal);
  }catch(err){
    res.status(500).json({error:'Fail to update goal'});
  }
});



//NOTES DIO

// Define NoteSchema and routes inline
const NoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Note = mongoose.model('Note', NoteSchema);

// API routes for Notes
// Get all notes for the authenticated user
app.get('/notes', provjeriToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.korisnik.id });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Add a new note
app.post('/notes', provjeriToken, async (req, res) => {
  try {
    const newNote = new Note({
      text: req.body.text,
      userId: req.korisnik.id,
    });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update a note
app.put('/notes/:id', provjeriToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId.toString() !== req.korisnik.id) {
      return res.status(403).json({ message: 'Unauthorized to update this note' });
    }

    note.text = req.body.text || note.text;
    await note.save();
    res.status(200).json(note);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete a note
app.delete('/notes/:id', provjeriToken, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.userId.toString() !== req.korisnik.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this note' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
});
