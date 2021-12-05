import db from '../models/index'

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let {
                name,
                imageBase64,
                address,

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

            if (!name || !imageBase64 || !address || !descriptionHTMLIntro || !descriptionMarkdownIntro) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
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
                    errMessage: 'Create a new specialty success!'
                })
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
            data = await db.Clinic.findAll()

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
                    attributes: ['descriptionHTMLIntro', 'descriptionMarkdownIntro', 'image', 'address', 'name']
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

module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinicById
}
