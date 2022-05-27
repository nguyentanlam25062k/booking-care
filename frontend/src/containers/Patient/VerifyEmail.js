import React, { Component } from 'react'
import { connect } from 'react-redux'
import { postVerifyAppointment } from '../../services/userService'
import HomeHeader from '../HomePage/HomeHeader'
import './VerifyEmail.scss'

class VerifyEmail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stateVerify: false,
            errCode: 0
        }
    }

    async componentDidMount() {
        if (this?.props?.location?.search) {
            let urlParams = new URLSearchParams(this.props.location.search)
            let token = urlParams.get('token')
            let doctorId = urlParams.get('doctorId')

            let res = await postVerifyAppointment({ token, doctorId })

            if (res && res.errCode === 0) {
                this.setState({
                    stateVerify: true,
                    errCode: res.errCode
                })
            } else {
                this.setState({
                    stateVerify: true,
                    errCode: res?.errCode ? res.errCode : -1
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    render() {
        let { stateVerify, errCode } = this.state

        return (
            <>
                <HomeHeader />
                <div className='verify-email-container'>
                    {stateVerify === false ? (
                        <div>Loading data...</div>
                    ) : (
                        <div className='info-booking-success'>
                            <div className='info-booking-header'>Đặt hàng - Nghe tư vấn miễn phí</div>
                            <div className='info-booking-container'>
                                <div className='cart'>
                                    <i className='fas fa-shopping-cart'></i>
                                </div>
                                {errCode === 0 ? (
                                    <p className='content success'>Đặt lịch hẹn thành công!</p>
                                ) : (
                                    <p className='content fail'>Lịch hẹn đã được xác nhận hoặc không tồn tại</p>
                                )}
                                <p className='thanks'>Cảm ơn bạn đã cho chúng tôi cơ hội phục vụ!</p>
                                <p className='call'>
                                    Chúng tôi sẽ liên lạc với bạn trong vòng <b>15 phút</b> và cam kết giao hàng hoàn
                                    toàn <b>miễn phí</b>
                                </p>
                                <p className='hotline'>
                                    <span className='phone'>
                                        <i className='fas fa-phone'></i>
                                    </span>
                                    Tư vấn bán hàng <strong className='phone-number'>1800 8123</strong>(08:00 - 22:00h)
                                </p>
                            </div>
                        </div>
                    )}
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail)
