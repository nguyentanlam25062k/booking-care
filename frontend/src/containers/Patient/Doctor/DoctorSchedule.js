import React, { Component } from 'react'
import { connect } from 'react-redux'
import { LANGUAGES } from '../../../utils'
import localization from 'moment/locale/vi'
import './DoctorSchedule.scss'
import moment from 'moment'
import { getScheduleDoctorByDate } from '../../../services/userService'
import { FormattedMessage } from 'react-intl'
import BookingModal from './Modal/BookingModal'

class DoctorSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {}
        }
    }

    async componentDidMount() {
        let { language } = this.props
        let allDays = this.getArrDays(language)
        this.setState({
            allDays: allDays
        })

        let id = this?.props?.doctorIdFromParent
        if (id) {
            let allDays = this.getArrDays(language)
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value)
            this.setState({
                allAvailableTime: res.data ? res.data : []
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let allDays = this.getArrDays(this.props.language)
            this.setState({
                allDays: allDays
            })
        }
        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
            let { language } = this.props
            let allDays = this.getArrDays(language)
            let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value)
            this.setState({
                allAvailableTime: res.data ? res.data : []
            })
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    getArrDays = (language) => {
        let allDays = []
        for (let i = 0; i < 7; i++) {
            let labelVi
            let labelEn
            if (i === 0) {
                labelVi = `Hôm nay - ${moment(new Date()).format('DD/MM')}`
                labelEn = `Today - ${moment(new Date()).add(i, 'days').format('DD/MM')}`
            } else {
                labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM')
                labelEn = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM')
            }

            let obj = {
                label: language === LANGUAGES.VI ? labelVi : labelEn,
                value: moment(new Date()).add(i, 'days').startOf('day').valueOf()
            }
            allDays.push(obj)
        }
        return allDays
    }

    handleOnChangeSelect = async (e) => {
        let doctorId = this.props.doctorIdFromParent
        if (doctorId && doctorId !== -1) {
            let date = e.target.value
            let res = await getScheduleDoctorByDate(doctorId, date)
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : []
                })
            }
        }
    }

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time
        })
    }

    closeBookingModal = () => {
        this.setState({
            isOpenModalBooking: false
        })
    }

    render() {
        let { allDays, allAvailableTime, isOpenModalBooking, dataScheduleTimeModal } = this.state
        let { language } = this.props

        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <select onChange={(e) => this.handleOnChangeSelect(e)}>
                            {allDays &&
                                allDays.length > 0 &&
                                allDays.map((item, index) => (
                                    <option key={index} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className='all-available-time'>
                        <div className='text-calendar'>
                            <i className='fas fa-calendar-alt'>
                                <span>
                                    <FormattedMessage id='patient.detail-doctor.schedule' />
                                </span>
                            </i>
                        </div>
                        <div className='time-content'>
                            {allAvailableTime && allAvailableTime.length > 0 ? (
                                <>
                                    <div className='time-content-btn'>
                                        {allAvailableTime.map((item, index) => {
                                            let timeDisplay =
                                                language === LANGUAGES.VI
                                                    ? item.timeTypeData.valueVi
                                                    : item.timeTypeData.valueEn
                                            return (
                                                <button
                                                    className={language === LANGUAGES.VI ? 'btn-vi' : 'btn-en'}
                                                    key={index}
                                                    onClick={() => this.handleClickScheduleTime(item)}
                                                >
                                                    {timeDisplay}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <div className='book-free'>
                                        <span>
                                            <FormattedMessage id='patient.detail-doctor.choose' />
                                            <i className='far fa-hand-point-up'></i>
                                            <FormattedMessage id='patient.detail-doctor.book-free' />
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className='no-schedule'>
                                    <FormattedMessage id='patient.detail-doctor.no-schedule' />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModal={isOpenModalBooking}
                    closeBookingModal={this.closeBookingModal}
                    dataTime={dataScheduleTimeModal}
                />
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule)
