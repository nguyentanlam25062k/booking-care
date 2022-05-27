import db from '../models/index'
const { Op } = require('sequelize')

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        let {
            name,
            imageBase64,
            action,

            descriptionHTML,
            descriptionMarkdown
        } = data

        if (!name || !imageBase64 || !descriptionHTML || !descriptionMarkdown || !action) {
            resolve({
                errCode: 1,
                errMessage: 'Missing parameter'
            })
        } else {
            if (action === 'CREATE') {
                await db.Specialty.create({
                    name: name,
                    image: imageBase64,

                    descriptionHTML: descriptionHTML,
                    descriptionMarkdown: descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create a new specialty success!'
                })
            } else {
                // action === 'UPDATE'
                let { idSpecialty } = data
                if (idSpecialty) {
                    let specialty = await db.Specialty.findOne({
                        where: {
                            id: idSpecialty
                        },
                        raw: false
                    })
                    if (specialty) {
                        specialty.set({
                            name: name,
                            image: imageBase64,

                            descriptionHTML: descriptionHTML,
                            descriptionMarkdown: descriptionMarkdown
                        })

                        await specialty.save()

                        resolve({
                            errCode: 0,
                            errMessage: 'Update a specialty success!'
                        })
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: `Can't find a specialty`
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
    })
}

let searchSpecialty = (term, page, limit) => {
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
                const { count, rows } = await db.Specialty.findAndCountAll({
                    where: {
                        name: {
                            [Op.like]: `%${term}%`
                        }
                    },
                    attributes: {
                        exclude: ['']
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
                        errMessage: 'Get success all specialty',
                        data: data
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `Can't found specialty`,
                        data: data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = []
            data = await db.Specialty.findAll()
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

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown', 'image']
                })

                if (data) {
                    if (data?.image) {
                        data.image = new Buffer(data.image, 'base64').toString('binary')
                    }

                    let doctorSpecialty = []
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {
                                specialtyId: inputId
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    } else {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {
                                specialtyId: inputId,
                                provinceId: location
                            },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty
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

let deleteSpecialtyById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { specialtyId } = data
            console.log('check specialtyId', specialtyId)
            if (!specialtyId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let specialty = await db.Specialty.findOne({
                    where: {
                        id: specialtyId
                    },
                    raw: false
                })
                if (specialty) {
                    await specialty.destroy()
                    resolve({
                        errCode: 0,
                        errMessage: `Deleted specialty success`
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `Can't not found specialty`
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getSpecialtyByPagination = (page, limit) => {
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

                const { count, rows } = await db.Specialty.findAndCountAll({
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
                        errMessage: 'Get success all specialty',
                        data: data
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `Can't found specialty`,
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
    createSpecialty,
    searchSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
    deleteSpecialtyById,
    getSpecialtyByPagination
}
