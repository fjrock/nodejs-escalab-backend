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

/**
 * @swagger   
 * /api/song/create/{userId}: 
 *  post:
 *    summary: crear cancion
 *    parameters:
 *       - name: userId
 *         in: path
 *         description: Parametro usuario existente
 *         schema:
 *           type : String
 *           minimum: 1
 *    description: request para crear cancion
 *    requestBody: 
 *      content:
 *        application/json:
 *          schema:
 *            properties:
 *              name:
 *                  type: string
 *                  description: nombre de la cancion 
 *    responses:
 *      "200":
 *         description: A successful response
 *      "400":
 *         description: A bad request response
 */
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