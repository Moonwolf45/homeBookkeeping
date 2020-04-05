const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    category_id: {
        ref: 'categories',
        type: Schema.Types.ObjectId,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    user_id: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('events', eventSchema);
