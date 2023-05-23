const express = require('express');
const userControllers = require('./../controllers/userControllers');
const router = express.Router();
const authControllers = require('../controllers/authControllers');
router.param('id', (req, res, next, val) => {
  console.log(`the id ${val}`);
  next();
});
router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);
router
  .route('/')
  .get(userControllers.getAllUsers)
  .post(userControllers.createUser);
router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

module.exports = router;
