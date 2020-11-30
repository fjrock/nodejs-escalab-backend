const express = require("express");
const router = express.Router();

const {
    create,
    genreById,
    read,
    update,
    remove,
    list
} = require("../controllers/genre");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

// routes
router.get("/genre/:genreId", read);
router.post("/genre/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put(
    "/genre/:genreId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);
router.delete(
    "/genre/:songId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.get("/genres", list);

// params
router.param("genreId", genreById);
router.param("userId", userById);

module.exports = router;