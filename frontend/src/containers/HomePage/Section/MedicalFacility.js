import React, { Component } from 'react'
import { connect } from 'react-redux'
import Slider from 'react-slick'
import { getAllClinic } from '../../../services/userService'
import { withRouter } from 'react-router'
import './MedicalFacility.scss'

class MedicalFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrClinic: []
        }
    }

    async componentDidMount() {
        let res = await getAllClinic()
        if (res && res.errCode === 0) {
            this.setState({
                arrClinic: res.data ? res.data : []
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`)
        }
    }

    render() {
        let { arrClinic } = this.state
        console.log('state medical facility', arrClinic)
        return (
            <div className='section-share section-medical-facility'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'>Cơ sở y tế nổi bật</span>
                        <button className='btn-section'>Xem thêm</button>
                    </div>
                    <div className='section-body'>
                        <Slider {...this.props.settings}>
                            {arrClinic &&
                                arrClinic.length > 0 &&
                                arrClinic.map((item, index) => (
                                    <div className='section-customize clinic-child' key={index}>
                                        <div
                                            className='bg-image section-medical-facility'
                                            style={{
                                                backgroundImage: `url(${item.image})`
                                            }}
                                            onClick={() => this.handleViewDetailClinic(item)}
                                        ></div>
                                        <div className='clinic-name'>{item.name}</div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility))
