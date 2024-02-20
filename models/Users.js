const mongoose = require('mongoose');
const Schema = mongoose.Schema
const UserActivity = new Schema({
    user: String,
    content: String,
})
const Users = mongoose.model('Activity',UserActivity)
module.exports = Users