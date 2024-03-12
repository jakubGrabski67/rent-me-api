const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const verifyJWT = require('../middleware/verifyJWT');

// Wyłącz weryfikację JWT tylko dla endpointu POST
router.post('/', reservationController.createNewReservation);

// Pozostałe endpointy wciąż będą korzystać z verifyJWT
router.use(verifyJWT);

router.get('/', reservationController.getAllReservations);
router.patch('/', reservationController.updateReservation);
router.delete('/', reservationController.deleteReservation);

module.exports = router;