const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.post('/user', userController.createUser);
router.delete('/user/:id', userController.deleteUser);

module.exports = router;
