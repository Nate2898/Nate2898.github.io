const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        note: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId, //gets unique id from the user id in mongoDB objectID
            ref: 'User',
            required: true
        },
        date: {
            type: String,
            set: (v) => new Date(v).toISOString().slice(0,10),
            default: () => new Date().toISOString().slice(0,10)
        }
    },
    {
        timestamps: true,
        versionKey: 'version'
    }
);

module.exports = mongoose.model('Note', noteSchema);
