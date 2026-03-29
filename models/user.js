const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        hashed_password: {
            type: String,
            required: true
        },
        about: {
            type: String,
            trim: true
        },
        role: {
            type : Array ,
            default : [0]
        },
        history: {
            type: Array,
            default: []
        }
    },
    { timestamps: true }
);

// virtual field
userSchema
    .virtual("password")
    .set(function(password) {
        this._password = password;
        this.hashed_password = bcrypt.hashSync(password, SALT_ROUNDS);
    })
    .get(function() {
        return this._password;
    });

// schemas methods
userSchema.methods = {
    authenticate: function(plainText) {
        return bcrypt.compareSync(plainText, this.hashed_password);
    }
};

module.exports = mongoose.model("User", userSchema);
