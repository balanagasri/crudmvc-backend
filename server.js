const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // Add this line to load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB using the environment variable
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// Define Student Schema
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    grade: String,
});

const Student = mongoose.model('Student', studentSchema);

// API Endpoints
app.get('/api/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.post('/api/students', async (req, res) => {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.json(newStudent);
});

app.put('/api/students/:id', async (req, res) => {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStudent);
});

app.delete('/api/students/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
