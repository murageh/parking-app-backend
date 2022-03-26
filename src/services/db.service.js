const mysql = require('mysql2/promise');
const pool = require('src/configs/db.config.mjs');

async function query(sql, params) {
  const [results, ] = await pool.execute(sql, params);

  return results;
}

module.exports = {
  query
}
