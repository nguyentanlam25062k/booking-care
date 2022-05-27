import React, { Component } from 'react'
import { connect } from 'react-redux'
import './DetailClinic.scss'
import HomeHeader from '../../HomePage/HomeHeader'
import DoctorSchedule from '../Doctor/DoctorSchedule'
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo'
import ProfileDoctor from '../Doctor/ProfileDoctor'
import { getDetailClinicById } from '../../../services/userService'

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
        let { arrDoctorId, dataDetailClinic } = this.state
        let {
            image,
            address,
            name,
            descriptionHTMLIntro,
            descriptionHTMLStrength,
            descriptionHTMLProcess,
            descriptionHTMLEquipment,
            descriptionHTMLLocation
        } = this.state.dataDetailClinic

        return (
            <div className='detail-clinic-container'>
                <HomeHeader isShowBanner={false} isThemeBlue={true} />
                <div className='detail-clinic-header'>
                    <div
                        className='background-clinic'
                        style={{
                            background: `url(${image}) center / cover no-repeat`
                        }}
                    ></div>
                    <div className='description-clinic'>
                        <div className='description-left'>
                            <div
                                className='clinic-logo'
                                style={{
                                    background: `url(${image}) center / cover no-repeat`
                                }}
                            ></div>
                            <div className='clinic-info'>
                                <h3 className='name'>{name}</h3>
                                <div className='address'>
                                    <i className='fas fa-map-marker-alt'></i>
                                    <span>{address}</span>
                                </div>
                            </div>
                        </div>
                        <button className='description-clinic-bt'>Đặt lịch khám</button>
                    </div>
                </div>
                <div className='detail-clinic-scroll'>
                    <div className='booking'>ĐẶT LỊCH KHÁM</div>
                    <div className='intro'>giới thiệu</div>
                    <div className='strength'>thế mạnh chuyên môn</div>
                    <div className='process'>quy trình khám</div>
                    <div className='location'>giá khám bệnh</div>
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
                <div className='detail-clinic-content container'>
                    {descriptionHTMLIntro && (
                        <div className='detail-clinic-intro'>
                            <div className='heading'>GIỚI THIỆU</div>
                            <div dangerouslySetInnerHTML={{ __html: `${descriptionHTMLIntro}` }}></div>
                        </div>
                    )}
                    {descriptionHTMLStrength && (
                        <div className='detail-clinic-strength'>
                            <div className='heading'>Thế mạnh chuyên môn</div>
                            <div dangerouslySetInnerHTML={{ __html: `${descriptionHTMLStrength}` }}></div>
                        </div>
                    )}
                    {descriptionHTMLProcess && (
                        <div className='detail-clinic-process'>
                            <div className='heading'>Quy trình khám</div>
                            <div dangerouslySetInnerHTML={{ __html: `${descriptionHTMLProcess}` }}></div>
                        </div>
                    )}
                    {descriptionHTMLEquipment && (
                        <div className='detail-clinic-equipment'>
                            <div className='heading'>Trang thiết bị</div>
                            <div dangerouslySetInnerHTML={{ __html: `${descriptionHTMLEquipment}` }}></div>
                        </div>
                    )}
                    {descriptionHTMLLocation && (
                        <div className='detail-clinic-location'>
                            <div className='heading'>Vị trí</div>
                            <div dangerouslySetInnerHTML={{ __html: `${descriptionHTMLLocation}` }}></div>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic)
