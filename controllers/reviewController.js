const Review = require('../models/Review')
const { deleteOne } = require("./handlerFactory")



exports.getAllReviews = async(req,res)=> {
    try {
        let filter = {}
        if(req.params.tourId)filter={tour:req.params.tourId}
        const reviews = await Review.find(filter)
        res.json({success:true,reviews})
    } catch (error) {
        res.json({success:false,message:error})
        console.error(error)
    }
}

exports.createReview =async (req,res) => {
    try {
        if (!req.body.tour) req.body.tour = req.params.tourId
        if(!req.body.user)req.body.user=req.user._id
        const review = await Review.create(req.body)
        res.json({
            success: true, data: {
            review
        }})
    }
    catch(e){
        console.log(e)
        res.json({success:false,message:e})
    }
}

exports.deleteReview=deleteOne(Review)