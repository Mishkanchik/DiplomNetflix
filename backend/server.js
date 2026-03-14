const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// тестовий маршрут, щоб перевірити що бек живий
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// тут підключаєш свої реальні роутери, наприклад:
// const authRoutes = require('./routes/authRoutes');
// app.use('/auth', authRoutes);

// порт ОБОВʼЯЗКОВО через process.env.PORT для Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
