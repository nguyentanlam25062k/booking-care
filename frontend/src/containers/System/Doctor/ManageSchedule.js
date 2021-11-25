import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Select from 'react-select'
import * as actions from '../../../store/actions'
import { LANGUAGES, CRUD_ACTIONS, dateFormat } from '../../../utils/constant'

import './ManageSchedule.scss'
import DatePicker from '../../../components/Input/DatePicker'
import moment from 'moment'
import { toast } from 'react-toastify'
import _ from 'lodash'
import { saveBulkScheduleDoctor } from '../../../services/userService'

class ManageSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listDoctors: [],
            selectedDoctor: {},
            currentDate: '',
            rangeTime: []
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors()
        this.props.fetchAllScheduleTime()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime
            if (data && data.length > 0) {
                data = data.map((item) => ({ ...item, isSelected: false }))
            }
            this.setState({
                rangeTime: data
            })
        }

        // if (prevProps.language !== this.props.language) {
        //     let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
        //     this.setState({
        //         listDoctors: dataSelect
        //     })
        // }
    }

    buildDataInputSelect = (data) => {
        let result = []
        let { language } = this.props
        if (data && data.length > 0) {
            result = data.map((item, index) => {
                let obj = {}
                let labelVi = `${item.lastName} ${item.firstName}`
                let labelEn = `${item.firstName} ${item.lastName}`
                obj.label = language === LANGUAGES.VI ? labelVi : labelEn
                obj.value = item.id
                return obj
            })
        }
        return result
    }

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map((item) => {
                return item.id === time.id ? { ...item, isSelected: !item.isSelected } : item
            })
            this.setState({
                rangeTime: rangeTime
            })
        }
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state
        let result = []
        if (!currentDate) {
            toast.error('Invalid date')
            return
        }

        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error('Invalid selected doctor')
            return
        }

        let formattedDate = new Date(currentDate).getTime()

        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter((item) => item.isSelected === true)

            if (selectedTime && selectedTime.length > 0) {
                selectedTime.forEach((item) => {
                    let obj = {
                        doctorId: selectedDoctor.value,
                        date: formattedDate,
                        timeType: item.keyMap
                    }
                    result.push(obj)
                })
            } else {
                toast.error('Invalid selected time')
                return
            }
        }

        let res = await saveBulkScheduleDoctor({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            formattedDate: formattedDate
        })

        if (res && res.errCode === 0) {
            toast.success('Create schedule success!')
        }
        console.log('res from server', res)
    }

    render() {
        let { listDoctors, selectedDoctor, rangeTime } = this.state
        let { language } = this.props
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1))

        console.log('check rangeTime', rangeTime)
        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id='manage-schedule.title' />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label>
                                <FormattedMessage id='manage-schedule.choose-doctor' />
                            </label>
                            <Select value={selectedDoctor} onChange={this.handleChangeSelect} options={listDoctors} />
                        </div>
                        <div className='col-6 form-group'>
                            <label>
                                <FormattedMessage id='manage-schedule.choose-date' />
                            </label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className='form-control'
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime &&
                                rangeTime.length > 0 &&
                                rangeTime.map((item, index) => (
                                    <button
                                        className={
                                            item.isSelected === true ? 'btn btn-schedule active' : 'btn btn-schedule'
                                        }
                                        key={index}
                                        onClick={() => this.handleClickBtnTime(item)}
                                    >
                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                    </button>
                                ))}
                        </div>
                        <div className='col-12'>
                            <button
                                className='btn btn-primary btn-save-schedule'
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id='manage-schedule.save' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule)
