const mongoose = require('mongoose'); 

const AccommodationSchema = mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, 
    title: String,
    location: String,
    photos: [String],
    description: String,
    perks: [String],
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number 
})

const AccommodationModel = mongoose.model('Accommodation', AccommodationSchema);

module.exports = AccommodationModel; 