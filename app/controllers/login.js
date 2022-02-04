const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const authService = require("../services/auth");
require('dotenv').config();
const { SEC_KEY, LOGOUT_TIME } = process.env;
//const bcrypt = require('bcrypt');

const loginPage = async (req, res, next) => {

    // to generate hash password
    // const salt = await bcrypt.genSalt(5);
    // let newpassword = await bcrypt.hash('admin', salt);
    // console.log(newpassword);

    res.render('login', {
        title: 'Login',
        bodyClass: 'bg-gradient-primary'
    });
}

const loginFormProcess = async (req, res, next) => {
    let responseObj = {
        title: 'Login',
        bodyClass: 'bg-gradient-primary',
        noticeData: []
    }    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.errors.forEach(error => {
            responseObj.noticeData.push({
                type: 'danger',
                message: error.msg
            });
        });
        
        res.render('login', responseObj);
        return;
    }

    const result = await authService.getAuth( req.body.user_name, req.body.password );

    responseObj.noticeData = [];

    if( !result ) {
        responseObj.noticeData.push({
            type: 'danger',
            message: 'Invalid login details'
        });
        res.render('login', responseObj);
        return;
    }

    req.session.expressLogin = result.id;

    const token = await jwt.sign({
        userId: result.id
    },
    SEC_KEY,
    {
        expiresIn: '1h'
    });

    res.cookie('expressLogin',token, { 
        maxAge: parseInt(LOGOUT_TIME) // would expire after 60 minutes
    });
    
    res.redirect("/");
    return;
}

module.exports.loginPage = loginPage;
module.exports.loginFormProcess = loginFormProcess;