const client = require("./client");
const bcrypt = require("bcrypt");

//==========================================================

const createUser = async ({ email, name, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const resp = await client.query(
      `
                INSERT INTO users(email, name, password)
                VALUES ($1, $2, $3)
                RETURNING *
                `,
      [email, name, hashedPassword]
    );
    const user = resp.rows[0];
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
};

//==========================================================

const getAllUsers = async () => {
  try {
    const resp = await client.query(
      `
              SELECT *
              FROM users
            `
    );

    const users = resp.rows;
    for (let user of users) {
      delete user.password;
    }
    return users;
  } catch (error) {
    throw error;
  }
};

// getAllUsers().then(console.log);

//==========================================================

const getUser = async ({ email, password }) => {
  try {
    const resp = await client.query(
      `
              SELECT *
              FROM users
              WHERE email=$1
            `,
      [email]
    );

    const user = resp.rows[0];
    if (await bcrypt.compare(password, user.password)) {
      delete user.password;
      return user;
    }
  } catch (error) {
    throw error;
  }
};

// getUser({ email: "email@email.com", password: "password" }).then(console.log);

//==========================================================

const getUserById = async (userId) => {
  try {
    const resp = await client.query(
      `
              SELECT *
              FROM users
              WHERE id=$1
            `,
      [userId]
    );
    const user = resp.rows[0];
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
};

// getUserById(1).then(console.log);

//==========================================================

const getUserByEmail = async (email) => {
  try {
    const resp = await client.query(
      `
              SELECT *
              FROM users
              WHERE email=$1
            `,
      [email]
    );
    const user = resp.rows[0];
    return user;
  } catch (error) {
    throw error;
  }
};

// getUserByEmail("email@email.com").then(console.log);

//==========================================================

const deleteUser = async (id) => {
  try {
    const resp = await client.query(
      `
                DELETE FROM users
                WHERE id=$1
              `,
      [id]
    );
  } catch (error) {
    throw error;
  }
};

// deleteUser(2);

//==========================================================

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByEmail,
  deleteUser,
  getAllUsers,
};
