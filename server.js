const mongoose = require('mongoose');
const dotenv = require('dotenv');
// EP 123
// process.on('uncaughtException', (err) => {
//   console.log(err.name, err.message);
//   console.log('uncaughtExceptions shutdowbn....');
//   process.exit(1);
// });

dotenv.config({ path: './config.env' });
// لازم انك تعرفه قبل ال اب علشان يشتغل
const app = require('./app.js');
// console.log(app.get('env'));
// console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndesx: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connection successful ');
  });
//.catch((err) => console.log('ERROR ❤️'));

// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   price: 497,
// });
// testTour
//   .save()
//   .then(() => console.log('done'))
//   .catch((err) => console.log('ERRR🤯', err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`the app ${port} `);
});
// EP 122
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLEDREJECTION 🤯 Shuting Down.....');
  server.close(() => {
    process.exit(1);
  });
});
// npm i dotenv
// npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-ally eslint-plugin-react --save-dev
