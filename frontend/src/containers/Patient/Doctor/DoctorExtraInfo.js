import React, { Component } from 'react'
import { connect } from 'react-redux'
import { LANGUAGES } from '../../../utils'
import './DoctorExtraInfo.scss'
import { getScheduleDoctorByDate } from '../../../services/userService'
import { FormattedMessage } from 'react-intl'

class DoctorExtraInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowDetailInfo: true
        }
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState, snapshot) {}

    showHideDetailInfo = () => {
        let { isShowDetailInfo } = this.state
        this.setState({
            isShowDetailInfo: !isShowDetailInfo
        })
    }

    render() {
        let { isShowDetailInfo } = this.state
        return (
            <div className='doctor-extra-info-container'>
                <div className='content-up'>
                    <div className='text-address'>ĐỊA CHỈ KHÁM</div>
                    <div className='name-clinic'>Phòng khám Chuyên khoa Da Liễu </div>
                    <div className='detail-address'>207 Phố Huế - Hai Bà Trưng - Hà Nội</div>
                </div>
                <div className='content-down'>
                    {!isShowDetailInfo ? (
                        <div className='short-info'>
                            GIÁ KHÁM: 300.000đ. <span onClick={() => this.showHideDetailInfo()}>Xem chi tiết</span>
                        </div>
                    ) : (
                        <>
                            <div className='title-price'>GIÁ KHÁM: .</div>
                            <div className='detail-info'>
                                <span className='left'>Gía khám</span>
                                <span className='right'>250.000d</span>
                                <div className='note'>
                                    Giá khám Được ưu tiên khám trước khi đật khám qua BookingCare. Giá khám cho người
                                    nước ngoài là 30 USD
                                </div>
                            </div>
                            <div className='payment'>
                                Người bệnh có thể thanh toán chi phí bằng hình thức tiền mặt và quẹt thẻ
                            </div>
                            <div className='hide-price'>
                                <span onClick={() => this.showHideDetailInfo()}>Ẩn bảng giá</span>
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
