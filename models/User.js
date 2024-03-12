const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
    name: {
        type: String,
        
    },
    surname: {
        type: String,
        
    },
    dateOfBirth: {
        type: String,
   
    },
    nationality: {
        type: String,
        
    },
    address: {
        type: String,
       
    },
    gender: {
        type: String,
        
    },
    phoneNumber: {
        type: String,
        
    },
    profilePicture: 
        {
            type: String,
            
        }
    ,
    active: {
        type: Boolean,
        default: true
    },
    roles: [{
        type: String,
        default: "Employee"
    }],
})

module.exports = mongoose.model('User', userSchema)