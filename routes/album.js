const express = require("express");
const router = express.Router();

const {
    create,
    albumById,
    read,
    update,
    remove,
    list
} = require("../controllers/album");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

// routes
router.get("/album/:albumId", read);
router.post("/album/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put(
    "/album/:albumId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    update
);
router.delete(
    "/album/:albumId/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    remove
);
router.get("/albums", list);

// params
router.param("albumId", albumById);
router.param("userId", userById);

module.exports = router;