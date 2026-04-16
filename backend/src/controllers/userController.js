const pool = require('../config/db');

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { name, email, course, year } = req.body;

    const result = await pool.query(
      'INSERT INTO users (name, email, course, year) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, course, year]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL USERS
exports.getUsers = async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
};


exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.patchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    // agar body empty hai
    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // dynamic query banayenge
    let query = "UPDATE users SET ";
    let values = [];
    let index = 1;

    for (let key in fields) {
      query += `${key} = $${index}, `;
      values.push(fields[key]);
      index++;
    }

    // last comma hatao
    query = query.slice(0, -2);

    // WHERE clause add karo
    query += ` WHERE id = $${index} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM users WHERE id=$1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔍 SEARCH USERS
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    // agar query empty hai
    if (!q) {
      return res.status(400).json({ message: "Search query required" });
    }

    const result = await pool.query(
      `SELECT id, name, email 
       FROM users 
       WHERE name ILIKE $1 OR email ILIKE $1`,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};