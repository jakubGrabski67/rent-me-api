const express = require('express');
const router = express.Router();
const carsController = require('../controllers/carsController');
const verifyJWT = require('../middleware/verifyJWT');

// Wyłącz weryfikację JWT tylko dla endpointu GET
router.get('/', carsController.getAllCars);

// Pozostałe endpointy wciąż będą korzystać z verifyJWT
router.use(verifyJWT);

router.post('/', carsController.createNewCar);
router.patch('/', carsController.updateCar);
router.delete('/', carsController.deleteCar);

module.exports = router;
