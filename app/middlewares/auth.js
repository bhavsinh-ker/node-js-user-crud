const myHelper = require("../helpers/myhelper");

const auth = async (req, res, next) => {
    const userId = await myHelper.getLoginUserId(req);
    if( !userId ) {
        res.redirect("/login");
        return;
    }
    req.session.expressLogin = userId;
    next();
}

module.exports.auth = auth;