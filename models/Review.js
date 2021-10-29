const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
    review: { type: String, required: true },
    rating: { type: Number,min:1,max:5 },
    createdAt: { type: Date, default: Date.now },
    tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour',required:true },
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } })



ReviewSchema.pre(/^find/, function (next) {
    
    this.populate({
        path: 'tour',
        select:'name'
    }).populate({
        path:'user',
        select:'name photo'
    })

    next()

})




const Review = mongoose.model('Review', ReviewSchema)

module.exports = Review