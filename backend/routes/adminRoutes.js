// For each route file (categoryRoutes.js, orderRoutes.js, etc.)
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Route working' });
});

module.exports = router;
