const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// Get all users
// GET /users
const getAllUsers = asyncHandler(async (req, res) => {
    // Pobierz wszystkich użytkowników z bazy danych
    const users = await User.find().select('-password').lean()

    // Jeśli nie ma użytkowników
    if (!users?.length) {
        return res.status(400).json({ message: 'Nie znaleziono użytkowników.' })
    }

    res.json(users)
})

// Create new user
// POST /users
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles, name, surname, dateOfBirth, nationality, address, gender, phoneNumber, profilePicture } = req.body

    // Potwierdzenie danych
    if (!username || !password || !Array.isArray(roles) || !name || !surname || !dateOfBirth || !nationality
        || !address || !gender || !phoneNumber || !profilePicture ||  !roles.length) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane.' })
    }

    // Sprawdzanie czy nazwa użytkownika jest zduplikowana
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Zduplikowano nazwę użytkownika.' })
    }

    // Hashowanie hasła
    const hashedPwd = await bcrypt.hash(password, 10) // "Salt rounds"

    const userObject = { username, "password": hashedPwd, roles }

    // Tworzenie i przechowywanie nowego użytkownika
    const user = await User.create(userObject)

    if (user) { // Utworzono
        res.status(201).json({ message: `Nowy użytkownik o nazwie: ${username} został utworzony.` })
    } else {
        res.status(400).json({ message: 'Otrzymano nieprawidłowe dane o użytkowniku.' })
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password, name, surname, dateOfBirth, nationality, address, gender, phoneNumber, profilePicture } = req.body

    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean' || !name || !surname || !dateOfBirth || !nationality
    || !address || !gender || !phoneNumber || !profilePicture) {
        return res.status(400).json({ message: 'Wszystkie pola poza hasłem są wymagane.' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'Użytkownik nie został znaleziony.' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ username }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Zduplikowano nazwę użytkownika.' })
    }

    user.username = username
    user.roles = roles
    user.active = active
    user.name = name
    user.surname = surname
    user.dateOfBirth = dateOfBirth
    user.nationality = nationality
    user.address = address
    user.gender = gender
    user.phoneNumber = phoneNumber
    user.profilePicture = profilePicture

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `Użytkownik o nazwie: ${updatedUser.username} został zaktualizowany.` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Wymagane jest ID użytkownika.' })
    }

    // Does the user still have assigned notes?
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'Użytkownik ma przypisane zadania!' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'Użytkownik nie został znaleziony.' })
    }

    const result = await user.deleteOne()

    const reply = `Użytkownik: ${result.username} z ID ${result._id} został usunięty.`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}