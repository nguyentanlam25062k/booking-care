import db from '../models/index'

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { name, imageBase64, descriptionHTML, descriptionMarkdown } = data

            if (!name || !imageBase64 || !descriptionHTML || !descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
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
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                })

                if (data) {
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

module.exports = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}
