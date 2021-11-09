import userService from '../services/userService'

let handleLogin = async (req, res) => {
    let { email, password } = req.body

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }

    let userData = await userService.handleUserLogin(email, password)
    let { errCode, errMessage: message } = userData

    return res.status(200).json({
        errCode,
        message,
        user: userData.user ? userData : {}
    })
}

module.exports = {
    handleLogin
}
