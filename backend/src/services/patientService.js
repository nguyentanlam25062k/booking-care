import _ from 'lodash'
import db from '../models/index'
require('dotenv').config()

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.timeType || !data.date || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                // upsert patient
                let [user, createdUser] = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
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
                            patientId: user.id,
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            data: data.date,
                            timeType: data.timeType
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
