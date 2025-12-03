const express = require('express');
const StockScenario = require('../models/StockScenario');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get random scenario for matchmaking
router.get('/random', authMiddleware, async (req, res, next) => {
  try {
    const count = await StockScenario.countDocuments();
    const random = Math.floor(Math.random() * count);
    const scenario = await StockScenario.findOne().skip(random);

    if (!scenario) {
      return res.status(404).json({ message: 'No scenarios available' });
    }

    // Increment usage count
    scenario.timesUsed += 1;
    await scenario.save();

    res.json(scenario);
  } catch (error) {
    next(error);
  }
});

// Get all scenarios
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const scenarios = await StockScenario.find().limit(50);
    res.json(scenarios);
  } catch (error) {
    next(error);
  }
});

// Get scenario by ID
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const scenario = await StockScenario.findById(req.params.id);

    if (!scenario) {
      return res.status(404).json({ message: 'Scenario not found' });
    }

    res.json(scenario);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
