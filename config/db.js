import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'rootpassword',
  database: 'plate_db'
});

export default pool;
