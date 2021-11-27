import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getDetailInfoDoctor } from '../../../services/userService'
import { LANGUAGES } from '../../../utils'
import HomeHeader from '../../HomePage/HomeHeader'
import './DetailDoctor.scss'
import DoctorExtraInfo from './DoctorExtraInfo'
import DoctorSchedule from './DoctorSchedule'

class DetailDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1
        }
    }

    async componentDidMount() {
        let id = this.props?.match?.params?.id
        if (id) {
            let res = await getDetailInfoDoctor(id)

            this.setState({
                currentDoctorId: id
            })

            if (res?.errCode === 0) {
                this.setState({
                    detailDoctor: res.data
                })
            }
        }
    }

    componentDidUpdate() {}

    render() {
        let { detailDoctor, currentDoctorId } = this.state
        let { language } = this.props
        let nameVi = '',
            nameEn = ''

        if (detailDoctor?.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`
        }

        return (
            <>
                <HomeHeader isShowBanner={false} />
                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div
                            className='content-left'
                            style={{
                                backgroundImage: `url(${detailDoctor.image ? detailDoctor.image : ''})`
                            }}
                        ></div>
                        <div className='content-right'>
                            <div className='up'>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                            <div className='down'>
                                {detailDoctor?.Markdown?.description && (
                                    <span>{detailDoctor.Markdown.description}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'>
                            <DoctorSchedule doctorIdFromParent={currentDoctorId} />
                        </div>
                        <div className='content-right'>
                            <DoctorExtraInfo doctorIdFromParent={currentDoctorId} />
                        </div>
                    </div>
                    <div className='detail-info-doctor'>
                        {detailDoctor?.Markdown?.contentHTML && (
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: `${detailDoctor.Markdown.contentHTML}` }}></div>
                            </div>
                        )}
                    </div>

                    <div className='comment-doctor'></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor)
