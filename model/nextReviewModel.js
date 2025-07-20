const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "A review must belong to a user"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        default: 2
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

const nextWayReview = mongoose.model('nextWayReview', reviewSchema);

module.exports = {
      nextWayReview,
      reviewSchema
}
