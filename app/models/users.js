const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const schema = mongoose.Schema;

const userSchema = new schema({
    first_name: String,
    last_name: String,
    email: String,
    phone_number: Number,
    age: Number,
    address: String,
    user_status: {
        type: Boolean,
        default: true
    },
    create_date: {
        type: Date,
        default: Date.now()
    }
});

userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model( 'users', userSchema );