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
            listProvince: []
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
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    listProvince: resProvince.data
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    handleOnChangeSelect = (e) => {
        console.log('check on change', e.target.value)
    }

    render() {
        let { arrDoctorId, dataDetailSpecialty, listProvince } = this.state
        let { language } = this.props
        return (
            <div className='detail-specialty-container'>
                <HomeHeader isShowBanner={false} />
                <div className='detail-specialty-body'>
                    <div className='description-specialty'>
                        {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
                            <div dangerouslySetInnerHTML={{ __html: `${dataDetailSpecialty.descriptionHTML}` }}></div>
                        )}
                    </div>
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
                                            isShowDescriptionDoctor={false}
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
