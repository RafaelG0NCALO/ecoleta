const mongoose = require("mongoose");

async function connectToDB() {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Connected to database")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectToDB;