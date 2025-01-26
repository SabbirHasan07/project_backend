const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(cors({origin: '*'}));
const pool = mysql.createPool({
  host: 'srv1667.hstgr.io',
  user: 'u474521097_project_user',
  password: 'Dh@ka1212',
  database: 'u474521097_project_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


app.use(bodyParser.json());

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the MySQL database');
  connection.release(); 
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  pool.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful', user: results[0] });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});


app.get('/data', (req, res) => {
  pool.query('SELECT * FROM requests', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error retrieving data');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
