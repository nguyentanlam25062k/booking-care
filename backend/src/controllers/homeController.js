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
    res.send('post crud from server')
}

let displayGetCRUD = async (req, res) => {
    let data = await CURDservice.getAllUser()
    return res.render('displayCRUD.ejs', { data })
}

module.exports = { getHomePage, getCRUD, postCRUD, displayGetCRUD }
