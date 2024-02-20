const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect('')
        console.log("DB connect")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB