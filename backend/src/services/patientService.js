import _ from 'lodash'
import db from '../models/index'
require('dotenv').config()
import emailService from './emailService'

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
                await emailService.sendSimpleEmail({
                    receiveEmail: email,
                    patientName: fullName,
                    time: timeString,
                    doctorName: doctorName,
                    language: data.language,
                    redirectLink:
                        'https://www.youtube.com/watch?v=0GL--Adfqhc&list=PLncHg6Kn2JT6E38Z3kit9Hnif1xC_9VqI&index=94'
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
                            timeType: timeType
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

module.exports = {
    postBookAppointment
}
