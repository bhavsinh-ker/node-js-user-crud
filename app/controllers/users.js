const { validationResult } = require('express-validator');
const userServices = require("../services/users");

const userList = async (req, res, next) => {
    const limit = 10;
    const page = (req.query.paged) ? req.query.paged : 1;
    const users = await userServices.getUsers( limit, page );
    let responseObj = {
        title: 'Users',
        userActiveMenu: true,
        userData: (users.docs.length > 0) ? users.docs : false,
        paginationData: {
            hasPagination: (users.totalPages > 1) ? true : false,
            totalPages: users.totalPages,
            currentPage: users.page,
            nextPage: (users.hasNextPage) ? users.nextPage : false,
            prevPage: (users.hasPrevPage) ? users.prevPage : false
        },
        noticeData: []
    }

    if( req.query.status && req.query.action ) {
        if(req.query.action=="update-status") {
            responseObj.noticeData.push({
                type: (req.query.status=="1") ? "success" : "danger",
                message: (req.query.status=="1") ? "User status updated successfully" : "Something is wrong! please try again."
            });
        } else if(req.query.action=="edituser") {
            responseObj.noticeData.push({
                type: (req.query.status=="1") ? "success" : "danger",
                message: (req.query.status=="1") ? "User updated successfully" : "Something is wrong! please try again."
            });
        } else if(req.query.action=="deleteuser") {
            responseObj.noticeData.push({
                type: (req.query.status=="1") ? "success" : "danger",
                message: (req.query.status=="1") ? "User deleted successfully" : "Something is wrong! please try again."
            });
        }
    }

    
    res.render('users', responseObj);
}

const userAdd = (req, res, next) => {
    res.render('user-add-edit', {
        title: 'Add User',
        userActiveMenu: true,
        formAction: "add"
    });
}

const userAddFormProcess = async (req, res, next) => {

    let responseObj = {
        title: 'Add User',
        formData: req.body,
        userActiveMenu: true,
        noticeData: [],
        formAction: "add"
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.errors.forEach(error => {
            responseObj.noticeData.push({
                type: 'danger',
                message: error.msg
            });
        });
        res.render( 'user-add-edit', responseObj);
        return;
    }

    const createdUser = await userServices.createUser(req.body);
    
    if( !createdUser ) {
        responseObj.noticeData = [];
        responseObj.noticeData.push({
            type: 'danger',
            message: 'User is not created! please try again.'
        });
        res.render( 'user-add-edit', responseObj);
        return;
    }
    
    res.redirect("/users/edit?id=" + createdUser.id +"&status=1&action=adduser");
    return;
}

const userEdit = async (req, res, next) => {

    if( !req.query.id || req.query.id == "" ) {
        res.redirect("/users?status=0&action=edituser");
        return;
    }

    const user = await userServices.getUser(req.query.id);
    
    if( !user ) {
        res.redirect("/users?status=0&action=edituser");
        return;
    }

    let responseObj = {
        title: 'Edit User',
        formData: user,
        userActiveMenu: true,
        noticeData: [],
        formAction: "edit?id="+req.query.id
    }

    if( req.query.status && req.query.action ) {
        if(req.query.action=="adduser") {
            responseObj.noticeData.push({
                type: (req.query.status=="1") ? "success" : "danger",
                message: (req.query.action=="adduser") ? "User inserted successfully" : "Something is wrong! please try again."
            });
        } else if(req.query.action=="edituser") {
            responseObj.noticeData.push({
                type: (req.query.status=="1") ? "success" : "danger",
                message: (req.query.status=="1") ? "User updated successfully" : "Something is wrong! please try again."
            });
        }
    }
    
    res.render('user-add-edit', responseObj);
}

const userEditFormProcess = async (req, res, next) => {

    if( !req.query.id || req.query.id == "" ) {
        res.redirect("/users?status=0&action=edituser");
        return;
    }

    let responseObj = {
        title: 'Edit User',
        formData: req.body,
        userActiveMenu: true,
        noticeData: [],
        formAction: "edit?id="+req.query.id
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.errors.forEach(error => {
            responseObj.noticeData.push({
                type: 'danger',
                message: error.msg
            });
        });
        res.render( 'user-add-edit', responseObj);
        return;
    }

    const updatedUser = await userServices.updateUser( req.body, req.query.id );

    if( !updatedUser.modifiedCount ) {
        responseObj.noticeData = [];
        responseObj.noticeData.push({
            type: 'danger',
            message: 'User is not updated! please try again.'
        });
        res.render( 'user-add-edit', responseObj);
        return;
    }

    res.redirect("/users/edit?id=" + req.query.id +"&status=1&action=edituser");
    return;
}

const userDelete = async (req, res, next) => {

    if( !req.query.id || req.query.id == "" ) {
        res.redirect("/users?status=0&action=deleteuser");
        return;
    }

    const deleteUser = await userServices.deleteUser( req.query.id );

    if( !deleteUser.deletedCount || deleteUser.deletedCount<=0 ) {
        res.redirect("/users?status=0&action=deleteuser");
        return;
    }

    res.redirect("/users?status=1&action=deleteuser");
    return;
}

const userSpdateStatus = async (req, res, next) => {

    let url = "/users";

    if( !req.query.id || req.query.id == "" || !req.query.status || req.query.status == "" ) {
        url+= "?status=0&action=update-status";
        url+= (req.query.paged) ? "&paged="+req.query.paged : "";
        res.redirect(url);
        return;
    }

    const userStatusUpdate = await userServices.updateUser({
        user_status: (req.query.status=="true") ? false : true
    }, req.query.id);

    if( !userStatusUpdate.modifiedCount ) {
        url+= "?status=0&action=update-status";
        url+= (req.query.paged) ? "&paged="+req.query.paged : "";
        res.redirect(url);
        return;
    }

    url+= "?status=1&action=update-status";
    url+= (req.query.paged) ? "&paged="+req.query.paged : "";
    res.redirect(url);
    return;
}

module.exports.list = userList;
module.exports.add = userAdd;
module.exports.addForm = userAddFormProcess;
module.exports.edit = userEdit;
module.exports.editForm = userEditFormProcess;
module.exports.delete = userDelete;
module.exports.updateStatus = userSpdateStatus;