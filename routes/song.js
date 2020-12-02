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

/**
*  @swagger
*   components:
*     schemas:
*       Song:
*         type: object
*         required:
*           - name
*         properties:
*           name:
*             type: String
*             description: Nombre de la cancion
*         example:
*            name: master of puppets
*/

/**
 * @swagger   
 * /api/song/{songId}/{userId}: 
 *  get:
 *    summary: obtener una cancion
 *    parameters:
 *       - name: songId
 *         in: path
 *         description: Parametro cancion existente
 *         schema:
 *         type : String
 *       - name: userId
 *         in: path
 *         description: Parametro usuario existente
 *         schema:
 *         type : String
 *    description: request para obtener cancion
 *    responses:
 *      "200":
 *         description: A successful response
 *      "400":
 *         description: A bad request response
 */
router.get("/song/:songId/:userId", requireSignin, isAuth, isAdmin, read);

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

/**
 * @swagger   
 * /api/song/{songId}/{userId}: 
 *  put:
 *    summary: crear/actualizar cancion
 *    parameters:
 *       - name: songId
 *         in: path
 *         description: Parametro cancion existente
 *         schema:
 *         type : String
 *       - name: userId
 *         in: path
 *         description: Parametro usuario existente
 *         schema:
 *         type : String
 *    description: request para crear cancion
 *    responses:
 *      "200":
 *         description: A successful response
 *      "400":
 *         description: A bad request response
 */
router.put("/song/:songId/:userId",requireSignin,isAuth,isAdmin,update);

/**
 * @swagger   
 * /api/song/{songId}/{userId}: 
 *  delete:
 *    summary: borrar cancion
 *    parameters:
 *       - name: songId
 *         in: path
 *         description: Parametro cancion existente
 *         schema:
 *         type : String
 *       - name: userId
 *         in: path
 *         description: Parametro usuario existente
 *         schema:
 *         type : String
 *    description: request para borrar cancion
 *    responses:
 *      "200":
 *         description: A successful response
 *      "400":
 *         description: A bad request response
 */
router.delete("/song/:songId/:userId",requireSignin,isAuth,isAdmin,remove);

/**
 * @swagger   
 * /api/songs/{userId}: 
 *  get:
 *    summary: obtener todas las canciones
 *    parameters:
 *       - name: userId
 *         in: path
 *         description: Parametro usuario existente
 *         schema:
 *         type : String
 *    description: request para obtener todas las canciones
 *    responses:
 *      "200":
 *         description: A successful response
 *      "400":
 *         description: A bad request response
 */
router.get("/songs/:userId",requireSignin,isAuth,isAdmin, list);

// params
router.param("songId", songById);
router.param("userId", userById);

module.exports = router;