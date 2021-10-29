const express = require('express')
const morgan = require('morgan')
const rateLimit = require("express-rate-limit")
const helmet = require('helmet')
const mongosanitize = require("express-mongo-sanitize")
const xss = require('xss-clean')
const hpp=require('hpp')
const tourRouter = require("./routes/tourroutes")
const userRouter = require("./routes/userroutes")
const ReviewRouter=require("./routes/reviewRoutes")
const AppError = require("./utils/AppError")
const globalErrorHandler = require("./controllers/errorController")


const app = express()
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}
app.use(helmet())
const limiter = rateLimit({
    max: 1000,
    windowMs: 30 * 60 * 1000,
    message:'Too many request from this ip please try again , in an hour'
})
//Data sanitization againaist Nosql query injection
app.use(mongosanitize());
//Data sanitization againaist xss
app.use(xss())
//prevent parameter pollution
app.use(hpp({
    whitelist: ['duration']
}))
app.use('/api',limiter);
app.use(express.json({limit:'10kb'}))
app.use(express.static(`${__dirname}/public`))

//Routes
app.use(`/api/v1/tours`, tourRouter)
app.use(`/api/v1/users`, userRouter)
app.use(`/api/v1/reviews`,ReviewRouter)

    app.all('*', (req, res,next) => {
       
        next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
    })

app.use(globalErrorHandler)

module.exports = app


   // "eslint": "^8.0.1",
    // "eslint-config-airbnb": "^18.2.1",
    // "eslint-config-prettier": "^8.3.0",
    // "eslint-plugin-import": "^2.25.2",
    // "eslint-plugin-jsx-a11y": "^6.4.1",
    // "eslint-plugin-node": "^11.1.0",
    // "eslint-plugin-prettier": "^4.0.0",
    // "eslint-plugin-react": "^7.26.1",
    // "prettier": "^2.4.1"