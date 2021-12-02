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

            console.log('>>> check data', data)
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

module.exports = {
    createSpecialty,
    getAllSpecialty
}
