const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/user', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.destroy({ where: { id: req.params.id } });
        res.status(204).end();
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
