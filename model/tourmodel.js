const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'the tour must have name '],
      unique: true,
      trim: true,
      maxlength: [40, 'the name must be less than 40'],
      minlength: [10, 'the name must be more than 10'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must has duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a group size'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'error just easy medium difficult ',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'error less 5'],
      min: [1, 'error more 1'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'the tour must have price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // validator.fucntion(val){} What's that I can't understand
          //   this only points to current doc on New document creation
          return val < this.price;
        },
        message: 'sorry but discount price less than price',
      },
      //   message: 'sorry but discount price less than price', false you should put inside the validate to work
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    image: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//  type 1 : DOCUMENT Middelware EP 105: is a feature in the Mongoose library for Node.js that allows you to define hooks that execute before or after certain events occur on a document, such as when a document is saved or deleted
// you can just use save,create  that's it
//  if you use slug you should define this in Schema to work (to install slug write  npm i slugify)
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// // tourSchema.pre('save', function (next) {
// //   console.log('Will save document....');
// //   next();
// // });

// // tourSchema.post('save', function (doc, next) {
// //   console.log(doc);
// //   next();
// // });
// // --------------------------------------------------------------------
// //  type 2 : Query    Middelware EP 106
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  // this.find(this.secretTour: { $ne: true }) False don't do that again
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  //   console.log(doc);

  next();
});

// // -----------------------------------------------------------------------
//  type 3 : Aggregate Middelware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // write pipeline correct & unshift to add this in begin
  // console.log(this.pipeline()); // write pipeline correct
  next();
});

// -------------------------------------------------------------------------
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
