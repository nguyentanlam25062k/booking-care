import specialtyService from '../services/specialtyService'

let createSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.createSpecialty(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error:', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.getAllSpecialty()
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error:', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailSpecialtyById = async (req, res) => {
    try {
        let data = await specialtyService.getDetailSpecialtyById(req.query.specialtyId, req.query.location)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error:', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let searchSpecialty = async (req, res) => {
    try {
        let { term, page, limit } = req.query
        let data = await specialtyService.searchSpecialty(term, page, limit)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error:', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getSpecialtyByPagination = async (req, res) => {
    try {
        let data = await specialtyService.getSpecialtyByPagination(req.query.page, req.query.limit)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error:', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let deleteSpecialtyById = async (req, res) => {
    try {
        let data = await specialtyService.deleteSpecialtyById(req.body)
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
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    searchSpecialty,
    deleteSpecialtyById,
    getSpecialtyByPagination
}
