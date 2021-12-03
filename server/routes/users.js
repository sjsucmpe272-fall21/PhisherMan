const express = require("express");
const router = express.Router();
const { getUsers, addUser, deleteUser, loginUser } = require("../controllers/Users");

router.route("/").get(getUsers).post(addUser);

router.route("/:id").delete(deleteUser);
router.route("/login").post(loginUser)

router.route("/:id/url").post(addUser);

module.exports = router;
