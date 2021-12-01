import _ from 'lodash'
import db from '../models/index'
require('dotenv').config()
import emailService from './emailService'
import { v4 as uuidv4 } from 'uuid'

let buildUrlEmail = (doctorId, token) => {
    let result = ''
    result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { email, timeType, doctorId, date, fullName, timeString, language, doctorName } = data
            if (!email || !timeType || !doctorId || !date || !fullName) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let token = uuidv4() // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

                await emailService.sendSimpleEmail({
                    receiveEmail: email,
                    patientName: fullName,
                    time: timeString,
                    doctorName: doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(doctorId, token)
                })

                // upsert patient
                let [user, createdUser] = await db.User.findOrCreate({
                    where: { email: email },
                    defaults: {
                        email: email,
                        roleId: 'R3'
                    }
                })

                // create a booking record
                if (user) {
                    let [booking, createdBooking] = await db.Booking.findOrCreate({
                        where: {
                            patientId: user.id
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: doctorId,
                            patientId: user.id,
                            date: date,
                            timeType: timeType,
                            token: token
                        }
                    })
                    resolve({
                        data: booking,
                        errCode: 0,
                        errMessage: 'Save info doctor success!'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { token, doctorId } = data
            if (!token || !doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId,
                        token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Update appointment success!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist!'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment,
    postVerifyBookAppointment
}
