
const express = require("express")
const { getAllTours, getTour, updateTour, deleteTour, addTour} = require("../controllers/tourController")
const { protect, restrictTo } = require("../controllers/authController")
const reviewRouter = require("./reviewRoutes")

const router = express.Router()


router.use(`/:tourId/reviews`,reviewRouter)

router.route(`/`).get(getAllTours).post(protect,restrictTo('admin','lead-guide'),addTour)
router.route(`/:id`).get(protect, getTour).patch(protect, restrictTo('admin', 'lead-guide'),updateTour).delete(protect,restrictTo('admin','lead-guide'),deleteTour)


module.exports = router