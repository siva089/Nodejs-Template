const Tour = require("../models/Tour")
const ApiFeautures=require("../utils/Apifeatures")
const { deleteOne} = require("./handlerFactory")

const catchAsync = fn => (req,res,next) => {
        fn(req, res, next).catch(next)
    }
 
exports.addTour =catchAsync(async (req, res) => {
    try {
        const newTour = await Tour.create(req.body)
        res.status(201).json({ success: true, data: { tour: newTour } })

    } catch (error) {
        res.status(400).json({ success: false })
    }
})

exports.getAllTours = async (req, res,next) => {
    try {

        const features = new ApiFeautures(Tour.find(), req.query).filter().sort().paginate().limiting()
       
        const tours = await features.query;
        res.status(200).json({ status: 'success', results: tours.length, data: { tours } })
    } catch (error) {
        console.log(error)
    }

}

exports.getTour = async (req, res) => {

    try {
        const { id } = req.params
        const tour = await Tour.findById(id).populate('reviews')

        res.status(200).json({ "status": 'success', data: { tours: tour } })

    } catch (error) {
        res.status(404).json({ success: false })
    }


}



exports.updateTour = async (req, res) => {

    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json({
            "status": "success", data: {
                tour: tour
            }
        })

    } catch (error) {
        res.status(403).json({
            "status": "error"
        })
    }

}

exports.deleteTour =deleteOne(Tour)



