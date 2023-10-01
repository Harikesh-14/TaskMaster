const mongoose = require('mongoose')

const loginDetailSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    emailID: {
        type: String,
        isEmail: true,
        isUnique: true,
    },
    password: {
        type: String,
    }
})

const loginDetail = new mongoose.model("logindetails", loginDetailSchema)

module.exports = loginDetail