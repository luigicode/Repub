const router = require("express").Router();
const pool = require("../../db");
const auhtorization = require("../middleware/authorize");

router.get("/", auhtorization, async (req, res) => {
  try {
    // rq.user has payload
    // res.json(req.user);

    const user = await pool.query(
      "SELECT user_name FROM users WHERE user_id = $1",
      [req.user]
    );

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("server error");
  }
});

module.exports = router;
