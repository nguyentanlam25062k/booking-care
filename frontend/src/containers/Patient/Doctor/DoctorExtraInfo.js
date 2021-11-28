import React, { Component } from 'react'
import { connect } from 'react-redux'
import { LANGUAGES } from '../../../utils'
import './DoctorExtraInfo.scss'
import { getExtraInfoDoctor } from '../../../services/userService'
import { FormattedMessage } from 'react-intl'
import NumberFormat from 'react-number-format'

class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowDetailInfo: false,
            extraInfo: {}
        }
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }

        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
            let res = await getExtraInfoDoctor(this.props.doctorIdFromParent)
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data
                })
            }
        }
    }

    showHideDetailInfo = () => {
        let { isShowDetailInfo } = this.state
        this.setState({
            isShowDetailInfo: !isShowDetailInfo
        })
    }

    render() {
        let { isShowDetailInfo, extraInfo } = this.state
        let { language } = this.props

        return (
            <div className='doctor-extra-info-container'>
                <div className='content-up'>
                    <div className='text-address'>
                        <FormattedMessage id='patient.extra-doctor-info.text-address' />
                    </div>
                    <div className='name-clinic'>{extraInfo?.nameClinic}</div>
                    <div className='detail-address'>{extraInfo?.addressClinic}</div>
                </div>
                <div className='content-down'>
                    {!isShowDetailInfo ? (
                        <div className='short-info'>
                            <FormattedMessage id='patient.extra-doctor-info.price' />
                            {extraInfo?.priceTypeData && language === LANGUAGES.VI ? (
                                <NumberFormat
                                    className='currency'
                                    value={extraInfo?.priceTypeData?.valueVi}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={'vnđ'}
                                />
                            ) : (
                                <NumberFormat
                                    className='currency'
                                    value={extraInfo?.priceTypeData?.valueEn}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    prefix={'$'}
                                />
                            )}
                            <span className='detail' onClick={() => this.showHideDetailInfo()}>
                                <FormattedMessage id='patient.extra-doctor-info.detail' />
                            </span>
                        </div>
                    ) : (
                        <>
                            <div className='title-price'>
                                <FormattedMessage id='patient.extra-doctor-info.price' />
                            </div>
                            <div className='detail-info'>
                                <span className='left'>
                                    <FormattedMessage id='patient.extra-doctor-info.price' />
                                </span>
                                <span className='right'>
                                    {extraInfo?.priceTypeData && language === LANGUAGES.VI ? (
                                        <NumberFormat
                                            className='currency'
                                            value={extraInfo?.priceTypeData?.valueVi}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={'vnđ'}
                                        />
                                    ) : (
                                        <NumberFormat
                                            className='currency'
                                            value={extraInfo?.priceTypeData?.valueEn}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            prefix={'$'}
                                        />
                                    )}
                                </span>
                                <div className='note'>{extraInfo?.note}</div>
                            </div>
                            <div className='payment'>
                                <FormattedMessage id='patient.extra-doctor-info.payment' />
                                {language === LANGUAGES.VI
                                    ? extraInfo?.paymentTypeData?.valueVi
                                    : extraInfo?.paymentTypeData?.valueEn}
                            </div>
                            <div className='hide-price'>
                                <span onClick={() => this.showHideDetailInfo()}>
                                    <FormattedMessage id='patient.extra-doctor-info.hide-price' />
                                </span>
                            </div>
                        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo)
