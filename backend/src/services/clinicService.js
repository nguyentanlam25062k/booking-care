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

module.exports = {
    createClinic
}
