import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { getProfileDoctor } from '../../../services/userService'
import { LANGUAGES } from '../../../utils'
import './ProfileDoctor.scss'
import NumberFormat from 'react-number-format'

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

    render() {
        let { dataProfile } = this.state
        let { language } = this.props
        let nameVi = '',
            nameEn = ''

        if (dataProfile?.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`
        }
        console.log('check props', dataProfile)
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
                            {dataProfile?.Markdown?.description && <span>{dataProfile.Markdown.description}</span>}
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
