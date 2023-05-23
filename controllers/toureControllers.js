const { query } = require('express');
const Tour = require('../model/tourmodel');
const APIFeatures = require('./../Utils/apiFeatures');
const catchAsync = require('./../Utils/catchAsync');
const AppError = require('./../Utils/appError');

// class APIFeatures {
//   constructor(query, queryStr) {
//     this.queryStr = queryStr;
//     this.query = query;
//   }
//   filter() {
//     // 1A) filtering:
//     const queryObj = { ...this.queryStr };
//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     excludedFields.forEach((el) => delete queryObj[el]);
//     // 1) Filtering
//     // const tours = await Tour.find({
//     //   duration: 5,
//     //   difficulty: 'easy',
//     // });
//     // const tours = await Tour.where('difficulty', 'easy');

//     // 1B) Advanced filtering:
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//     this.query.find(JSON.parse(queryStr));
//     // let this.query = Tour.find(JSON.parse(this.queryStr));
//     return this;
//   }
//   sort() {
//     if (this.queryStr.sort) {
//       const sortBy = this.queryStr.sort.split(',').join(' ');
//       console.log(sortBy);
//       this.query = this.query.sort(sortBy);
//     } else {
//       this.query = this.query.sort('--createdAt');
//     }
//     return this;
//   }
//   limitFields() {
//     if (this.queryStr.fields) {
//       const fields = this.queryStr.fields.split(',').join(' ');

//       this.query = this.query.select(fields);
//     } else {
//       this.query = this.query.select('-__v');
//     }
//     return this;
//   }
//   paginate() {
//     const page = this.queryStr.page * 1 || 1;
//     const limit = this.queryStr.limit * 1 || 100;
//     const skip = (page - 1) * limit;

//     this.query = this.query.skip(skip).limit(limit);
//     return this;
//   }
// }

exports.alliesTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage, price';
  req.query.fields = 'name,ratingAverage,price';
  next();
};
// const fs = require('fs');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkId = (req, res, next, val) => {
//   if (req.params.id > tours.length) {
//     return res.status(404).json({
//       status: 'not found',
//       message: 'please cheack of id',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   console.log(req.body);
//   // And  trur && false  => false
//   // Or  trur || false  => True
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status: 'you miss write body',
//     });
//   }
//   next();
// };

exports.getAllTours = catchAsync(async (req, res) => {
  // try {
  console.log(req.query);

  // BULID QUERY

  // // 1A) filtering:
  // const queryObj = { ...req.query };
  // const excludedFields = ['page', 'sort', 'limit', 'fields'];
  // excludedFields.forEach((el) => delete queryObj[el]);
  // // 1) Filtering
  // // const tours = await Tour.find({
  // //   duration: 5,
  // //   difficulty: 'easy',
  // // });
  // // const tours = await Tour.where('difficulty', 'easy');

  // // 1B) Advanced filtering:
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // let query = Tour.find(JSON.parse(queryStr));

  // 2) Sorting
  // if (req.query.sort) {
  //     const sortBy = req.query.sort.split(',').join(' ');
  //     console.log(sortBy);
  //     query = query.sort(sortBy);
  // } else {
  //     query = query.sort('--createdAt');
  // }

  // 3)Fields
  // if (req.query.fields) {
  //     const fields = req.query.fields.split(',').join(' ');

  //     query = query.select(fields);
  // } else {
  //     query = query.select('-__v');
  // }

  // 4) PAGE
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;

  // query = query.skip(skip).limit(limit);
  // if (req.query.page) {
  //     const numTours = await Tour.countDocuments();
  //     if (skip >= numTours) throw new Error('this page is not found');
  // }

  // EXECUTE QUERY
  const feature = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // انت مش عايز الكلاس كله
  const tours = await feature.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
  // } catch (err) {
  //     res.status(404).json({
  //         status: 'fail',
  //         message: err,
  //     });
  // }
});

// console.log(req.requsetTime);
//   res.status(200).json({
//     status: 'sucess',
//     // results: tours.length,
//     // timeRequse: req.requsetTime,
//     data: {
//       // tours: tours,
//     },
//   });
// };

exports.getTour = catchAsync(async (req, res) => {
  // try {

  const tour = await Tour.findById(req.params.id);

  // if (!tour) {
  //   return next(new AppError('this id not exist', 404));// my wrong is -----next---- not define
  // }
  if (!tour) {
    throw new AppError('There is no tour with this ID', 404);
  }
  res.status(200).json({
    status: 'succss',
    data: {
      tour,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     data: {
  //       message: err,
  //     },
  //   });
  // }
});
// Tour.findOne({_id:req.params.id})

// console.log(req.params);
// const id = req.params.id * 1;
// const tour = tours.find((el) => el.id === id);

// res.status(200).json({
//   status: 'sucess',
//   data: {
//     // tour,
//   },
// });

// exports.creatTour = async (req, res) => {
//   // const newTour = new Tour({})
//   // newTour.save().then()
//   try {
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//       status: 'sucess',
//       data: {
//         tour: newTour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fails',
//       message: err,
//     });
//   }
// };
// EP116
// const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch(next);
//   };
// };
exports.createTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { tour: newTour },
  });
});
//   console.log(req.body);
// const newId = tours[tours.length - 1].id + 1;
// const newArr = Object.assign({ id: newId }, req.body);
// tours.push(newArr);
// fs.writeFile(
// `/dev-data/data/tours-simple.json`,
// JSON.stringify(tours),
// (err) => {

exports.updateTour = catchAsync(async (req, res) => {
  // try {
  // db.natours.UpdateOne({price:500},{$set:{price:600}})
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    throw new AppError('There is no tour with this ID', 404);
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fails',
  //     data: {
  //       err: err,
  //     },
  //   });
  // }
});
// exports.deleteTour = async (req, res) => {
//   try {
//     const tour = await Tour.deletOne({ _id: req.params.id });
//     res.status(200).json({
//       status: 'success',
//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fails',
//       data: {
//         err: err,
//       },
//     });
//   }
// };

exports.deleteTour = catchAsync(async (req, res) => {
  // try {
  const tour = await Tour.findByIdAndDelete({ _id: req.params.id });
  if (!tour) {
    throw new AppError('There is no tour with this ID', 404);
  }
  res.status(204).json({
    status: 'success',
  });
  // } catch (err) {
  //     res.status(500).json({
  //         status: 'error',
  //         message: 'Unable to delete tour',
  //         error: err,
  //     });
  // }
});
exports.getTourStats = catchAsync(async (req, res) => {
  // try {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTour: { $sum: 1 },
        sumRat: { $sum: '$ratingAverage' },
        avgRat: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minRat: { $min: '$ratingAverage' },
        maxRat: { $max: '$ratingAverage' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fails',
  //     data: {
  //       err: err,
  //     },
  //   });
  // }
});
// EP 103 مهمة بصراحة علشان تحلل البيانات
exports.getMonthlyPlan = catchAsync(async (req, res) => {
  // try {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $match: {
        startDates: {
          // It converts the given string to a date object. Mongoose requires it in order to filter for dates.
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    { $unwind: '$startDates' },
    {
      $group: {
        _id: { $month: '$startDates' },
        numtostart: { $sum: 1 },
        tour: { $push: '$name' },
        datetour: { $push: '$startDates' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fails',
  //     data: {
  //       err: err,
  //     },
  //   });
  // }
});
