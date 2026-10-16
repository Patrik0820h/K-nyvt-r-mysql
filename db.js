import mysql from 'mysql2/promise';

const dbconfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'konyvtar',
  port: 3306
};

const pool = mysql.createPool(dbconfig);

export default pool;