import React, { Component } from 'react'
import { connect } from 'react-redux'
import { LANGUAGES } from '../../../utils'
import localization from 'moment/locale/vi'
import './DoctorSchedule.scss'
import moment from 'moment'
import { getScheduleDoctorByDate } from '../../../services/userService'

class DoctorSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allDays: [],
            allAvailableTime: []
        }
    }

    async componentDidMount() {
        let { language } = this.props
        this.setArrDays(language)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            this.setArrDays(this.props.language)
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    setArrDays = (language) => {
        let allDays = []
        for (let i = 0; i < 7; i++) {
            let labelVi = this.capitalizeFirstLetter(moment(new Date()).add(i, 'days').format('dddd - DD/MM'))
            let labelEn = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM')

            let obj = {
                label: language === LANGUAGES.VI ? labelVi : labelEn,
                value: moment(new Date()).add(i, 'days').startOf('day').valueOf()
            }
            allDays.push(obj)
        }

        this.setState({
            allDays: allDays
        })
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

    render() {
        let { allDays, allAvailableTime } = this.state
        let { language } = this.props
        console.log(allAvailableTime)
        return (
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
                            <span>Lịch khám</span>
                        </i>
                    </div>
                    <div className='time-content'>
                        {allAvailableTime && allAvailableTime.length > 0 ? (
                            allAvailableTime.map((item, index) => {
                                let timeDisplay =
                                    language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn
                                return <button key={index}>{timeDisplay}</button>
                            })
                        ) : (
                            <div>Không có lịch hẹn trong thời gian này, vui lòng chọn thời gian khác!</div>
                        )}
                    </div>
                </div>
            </div>
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
