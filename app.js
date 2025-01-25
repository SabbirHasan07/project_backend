const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 

const app = express();
const port = 3000;


const pool = mysql.createPool({
  host: 'srv1667.hstgr.io',
  user: 'u474521097_project_user',
  password: 'Dh@ka1212',
  database: 'u474521097_project_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


app.use(cors());


pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the MySQL database');
  connection.release(); 
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
