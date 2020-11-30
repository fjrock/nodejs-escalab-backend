const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const AlbumItemSchema = new mongoose.Schema(
    {
      album: { type: ObjectId, ref: "Album" },
    },
    { timestamps: true }
  );

const GenreItemSchema = new mongoose.Schema(
    {
      genre: { type: ObjectId, ref: "Genre" },
    },
    { timestamps: true }
  );

const artistSchema = new mongoose.Schema(
    {
        albums: [AlbumItemSchema],
        genres: [GenreItemSchema],
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Artist", artistSchema);