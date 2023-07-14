const express = require('express');
const app = express();
const port = 8000;

const { addUser, listUsers, updateUser, deleteUser, getUserById} = require('./controllers/userController');
const { connectDatabase, closeDatabase } = require('./database/Database.js');

app.use(express.json());

app.post('/users', addUser);
app.put('/user/:id', updateUser);
app.delete('/deluer/:id', deleteUser);
app.get('/getuser/:id', getUserById);
app.get('/listUsers', listUsers)

const startServer = async () => {
  try {
    await connectDatabase(); // เชื่อมต่อฐานข้อมูล

    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // ปิดการเชื่อมต่อกับ MongoDB เมื่อปิดแอปพลิเคชัน
    process.on('SIGTERM', async () => {
      await closeDatabase(); // ปิดการเชื่อมต่อฐานข้อมูล
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
