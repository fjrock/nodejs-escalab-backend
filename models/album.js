const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const SongItemSchema = new mongoose.Schema(
    {
      song: { type: ObjectId, ref: "Song" },
    },
    { timestamps: true }
  );

const albumSchema = new mongoose.Schema(
    {
        songs: [SongItemSchema],
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 100,
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

module.exports = mongoose.model("Album", albumSchema);