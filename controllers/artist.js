const Artist = require("../models/artist");
const { errorHandler } = require("../helpers/dbErrorHandler");

// middlewares rest

exports.artistById = (req, res, next, id) => {
    Artist.findById(id).exec((err, artist) => {
        if (err || !artist) {
            return res.status(404).json({
                error: "Artist does not exist"
            });
        }
        req.artist = artist;
        next();
    });
};

exports.create = (req, res) => {
    const artist = new Artist(req.body);
    artist.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json( { data });
    });
};

exports.read = (req, res) => {
    return res.json(req.artist);
};

exports.update = (req, res) => {
    const artist = req.artist;
    artist.name = req.body.name;
    artist.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const artist = req.artist;
    artist.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "artist deleted"
        });
    });
};

exports.list = (req, res) => {
    Artist.find().exec((err, data) => {
        if (err) {
            return res.status.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};