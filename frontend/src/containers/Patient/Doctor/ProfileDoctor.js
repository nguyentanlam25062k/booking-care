import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { getProfileDoctor } from '../../../services/userService'
import { LANGUAGES } from '../../../utils'
import localization from 'moment/locale/vi'
import './ProfileDoctor.scss'
import NumberFormat from 'react-number-format'
import _ from 'lodash'
import moment from 'moment'
class ProfileDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataProfile: {}
        }
    }

    async componentDidMount() {
        let { doctorId } = this.props
        let data = await this.getInfoDoctor(doctorId)
        this.setState({
            dataProfile: data
        })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
        if (prevProps.doctorId !== this.props.doctorId) {
            // this.getInfoDoctor(this.props.doctorId)
        }
    }

    getInfoDoctor = async (id) => {
        let result = {}
        if (id) {
            let res = await getProfileDoctor(id)
            if (res && res.errCode === 0) {
                result = res.data
            }
        }
        return result
    }

    renderBookingModal = (dataTime) => {
        let { language } = this.props
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn

            let date =
                language === LANGUAGES.VI
                    ? moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                    : moment
                          .unix(+dataTime.date / 1000)
                          .locale('en')
                          .format('dddd - MM/DD/YYYY')

            return (
                <>
                    <div>
                        {time} {date}
                    </div>
                    <div>Miễn phí đặt lịch</div>
                </>
            )
        }
        return <></>
    }

    render() {
        let { dataProfile } = this.state
        let { language, isShowDescriptionDoctor, dataTime } = this.props
        let nameVi = '',
            nameEn = ''

        if (dataProfile?.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }
        console.log('check props', dataTime)
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div
                        className='content-left'
                        style={{
                            backgroundImage: `url(${dataProfile.image ? dataProfile.image : ''})`
                        }}
                    ></div>
                    <div className='content-right'>
                        <div className='up'>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                        <div className='down'>
                            {isShowDescriptionDoctor === true ? (
                                <>
                                    {dataProfile?.Markdown?.description && (
                                        <span>{dataProfile.Markdown.description}</span>
                                    )}
                                </>
                            ) : (
                                this.renderBookingModal(dataTime)
                            )}
                        </div>
                    </div>
                </div>
                <div className='price'>
                    Giá khám:
                    {dataProfile?.Doctor_Info?.priceTypeData && language === LANGUAGES.VI ? (
                        <NumberFormat
                            className='currency'
                            value={dataProfile?.Doctor_Info?.priceTypeData?.valueVi}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={'vnđ'}
                        />
                    ) : (
                        <NumberFormat
                            className='currency'
                            value={dataProfile?.Doctor_Info?.priceTypeData?.valueEn}
                            displayType={'text'}
                            thousandSeparator={true}
                            prefix={'$'}
                        />
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor)
