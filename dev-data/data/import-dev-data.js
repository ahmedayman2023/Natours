// الملف ده علشان انقل كله الداتا من المف جوسن الى الداتا باس

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../model/tourmodel');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndesx: true,
  useFindAndModify: false,
});

// Read JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// Import Data into DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('imported');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// Delete Data into DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
