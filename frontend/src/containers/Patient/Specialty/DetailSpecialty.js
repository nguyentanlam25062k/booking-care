import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './DetailSpecialty.scss'
import HomeHeader from '../../HomePage/HomeHeader'
import { withRouter } from 'react-router'
import DoctorSchedule from '../Doctor/DoctorSchedule'
import DoctorExtraInfo from '../Doctor/DoctorExtraInfo'
import ProfileDoctor from '../Doctor/ProfileDoctor'
import { getAllCodeService, getDetailSpecialtyById } from '../../../services/userService'
import _ from 'lodash'
import { LANGUAGES } from '../../../utils'

class DetailSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: [],
            showMoreDescription: false
        }
    }

    async componentDidMount() {
        let id = this.props?.match?.params?.id
        if (id) {
            let res = await getDetailSpecialtyById({
                id: id,
                location: 'ALL'
            })

            let resProvince = await getAllCodeService('PROVINCE')

            if (res?.errCode === 0 && resProvince?.errCode === 0) {
                let data = res?.data?.doctorSpecialty
                let arrDoctorId = []
                if (data) {
                    arrDoctorId = data.map((item) => item.doctorId)
                }

                let dataProvince = resProvince.data
                // let resultProvince = []
                if (dataProvince && dataProvince.length > 0) {
                    dataProvince.unshift({
                        createdAt: null,
                        keyMap: 'ALL',
                        type: 'PROVINCE',
                        valueEn: 'Toan quoc',
                        valueVi: 'Toàn quốc'
                    })
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    listProvince: dataProvince
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    handleOnChangeSelect = async (e) => {
        let id = this.props?.match?.params?.id
        let location = e.target.value

        let res = await getDetailSpecialtyById({
            id: id,
            location: location
        })

        if (res?.errCode === 0) {
            let data = res?.data?.doctorSpecialty
            let arrDoctorId = []
            if (data && !_.isEmpty(data)) {
                arrDoctorId = data.map((item) => item.doctorId)
            }

            this.setState({
                dataDetailSpecialty: res.data,
                arrDoctorId: arrDoctorId
            })
        }
    }

    render() {
        let { arrDoctorId, dataDetailSpecialty, listProvince, showMoreDescription } = this.state
        let { language } = this.props
        // console.log(object)
        return (
            <div className='detail-specialty-container'>
                <HomeHeader isShowBanner={false} />
                <div className='detail-specialty-wrap'>
                    <div
                        className='background-specialty'
                        style={{
                            background: `linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.5)), url(${dataDetailSpecialty.image}) center / cover no-repeat`
                        }}
                    ></div>
                    <div
                        className='description-specialty'
                        style={{
                            height: showMoreDescription === true ? '100%' : '200px'
                        }}
                    >
                        {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
                            <div dangerouslySetInnerHTML={{ __html: `${dataDetailSpecialty.descriptionHTML}` }}></div>
                        )}
                    </div>
                    <div className='more-description'>
                        <span onClick={() => this.setState({ showMoreDescription: !showMoreDescription })}>
                            Đọc thêm
                        </span>
                    </div>
                </div>
                <div className='detail-specialty-body'>
                    <div className='search-sp-doctor'>
                        <select name='' id='' onChange={(e) => this.handleOnChangeSelect(e)}>
                            {listProvince &&
                                listProvince.length > 0 &&
                                listProvince.map((item, index) => (
                                    <option key={index} value={item.keyMap}>
                                        {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                    </option>
                                ))}
                        </select>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty)
