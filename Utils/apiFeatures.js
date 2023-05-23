class APIFeatures {
  constructor(query, queryStr) {
    this.queryStr = queryStr;
    this.query = query;
  }

  filter() {
    // 1A) filtering:
    const queryObj = { ...this.queryStr };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // 1B) Advanced filtering:
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query.find(JSON.parse(queryStr));
    // let this.query = Tour.find(JSON.parse(this.queryStr));
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('--createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
// -----------------------------------------------------
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
module.exports = APIFeatures;
