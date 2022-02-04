const authModel = require("../models/auth");
const bcrypt = require('bcrypt');

const getAuth = async ( username, password ) => {
    try {
        const result = await authModel.findOne({
            username: username
        }).then( async (data) => {
            const validPassword = await bcrypt.compare(password, data.password);
            return (validPassword) ? data : false;
        })
        return result;
    } catch (error) {
        console.log(error);
        return false
    }
}

module.exports.getAuth = getAuth;