const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const carSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        brand: {
            type: String,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        productionYear: {
            type: Number,
            required: true
        },
        vehicleMileage: {
            type: String,
            required: true
        },
        fuelType: {
            type: String,
            required: true
        },
        gearboxType: {
            type: String,
            required: true
        },
        numOfPassengers: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        hp: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        images: [
            {
                type: String,
                required: true
            }
        ],
        completed: {
            type: Boolean,
            default: false
        },
        carCategory: [
            {
                type: String,
                required: true
            }
        ],
    },
    {
        timestamps: true
    }
)

carSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'carTicketNums',
    start_seq: 1
})

module.exports = mongoose.model('Car', carSchema)