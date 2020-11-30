const express = require("express");
const router = express.Router();

const {
    create,
    songById,
    read,
    update,
    remove,
    list
} = require("../controllers/song");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

// routes
router.get("/song/:songId", read);
router.post("/song/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put(
    "/song/:songId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);
router.delete(
    "/song/:songId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.get("/songs", list);

// params
router.param("songId", songById);
router.param("userId", userById);

module.exports = router;