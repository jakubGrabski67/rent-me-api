const Car = require('../models/Car')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// @desc Get all cars 
// @route GET /cars
// @access Private
const getAllCars = asyncHandler(async (req, res) => {
    // Get all cars from MongoDB
    const cars = await Car.find().lean()
    

    // If no cars 
    if (!cars?.length) {
        return res.status(400).json({ message: 'Nie znaleziono pojazdów.' })
    }


    const carsWithUser = await Promise.all(cars.map(async (car) => {
      
        const user = await User.findById(car.user).lean().exec()
        
        return { ...car, username: user.username }
        
    }))
    res.json(carsWithUser)
    //console.log(cars);
})

// @desc Create new car
// @route POST /cars
// @access Private
const createNewCar = asyncHandler(async (req, res) => {
    const { user, brand, model, type, productionYear, vehicleMileage, fuelType, gearboxType, numOfPassengers, price, hp, description, images, carCategory } = req.body

    // Confirm data
    if (!user || !brand || !model || !type || !productionYear || !vehicleMileage || !fuelType || !gearboxType || !numOfPassengers || !price || !hp || !description || !images || !carCategory) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane!' })
    }

    // Check for duplicate brand
    // const duplicate = await Car.findOne({ brand }).lean().exec()

    // if (duplicate) {
    //     return res.status(409).json({ message: 'Duplicate car brand' })
    // }

    // Create and store the new user 
    const car = await Car.create({ user, brand, model, type, productionYear, vehicleMileage, fuelType, gearboxType, numOfPassengers, price, hp, description, images, carCategory })

    if (car) { // Created 
        return res.status(201).json({ message: 'Pomyślnie dodano nowy pojazd!' })
    } else {
        return res.status(400).json({ message: 'Otrzymano nieprawidłowe dane!' })
    }

})

// @desc Update a car
// @route PATCH /cars
// @access Private
const updateCar = asyncHandler(async (req, res) => {
    const { id, user, brand, model, type, productionYear, vehicleMileage, fuelType, gearboxType, numOfPassengers, price, hp, description, images, completed, carCategory } = req.body

    // Confirm data
    if (!id || !user || !brand || !model || !type || !productionYear || !vehicleMileage || !fuelType || !gearboxType
        || !numOfPassengers || !price || !hp || !description || !images || typeof completed !== 'boolean' || !carCategory) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane!' })
    }

    // Confirm car exists to update
    const car = await Car.findById(id).exec()

    if (!car) {
        return res.status(400).json({ message: 'Nie znaleziono pojazdu.' })
    }

    // Check for duplicate brand
    //const duplicate = await Car.findOne({ brand }).lean().exec()

    // Allow renaming of the original car 
    // if (duplicate && duplicate?._id.toString() !== id) {
    //     return res.status(409).json({ message: 'Duplicate car brand' })
    // }

    car.user = user
    car.brand = brand
    car.model = model
    car.type = type
    car.productionYear = productionYear
    car.vehicleMileage = vehicleMileage
    car.fuelType = fuelType
    car.gearboxType = gearboxType
    car.numOfPassengers = numOfPassengers
    car.price = price
    car.hp = hp
    car.description = description
    car.images = images
    car.completed = completed
    car.carCategory = carCategory

    const updatedCar = await car.save()

    res.json(`'${updatedCar.brand}' został zaktualizowany.`)
})

// @desc Delete a car
// @route DELETE /cars
// @access Private
const deleteCar = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Wymagane ID pojazdu.' })
    }

    // Confirm car exists to delete 
    const car = await Car.findById(id).exec()

    if (!car) {
        return res.status(400).json({ message: 'Nie znaleziono pojazdu.' })
    }

    const result = await car.deleteOne()

    const reply = `Pojazd '${result.brand}' z ID ${result._id} został usunięty.`

    res.json(reply)
})

module.exports = {
    getAllCars,
    createNewCar,
    updateCar,
    deleteCar
}