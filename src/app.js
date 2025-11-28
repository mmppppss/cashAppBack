const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('../config/database');
const authRoutes = require('./auth/auth.route'); 
const userRoutes = require('./users/user.route');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
  res.send('Servidor Express corriendo.');
});


app.listen(PORT, () => {
  console.log(`[002] Servidor corriendo en http://localhost:${PORT}`);
});
