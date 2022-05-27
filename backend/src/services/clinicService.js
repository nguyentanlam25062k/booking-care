import _ from 'lodash'
import db from '../models/index'
const { Op } = require('sequelize')
let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let {
                name,
                imageBase64,
                address,
                action,

                descriptionHTMLIntro,
                descriptionMarkdownIntro,

                descriptionHTMLStrength,
                descriptionMarkdownStrength,

                descriptionHTMLStrengthEquipment,
                descriptionMarkdownStrengthEquipment,

                descriptionHTMLAddLocation,
                descriptionMarkdownAddLocation,

                descriptionHTMLProcess,
                descriptionMarkdownProcess
            } = data

            if (!name || !imageBase64 || !address || !descriptionHTMLIntro || !descriptionMarkdownIntro || !action) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                if (action === 'CREATE') {
                    await db.Clinic.create({
                        name: name,
                        image: imageBase64,
                        address: address,

                        descriptionHTMLIntro: descriptionHTMLIntro,
                        descriptionMarkdownIntro: descriptionMarkdownIntro,

                        descriptionHTMLStrength: descriptionHTMLStrength,
                        descriptionMarkdownStrength: descriptionMarkdownStrength,

                        descriptionHTMLStrengthEquipment: descriptionHTMLStrengthEquipment,
                        descriptionMarkdownStrengthEquipment: descriptionMarkdownStrengthEquipment,

                        descriptionHTMLAddLocation: descriptionHTMLAddLocation,
                        descriptionMarkdownAddLocation: descriptionMarkdownAddLocation,

                        descriptionHTMLProcess: descriptionHTMLProcess,
                        descriptionMarkdownProcess: descriptionMarkdownProcess
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'Create a new clinic success!'
                    })
                } else {
                    // action === 'UPDATE'
                    let { idClinic } = data
                    if (idClinic) {
                        let clinic = await db.Clinic.findOne({
                            where: {
                                id: idClinic
                            },
                            raw: false
                        })
                        if (clinic) {
                            clinic.set({
                                name: name,
                                image: imageBase64,
                                address: address,

                                descriptionHTMLIntro: descriptionHTMLIntro,
                                descriptionMarkdownIntro: descriptionMarkdownIntro,

                                descriptionHTMLStrength: descriptionHTMLStrength,
                                descriptionMarkdownStrength: descriptionMarkdownStrength,

                                descriptionHTMLStrengthEquipment: descriptionHTMLStrengthEquipment,
                                descriptionMarkdownStrengthEquipment: descriptionMarkdownStrengthEquipment,

                                descriptionHTMLAddLocation: descriptionHTMLAddLocation,
                                descriptionMarkdownAddLocation: descriptionMarkdownAddLocation,

                                descriptionHTMLProcess: descriptionHTMLProcess,
                                descriptionMarkdownProcess: descriptionMarkdownProcess
                            })

                            await clinic.save()

                            resolve({
                                errCode: 0,
                                errMessage: 'Update a clinic success!'
                            })
                        } else {
                            resolve({
                                errCode: 2,
                                errMessage: `Can't find a clinic`
                            })
                        }
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Missing parameter'
                        })
                    }
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = []
            data = await db.Clinic.findAll({})

            if (data && data.length > 0) {
                data = data.map((item) => ({ ...item, image: new Buffer(item.image, 'base64').toString('binary') }))
            }

            resolve({
                errCode: 0,
                errMessage: 'Get success all specialty',
                data: data
            })
        } catch (e) {
            reject(e)
        }
    })
}

let deleteClinicById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { clinicId } = data
            console.log('check clinicId', clinicId)
            if (!clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let clinic = await db.Clinic.findOne({
                    where: {
                        id: clinicId
                    },
                    raw: false
                })
                if (clinic) {
                    await clinic.destroy()
                    resolve({
                        errCode: 0,
                        errMessage: `Deleted clinic success`
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `Can't not found clinic`
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    }
                })

                if (data) {
                    if (data?.image) {
                        data.image = new Buffer(data.image, 'base64').toString('binary')
                    }

                    let doctorClinic = []
                    doctorClinic = await db.Doctor_Info.findAll({
                        where: {
                            clinicId: inputId
                        },
                        attributes: ['doctorId', 'provinceId']
                    })

                    data.doctorClinic = doctorClinic
                } else data = {}

                resolve({
                    errCode: 0,
                    errMessage: 'Get success all specialty',
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getClinicByPagination = (page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!page || !limit) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = {}
                let startIndex = (page - 1) * limit
                let endIndex = page * limit

                const { count, rows } = await db.Clinic.findAndCountAll({
                    attributes: {
                        exclude: ['password']
                    },
                    offset: startIndex,
                    limit: +limit
                })
                data.count = count
                data.rows = rows

                if (data?.rows?.length > 0) {
                    data.rows = data.rows.map((item) => ({
                        ...item,
                        image: new Buffer(item.image, 'base64').toString('binary')
                    }))
                }

                if (count > 0) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Get success all clinic',
                        data: data
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `Can't found clinic`,
                        data: data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let searchClinic = (term, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!page || !limit) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = {}
                let startIndex = (page - 1) * limit
                let endIndex = page * limit
                const { count, rows } = await db.Clinic.findAndCountAll({
                    where: {
                        name: {
                            [Op.like]: `%${term}%`
                        }
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    offset: startIndex,
                    limit: +limit
                })
                data.count = count
                data.rows = rows

                if (data?.rows?.length > 0) {
                    data.rows = data.rows.map((item) => ({
                        ...item,
                        image: new Buffer(item.image, 'base64').toString('binary')
                    }))
                }

                if (count > 0) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Get success all clinic',
                        data: data
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `Can't found clinic`,
                        data: data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createClinic,
    getAllClinic,
    deleteClinicById,
    getDetailClinicById,
    getClinicByPagination,
    searchClinic
}
