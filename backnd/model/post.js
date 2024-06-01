import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    photo: {
        type: String,
        required: true
    },
    comments: [{
        type: String,
        required: true,
    }],

    likes: {
        type: Number,
        default: 0,
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

export const postModel = mongoose.model('twitterData', postSchema);
