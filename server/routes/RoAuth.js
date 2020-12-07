const router = require("express").Router();
const pool = require("../../db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorize = require("../middleware/authorize");

//register

router.post("/register", validInfo, async (req, res) => {
  try {
    // 1 destructure the req.body

    const { name, email, password } = req.body;

    // 2 if user exist

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).send("user already exists");
    }

    // 3 becrypt password

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4 enter user database

    let newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    res.json(newUser.rows[0]);
    // 5 generating token

    const jwtToken = jwtGenerator(newUser.rows[0].user_id);

    res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error•••");
  }
});

// login
router.post("/login", validInfo, async (req, res) => {
  try {
    // destructure the req.body
    const { email, password } = req.body;

    // if user dont exist throw err
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("password or email may be incorrect");
    }

    // check if incoming passwords is the same as the database pass

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("pass or email is incorrect");
    }
    //4  give token

    const jwtToken = jwtGenerator(user.rows[0].user_id);

    res.json({ jwtToken });
    //
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// verify token
router.get("/is-verify", authorize, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error ◘");
  }
});

module.exports = router;
