import _ from 'lodash'
import db from '../models/index'
require('dotenv').config()
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
import emailService from './emailService'
const { Op } = require('sequelize')

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: db.Allcode,
                        as: 'positionData',
                        attributes: ['valueVi', 'valueEn']
                    }
                ],
                raw: true,
                nest: true
            })
            let doctorInfo = await db.Doctor_Info.findAll({
                include: [
                    {
                        model: db.Specialty,
                        as: 'specialtyData',
                        attributes: ['name']
                    }
                ],
                raw: true,
                nest: true
            })

            let merged = []
            for (let i = 0; i < doctors.length; i++) {
                let specialtyFound = doctorInfo.find((item) => item.doctorId === doctors[i].id)?.specialtyData?.name
                if (specialtyFound) {
                    merged.push({
                        ...doctors[i],
                        specialtyData: {
                            name: specialtyFound
                        }
                    })
                } else {
                    merged.push({
                        ...doctors[i]
                    })
                }
            }
            if (merged && merged.length > 0) {
                merged = merged.map((item) => ({
                    ...item,
                    image: new Buffer(item.image, 'base64').toString('binary')
                }))
                resolve({
                    errCode: 0,
                    data: merged
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let checkRequiredFields = (inputData) => {
    let isValid = true
    let element = ''
    let arrFields = [
        'doctorId',
        'contentHTML',
        'contentMarkdown',
        'description',
        'action',
        'selectedPrice',
        'selectedPayment',
        'selectedProvince',
        'nameClinic',
        'addressClinic',
        'note',
        'specialtyId'
    ]

    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false
            element = arrFields[i]
            break
        }
    }
    return {
        isValid,
        element
    }
}

let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let {
                doctorId,
                contentHTML,
                contentMarkdown,
                description,
                action,
                selectedPrice,
                selectedPayment,
                selectedProvince,
                nameClinic,
                addressClinic,
                note,
                specialtyId,
                clinicId
            } = inputData

            let checkObj = checkRequiredFields(inputData)
            if (!checkObj.isValid) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing ${checkObj.element} parameter`
                })
            } else {
                // upsert  to Markdown
                if (action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: contentHTML,
                        contentMarkdown: contentMarkdown,
                        description: description,
                        doctorId: doctorId
                    })
                } else if (action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: doctorId },
                        raw: false
                    })

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = contentHTML
                        doctorMarkdown.contentMarkdown = contentMarkdown
                        doctorMarkdown.description = description
                        doctorMarkdown.updateAt = new Date()
                        await doctorMarkdown.save()
                    }
                }

                // upsert to Doctor_info table
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    raw: false
                })
                console.log('>>>>>>> check', doctorInfo)
                if (doctorInfo) {
                    // update
                    doctorInfo.doctorId = doctorId
                    doctorInfo.priceId = selectedPrice
                    doctorInfo.provinceId = selectedProvince
                    doctorInfo.paymentId = selectedPayment
                    doctorInfo.addressClinic = addressClinic
                    doctorInfo.nameClinic = nameClinic
                    doctorInfo.note = note
                    doctorInfo.specialtyId = specialtyId
                    doctorInfo.clinicId = clinicId
                    await doctorInfo.save()
                } else {
                    // create
                    await db.Doctor_Info.create({
                        doctorId: doctorId,
                        priceId: selectedPrice,
                        provinceId: selectedProvince,
                        paymentId: selectedPayment,
                        addressClinic: addressClinic,
                        nameClinic: nameClinic,
                        note: note,
                        specialtyId: specialtyId,
                        clinicId: clinicId
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save info doctor success'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Info,
                            // attributes: [
                            //     'doctorId',
                            //     'nameClinic',
                            //     'addressClinic',
                            //     'note',
                            //     'paymentId',
                            //     'priceId',
                            //     'provinceId'
                            // ],
                            attributes: {
                                exclude: ['id, doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }
                            ]
                            // attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (data?.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param !'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item) => ({ ...item, maxNumber: MAX_NUMBER_SCHEDULE }))
                }

                // get all existing data
                let existing = await db.Schedule.findAll({
                    where: {
                        doctorId: data.doctorId,
                        date: data.formattedDate
                    },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })

                // compare different
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date
                })

                // create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Ok'
                })
            }
            resolve('')
        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
                    ],
                    raw: true,
                    nest: true
                })
                if (!dataSchedule) dataSchedule = []
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getExtraInfoDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    attributes: {
                        exclude: ['id, doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Info,

                            attributes: {
                                exclude: ['password']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (data?.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if (!data) data = {}
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                {
                                    model: db.Allcode,
                                    as: 'genderData',
                                    attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                        {
                            model: db.Allcode,
                            as: 'timeTypeDataPatient',
                            attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { doctorId, email, patientId, timeType, imageBase64 } = data
            if (!doctorId || !email || !patientId || !timeType || !imageBase64) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                // update status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId,
                        patientId,
                        timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                }
                // send email remedy
                await emailService.sendAttachment(data)
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let searchDoctor = (term, page, limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!page || !limit) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let doctors = {}
                let startIndex = (page - 1) * limit
                let endIndex = page * limit
                const { count, rows } = await db.User.findAndCountAll({
                    where: {
                        roleId: 'R2',
                        [Op.or]: {
                            firstName: {
                                [Op.like]: `%${term}%`
                            },
                            lastName: {
                                [Op.like]: `%${term}%`
                            }
                        }
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueVi', 'valueEn']
                        }
                    ],
                    raw: true,
                    nest: true,
                    offset: startIndex,
                    limit: +limit
                })

                let doctorInfo = await db.Doctor_Info.findAll({
                    include: [
                        {
                            model: db.Specialty,
                            as: 'specialtyData',
                            attributes: ['name']
                        }
                    ],
                    raw: true,
                    nest: true
                })

                let merged = []
                for (let i = 0; i < rows.length; i++) {
                    let specialtyFound = doctorInfo.find((item) => item.doctorId === rows[i].id)?.specialtyData?.name
                    if (specialtyFound) {
                        merged.push({
                            ...rows[i],
                            specialtyData: {
                                name: specialtyFound
                            }
                        })
                    } else {
                        merged.push({
                            ...rows[i]
                        })
                    }
                }
                if (merged && merged.length > 0) {
                    merged = merged.map((item) => ({
                        ...item,
                        image: new Buffer(item.image, 'base64').toString('binary')
                    }))
                }

                let data = {
                    count: count,
                    rows: [...merged]
                }

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDetailInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInfoDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy,
    searchDoctor
}
