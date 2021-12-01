import _ from 'lodash'
import db from '../models/index'
require('dotenv').config()

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { email, timeType, doctorId, date } = data
            if (!email || !timeType || !doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
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
