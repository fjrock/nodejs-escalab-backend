const express = require("express");
const router = express.Router();

const {
    create,
    artistById,
    read,
    update,
    remove,
    list
} = require("../controllers/artist");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

// routes
router.get("/artist/:artistId", read);
router.post("/artist/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put(
    "/artist/:artistId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);
router.delete(
    "/artist/:artistId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.get("/artists", list);

// params
router.param("artistId", artistById);
router.param("userId", userById);

module.exports = router;