const usersModel = require("../models/users");

const getUsers = ( limit = null, page = null ) => {
    try {
        limit = ( limit === null ) ? 10 : parseInt(limit);
        page = ( page === null ) ? 1 : parseInt(page);
        const users = usersModel.paginate({},{
            page: page,
            limit: limit,
        })
        .then((data)=>{
            return data;
        });
        return users;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getAllUsers = () => {
    try {
        const users = usersModel.find()
        .then((data)=>{
            return data;
        });
        return users;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const getUser = async ( user_id ) => {
    try {
        const user = await usersModel.findOne({
            _id: user_id
        })
        .then((data)=>{
            return data;
        });
        return user;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const createUser = async ( userData ) => {
    try {
        const createUser = await usersModel.create( userData )
        .then((data)=>{
            return data;
        } );
        return createUser;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const updateUser = async ( userData, userId ) => {
    try {
        const updateUser = await usersModel.updateOne( {
            _id: userId
        }, userData )
        .then((data)=>{
            return data;
        });
        return updateUser;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const deleteUser = async ( userId ) => {
    try {
        const deleteUser = await usersModel.deleteOne( {
            _id: userId
        } )
        .then((data)=>{
            return data;
        });
        return deleteUser;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports.getUsers = getUsers;
module.exports.getAllUsers = getAllUsers;
module.exports.getUser = getUser;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;