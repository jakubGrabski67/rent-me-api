const Reservation = require("../models/Reservation");
const asyncHandler = require("express-async-handler");

// @desc Get all reservations
// @route GET /reservations
// @access Private
const getAllReservations = asyncHandler(async (req, res) => {
  // Pobierz wszystkie rezerwacje z MongoDB
  const reservations = await Reservation.find().lean();

  // Jeśli nie ma rezerwacji
  if (!reservations?.length) {
    return res.status(400).json({ message: "No reservations found" });
  }

  res.json(reservations);
});

// @desc Create new reservation
// @route POST /reservation
// @access Private
const createNewReservation = asyncHandler(async (req, res) => {
  const {  car,
    startDate,
    endDate,
    protectionPackage,
    selectedOptions,
    selectedPaymentOption,
    firstName,
    lastName,
    country,
    city,
    street,
    houseNumber,
    postalCode,
    driverLicenseNumber,
    email,
    phoneNumber,
    promoCode,
    reservationStatus,
    totalRentalPrice} = req.body

  // Confirm data
  if (!car || !startDate || !endDate || !protectionPackage || !selectedOptions || !selectedPaymentOption || !firstName || !lastName || !country || !city
     || !street || !houseNumber || !postalCode || !driverLicenseNumber || !email || !phoneNumber || !promoCode || !reservationStatus || !totalRentalPrice) {
      return res.status(400).json({ message: 'Wszystkie pola są wymagane!' })
  }

  // Create and store the new reservation
  const reservation = await Reservation.create({ 
    car,
    startDate,
    endDate,
    protectionPackage,
    selectedOptions,
    selectedPaymentOption,
    firstName,
    lastName,
    country,
    city,
    street,
    houseNumber,
    postalCode,
    driverLicenseNumber,
    email,
    phoneNumber,
    promoCode,
    reservationStatus,
    totalRentalPrice })

  if (reservation) { // Created 
      return res.status(201).json({ message: 'Pomyślnie dodano nową rezerwację!' })
  } else {
      return res.status(400).json({ message: 'Otrzymano nieprawidłowe dane!' })
  }

})

