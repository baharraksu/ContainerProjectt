const express = require('express');
const app = express();
const PORT = 3000;

const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'db',
  database: 'app',
  password: 'password',
  port: 5432,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err);
  } else {
    console.log('Connected to PostgreSQL. Current time:', res.rows[0].now);
  }
});

app.listen(PORT, () => {
  console.log(`Client-app listening on port ${PORT}`);
});
