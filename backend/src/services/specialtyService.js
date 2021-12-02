import db from '../models/index'

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data)
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
                    descriptionMarkdown: descriptionHTML
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
    createSpecialty
}