// @desc Update a reservation
// @route PATCH /reservations
// @access Private
const updateReservation = asyncHandler(async (req, res) => {
  const {
    id,
    // user,
    car,
    startDate,
    endDate,
    protectionPackage,
    selectedOptions,
    selectedPaymentOption,
    firstName,
    lastName,
    country,
    city,
    street,
    houseNumber,
    postalCode,
    driverLicenseNumber,
    email,
    phoneNumber,
    promoCode,
    reservationStatus,
    totalRentalPrice
  } = req.body;

  // Potwierdź dane
  if (
    !id ||
    // !user ||
    !car ||
    !startDate ||
    !endDate ||
    !protectionPackage ||
    !Array.isArray(selectedOptions) ||
    !selectedOptions.length ||
    !selectedPaymentOption ||
    !firstName ||
    !lastName ||
    !country ||
    !city ||
    !street ||
    !houseNumber ||
    !postalCode ||
    !driverLicenseNumber ||
    !email ||
    !phoneNumber ||
    !reservationStatus ||
    !totalRentalPrice
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Sprawdź, czy rezerwacja istnieje
  const reservation = await Reservation.findById(id).exec();

  if (!reservation) {
    return res.status(400).json({ message: "Reservation not found" });
  }

  // Zaktualizuj dane rezerwacji
  // reservation.user = user;
  reservation.car = car;
  reservation.startDate = startDate;
  reservation.endDate = endDate;
  reservation.protectionPackage = protectionPackage;
  reservation.selectedOptions = selectedOptions;
  reservation.selectedPaymentOption = selectedPaymentOption;
  reservation.firstName = firstName;
  reservation.lastName = lastName;
  reservation.country = country;
  reservation.city = city;
  reservation.street = street;
  reservation.houseNumber = houseNumber;
  reservation.postalCode = postalCode;
  reservation.driverLicenseNumber = driverLicenseNumber;
  reservation.email = email;
  reservation.phoneNumber = phoneNumber;
  reservation.promoCode = promoCode;
  reservation.reservationStatus = reservationStatus;
  reservation.totalRentalPrice = totalRentalPrice;

  const updatedReservation = await reservation.save()

  res.json(`Rezerwacja z ID: '${updatedReservation._id}' została zaktualizowana.`)
});

// @desc Delete a car
// @route DELETE /cars
// @access Private
const deleteReservation = asyncHandler(async (req, res) => {
  const { id } = req.body

  // Confirm data
  if (!id) {
      return res.status(400).json({ message: 'Wymagane ID pojazdu.' })
  }

  // Confirm car exists to delete 
  const reservation = await Reservation.findById(id).exec()

  if (!reservation) {
      return res.status(400).json({ message: 'Nie znaleziono pojazdu.' })
  }

  const result = await reservation.deleteOne()

  const reply = `Rezerwacja z ID ${result._id} został usunięty.`

  res.json(reply)
})

module.exports = {
  getAllReservations,
  createNewReservation,
  updateReservation,
  deleteReservation,
};








// const Reservation = require('../models/Reservation')
// const User = require('../models/User')
// const asyncHandler = require('express-async-handler')

// // @desc Get all cars 
// // @route GET /cars
// // @access Private
// const getAllReservations = asyncHandler(async (req, res) => {
//     // Get all cars from MongoDB
//     const reservations = await Reservation.find().lean()
    

//     // If no cars 
//     if (!reservations?.length) {
//         return res.status(400).json({ message: 'Nie znaleziono pojazdów.' })
//     }

//     // Add username to each car before sending the response 
//     // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
//     // You could also do this with a for...of loop



//     // const reservationsWithUser = await Promise.all(reservations.map(async (reservation) => {
      
//     //     const user = await User.findById(reservation.user).lean().exec()
        
//     //     return { ...reservation, username: user.username }
        
//     // }))
//     // res.json(reservationsWithUser)



//     //console.log(cars);
// })

// // @desc Create new car
// // @route POST /cars
// // @access Private
// const createNewReservation = asyncHandler(async (req, res) => {
//     const {car, startDate, endDate, protectionPackage, selectedOptions, selectedPaymentOption, firstName, lastName, country, city, street, houseNumber,
//       postalCode, driverLicenseNumber, email, phoneNumber, promoCode} = req.body

//     // Confirm data
//     if (!car || !startDate || !endDate || !protectionPackage || !selectedOptions || 
//       !selectedPaymentOption || !firstName || !lastName || !country || !city || !street || 
//       !houseNumber || !postalCode || !driverLicenseNumber || !email || !phoneNumber || !promoCode) {
//         return res.status(400).json({ message: 'Wszystkie pola są wymagane!' })
//     }

//     // Check for duplicate brand
//     // const duplicate = await Car.findOne({ brand }).lean().exec()

//     // if (duplicate) {
//     //     return res.status(409).json({ message: 'Duplicate car brand' })
//     // }

//     // Create and store the new user 
//     const reservation = await Reservation.create({car, startDate, endDate, protectionPackage, selectedOptions, selectedPaymentOption, firstName, lastName, country, city, street, houseNumber,
//       postalCode, driverLicenseNumber, email, phoneNumber, promoCode})

//     if (reservation) { // Created 
//         return res.status(201).json({ message: 'Pomyślnie dodano nowy pojazd!' })
//     } else {
//         return res.status(400).json({ message: 'Otrzymano nieprawidłowe dane!' })
//     }

// })

// // @desc Update a car
// // @route PATCH /cars
// // @access Private
// const updateReservation = asyncHandler(async (req, res) => {
//     const { car, startDate, endDate, protectionPackage, selectedOptions, selectedPaymentOption, firstName, lastName, country, city, street, houseNumber,
//       postalCode, driverLicenseNumber, email, phoneNumber, promoCode } = req.body

//     // Confirm data
//     if ( !car || !startDate || !endDate || !protectionPackage || !selectedOptions || 
//       !selectedPaymentOption || !firstName || !lastName || !country || !city || !street || 
//       !houseNumber || !postalCode || !driverLicenseNumber || !email || !phoneNumber || !promoCode) {
//         return res.status(400).json({ message: 'Wszystkie pola są wymagane!' })
//     }

//     // Confirm car exists to update
//     const reservation = await Reservation.findById(id).exec()

//     if (!reservation) {
//         return res.status(400).json({ message: 'Nie znaleziono pojazdu.' })
//     }

//     // Check for duplicate brand
//     //const duplicate = await Car.findOne({ brand }).lean().exec()

//     // Allow renaming of the original car 
//     // if (duplicate && duplicate?._id.toString() !== id) {
//     //     return res.status(409).json({ message: 'Duplicate car brand' })
//     // }

//     reservation.car = car;
//   reservation.startDate = startDate;
//   reservation.endDate = endDate;
//   reservation.protectionPackage = protectionPackage;
//   reservation.selectedOptions = selectedOptions;
//   reservation.selectedPaymentOption = selectedPaymentOption;
//   reservation.firstName = firstName;
//   reservation.lastName = lastName;
//   reservation.country = country;
//   reservation.city = city;
//   reservation.street = street;
//   reservation.houseNumber = houseNumber;
//   reservation.postalCode = postalCode;
//   reservation.driverLicenseNumber = driverLicenseNumber;
//   reservation.email = email;
//   reservation.phoneNumber = phoneNumber;
//   reservation.promoCode = promoCode;

//     const updatedReservation = await reservation.save()

//     res.json(`'${updatedReservation.id}' został zaktualizowany.`)
// })

// // @desc Delete a car
// // @route DELETE /cars
// // @access Private
// const deleteReservation = asyncHandler(async (req, res) => {
//     const { id } = req.body

//     // Confirm data
//     if (!id) {
//         return res.status(400).json({ message: 'Wymagane ID pojazdu.' })
//     }

//     // Confirm car exists to delete 
//     const reservation = await Reservation.findById(id).exec()

//     if (!reservation) {
//         return res.status(400).json({ message: 'Nie znaleziono pojazdu.' })
//     }

//     const result = await reservation.deleteOne()

//     const reply = `Rezerwacja z ID ${result._id} została usunięta.`

//     res.json(reply)
// })

// module.exports = {
//     getAllReservations,
//     createNewReservation,
//     updateReservation,
//     deleteReservation
// }