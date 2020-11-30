const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;


const albumSchema = new mongoose.Schema(
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
        song: {
            type: ObjectId,
            ref: "Song",
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Album", albumSchema);