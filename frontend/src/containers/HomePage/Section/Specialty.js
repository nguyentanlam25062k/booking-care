import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick'
import { getAllSpecialty } from '../../../services/userService'
import './Specialty.scss'

class Specialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataSpecialty: []
        }
    }

    async componentDidMount() {
        let res = await getAllSpecialty()
        console.log('manage specialty check res', res)
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    render() {
        let { dataSpecialty } = this.state
        return (
            <div className='section-share section-specialty'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>
                            <FormattedMessage id='home-page.specialty-popular' />
                        </span>
                        <button className='btn-section'>
                            <FormattedMessage id='home-page.more-info' />
                        </button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {dataSpecialty &&
                                dataSpecialty.length > 0 &&
                                dataSpecialty.map((item, index) => (
                                    <div className='section-customize specialty-child' key={index}>
                                        <div
                                            className='bg-image section-specialty'
                                            style={{
                                                backgroundImage: `url(${item.image})`
                                            }}
                                        ></div>
                                        <div className='specialty-name'>{item.name}</div>
                                    </div>
                                ))}
                        </Slider>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Specialty)
