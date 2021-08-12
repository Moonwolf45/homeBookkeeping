const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
	color: {
        type: String,
        required: true
    },
    user_id: {
        ref: 'users',
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = mongoose.model('categories', categorySchema);
