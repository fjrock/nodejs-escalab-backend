const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const artistSchema = new mongoose.Schema(
    {
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
        },
        album: {
            type: ObjectId,
            ref: "Album",
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Artist", artistSchema);