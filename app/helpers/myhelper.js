const jwt = require('jsonwebtoken');
require('dotenv').config();
const { SEC_KEY } = process.env;

const getLoginUserId = async ( req ) => {
    if(req.session.expressLogin) {
        return req.session.expressLogin
    }

    if( !req.cookies.expressLogin ) {
        return false;
    }

    const token = req.cookies.expressLogin;
    try {
        const tokenData = await jwt.verify(token, SEC_KEY);
        if( !tokenData.userId ) {
            return false;
        }
        return tokenData.userId;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports.getLoginUserId = getLoginUserId