const {Schema, model} = require('mongoose')
// const bcrypt = require('bcrypt')

const Auth = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true
    },
    hash_pass: {
        type: String
    },
    token:{
        type:String
    }

})

// Auth.methods.comparePassword = async (password) => {
//     return await  bcrypt.compareSync(password, this.hash_pass)
// }

module.exports = model('Auth', Auth)