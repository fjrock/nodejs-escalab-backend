const express = require("express");
const router = express.Router();

const { requireSignin, isAuth } = require("../controllers/auth");

const {
    userById,
    read,
    update,
} = require("../controllers/user");

// routes

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", requireSignin, isAuth, update);

// params
router.param("userId", userById);

module.exports = router;