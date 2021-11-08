import db from '../models/index'
import CURDservice from '../services/CRUDservice.js'

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll()
        return res.render('homepage.ejs', { data: JSON.stringify(data) })
    } catch (e) {
        console.log(e)
    }
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
    let message = await CURDservice.createNewUser(req.body)
    console.log(message)
    return res.send('post crud from server')
}

let displayGetCRUD = async (req, res) => {
    let data = await CURDservice.getAllUser()
    return res.render('displayCRUD.ejs', { data })
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id
    if (userId) {
        let userData = await CURDservice.getUserInfoById(userId)
        console.log(userData)
        return res.render('editCRUD.ejs', { user: userData })
    } else {
        return res.send('User not found')
    }
}

let putCRUD = async (req, res) => {
    let data = req.body
    let allUsers = await CURDservice.updateUserData(data)
    return res.render('displayCRUD.ejs', { data: allUsers })
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id
    if (id) {
        await CURDservice.deleteUserById(id)
        return res.send('delete user success')
    } else {
        return res.send('user not found')
    }
}

module.exports = { getHomePage, getCRUD, postCRUD, displayGetCRUD, getEditCRUD, putCRUD, deleteCRUD }
