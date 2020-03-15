const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const financeCalendarSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        ref: 'categories',
        type: Schema.Types.ObjectId
    },
    type: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('financesCalendar', financeCalendarSchema);
