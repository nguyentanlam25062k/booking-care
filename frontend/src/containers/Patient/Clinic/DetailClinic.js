import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './DetailClinic.scss'
import HomeHeader from '../../HomePage/HomeHeader'
import { withRouter } from 'react-router'
import DoctorSchedule from '../Doctor/DoctorSchedule'
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo'
import ProfileDoctor from '../Doctor/ProfileDoctor'
import { getAllCodeService, getDetailClinicById, getDetailSpecialtyById } from '../../../services/userService'
import _ from 'lodash'
import { LANGUAGES } from '../../../utils'

class DetailClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctorId: [],
            dataDetailClinic: {}
        }
    }

    async componentDidMount() {
        let id = this.props?.match?.params?.id
        if (id) {
            let res = await getDetailClinicById({
                id: id
            })

            if (res?.errCode === 0) {
                let data = res?.data?.doctorClinic
                let arrDoctorId = []
                if (data) {
                    arrDoctorId = data.map((item) => item.doctorId)
                }

                this.setState({
                    dataDetailClinic: res.data,
                    arrDoctorId: arrDoctorId
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    render() {
        // arrDoctorId: [],
        //     dataDetailClinic: {},
        //     showMoreDescription: false

        let { arrDoctorId, dataDetailClinic } = this.state
        let { language } = this.props
        // console.log(object)
        return (
            <div className='detail-clinic-container'>
                <HomeHeader isShowBanner={false} isThemeBlue={true} />
                <div className='detail-clinic-header'>
                    <div
                        className='background-clinic'
                        style={{
                            background: `url(${dataDetailClinic.image}) center / cover no-repeat`
                        }}
                    ></div>
                    <div className='description-clinic'>
                        <div className='description-left'>
                            <div
                                className='clinic-logo'
                                style={{
                                    background: `url(${dataDetailClinic.image}) center / cover no-repeat`
                                }}
                            ></div>
                            <div className='clinic-info'>
                                <h3 className='name'>Bệnh viện Hữu nghị Việt Đức</h3>
                                <div className='address'>
                                    <i class='fas fa-map-marker-alt'></i>
                                    <span>Số 16-18 Phủ Doãn - Hoàn Kiếm - Hà Nội</span>
                                </div>
                            </div>
                        </div>
                        <button className='description-clinic-bt'>Đặt lịch khám</button>
                    </div>
                </div>
                <div className='detail-clinic-body'>
                    {arrDoctorId &&
                        arrDoctorId.length > 0 &&
                        arrDoctorId.map((item, index) => (
                            <div className='each-doctor' key={index}>
                                <div className='dt-content-left'>
                                    <div className='profile-doctor'>
                                        <ProfileDoctor
                                            doctorId={item}
                                            isShowDescriptionDoctor={true}
                                            isShowLinkDetail={true}
                                            isShowPrice={false}
                                            // dataTime={dataTime}
                                        />
                                    </div>
                                </div>
                                <div className='dt-content-right'>
                                    <div className='doctor-schedule'>
                                        <DoctorSchedule doctorIdFromParent={item} />
                                    </div>
                                    <div className='doctor-extra-info'>
                                        <DoctorExtraInfo doctorIdFromParent={item} />
                                    </div>
                                </div>
                            </div>
                        ))}
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic)
