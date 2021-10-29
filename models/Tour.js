const mongoose = require("mongoose")
const slugify = require('slugify')

const tourSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: [true, 'A tour must have a name'], unique: true },
    slug:{type:String},
    ratingsAverage: { type: Number, default: 4.5 },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour must have a price'] },
    duration: { type: Number, required: [true, 'A tour must have a duration'] },
    maxGroupSize: {
        type: Number,
        required: [true, "Tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    priceDiscount: { type: Number },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        reuired:[true,'must have a image']
    },
    images: { type: [String] },
    createdAt: { type: Date, default: Date.now() },
    startDate: { type: [Date] },
    startLocation: {
        //GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum:['Point']
        },
        coordinates: [Number],
        address: String,
        description:String
    },
    locations: [{
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
            
            
        },
        coordinates: [Number],
        address: String,
        description: String,
        day:Number
    }],
    guides: [{ type: mongoose.Schema.Types.ObjectId,ref:'User'}]

}, { toJSON: { virtuals: true }, toObject: { virtuals: true }})

tourSchema.virtual('durationinfo').get(function () {
    return this.duration/7  
})

//Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField:'_id'
    
})

//Document middle ware:runs before save command and create command
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: "guides",
        select: '-__v -passwordChangedAt'
    })
    next()
})
    

// tourSchema.pre('save',async function (next) {
//     const guidesPromises = this.guides.map(async (id) => await User.findById(id))
//     this.guides = await Promise.all(guidesPromises)
//     next()
// })




const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour