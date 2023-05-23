const express = require('express');
const tourControllers = require('./../controllers/toureControllers');
const router = express.Router();
const authControllers = require('./../controllers/authControllers');
// router.param('id', tourControllers.checkId);

router
  .route('/top-5-cheap')
  .get(tourControllers.alliesTopTours, tourControllers.getAllTours);
router.route('/tour-stats').get(tourControllers.getTourStats);
router.route('/month-plan/:year').get(tourControllers.getMonthlyPlan);

router
  .route('/')
  .get(authControllers.protect, tourControllers.getAllTours)
  .post(tourControllers.createTour);
// .post(middleware, handle of post)
// .post(tourControllers.checkBody, tourControllers.creatTour);
router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'lead-guid'),
    tourControllers.deleteTour
  );

module.exports = router;
