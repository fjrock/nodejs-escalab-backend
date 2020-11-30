const Genre = require("../models/genre");
const { errorHandler } = require("../helpers/dbErrorHandler");

// middlewares rest

exports.genreById = (req, res, next, id) => {
    Genre.findById(id).exec((err, genre) => {
        if (err || !genre) {
            return res.status(404).json({
                error: "Genre does not exist"
            });
        }
        req.genre = genre;
        next();
    });
};

exports.create = (req, res) => {
    const genre = new Genre(req.body);
    genre.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json( { data });
    });
};

exports.read = (req, res) => {
    return res.json(req.genre);
};

exports.update = (req, res) => {
    const genre = req.genre;
    genre.name = req.body.name;
    genre.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const genre = req.genre;
    genre.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Genre deleted"
        });
    });
};

exports.list = (req, res) => {
    Genre.find().exec((err, data) => {
        if (err) {
            return res.status.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};