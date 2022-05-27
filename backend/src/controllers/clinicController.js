import clinicService from '../services/clinicService'

let createClinic = async (req, res) => {
    try {
        let data = await clinicService.createClinic(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error:', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let data = await clinicService.getAllClinic()
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error:', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let deleteClinicById = async (req, res) => {
    try {
        let data = await clinicService.deleteClinicById(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error:', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailClinicById = async (req, res) => {
    try {
        let data = await clinicService.getDetailClinicById(req.query.clinicId)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error:', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getClinicByPagination = async (req, res) => {
    try {
        let data = await clinicService.getClinicByPagination(req.query.page, req.query.limit)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error:', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let searchClinic = async (req, res) => {
    try {
        let { term, page, limit } = req.query
        let data = await clinicService.searchClinic(term, page, limit)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error:', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    createClinic,
    deleteClinicById,
    getAllClinic,
    getDetailClinicById,
    getClinicByPagination,
    searchClinic
}
