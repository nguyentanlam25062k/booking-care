import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actions from '../../store/actions'

import './SideBar.scss'
import { NavLink } from 'react-router-dom'

class SideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    handleChangeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    componentDidMount() {}

    renderSideBarAdmin = () => {
        return (
            <ul className='sidebar-list'>
                <li className='sidebar-item'>
                    <NavLink to='/system/user-manage' className='sidebar-link'>
                        <span className='sidebar-icon'>
                            <i className='fas fa-users'></i>
                        </span>
                        <span className='sidebar-text'>quản lí người dùng</span>
                    </NavLink>
                </li>
                <li className='sidebar-item'>
                    <NavLink to='/system/user-redux' className='sidebar-link'>
                        <span className='sidebar-icon'>
                            <i className='fas fa-briefcase-medical'></i>
                        </span>
                        <span className='sidebar-text'>quản lí redux</span>
                    </NavLink>
                </li>
                <li className='sidebar-item'>
                    <NavLink to='/system/manage-doctor' className='sidebar-link'>
                        <span className='sidebar-icon'>
                            <i className='fas fa-briefcase-medical'></i>
                        </span>
                        <span className='sidebar-text'>bác sĩ</span>
                    </NavLink>
                </li>
                <li className='sidebar-item'>
                    <NavLink to='/system/manage-specialty' className='sidebar-link'>
                        <span className='sidebar-icon'>
                            <i className='far fa-address-card'></i>
                        </span>
                        <span className='sidebar-text'>chuyên khoa</span>
                    </NavLink>
                </li>
                <li className='sidebar-item'>
                    <NavLink to='/system/manage-clinic' className='sidebar-link'>
                        <span className='sidebar-icon'>
                            <i className='fas fa-home'></i>
                        </span>
                        <span className='sidebar-text'>phòng khám</span>
                    </NavLink>
                </li>
                <li className='sidebar-item'>
                    <NavLink to='/doctor/manage-schedule' className='sidebar-link'>
                        <span className='sidebar-icon'>
                            <i className='far fa-calendar-alt'></i>
                        </span>
                        <span className='sidebar-text'>lịch hẹn</span>
                    </NavLink>
                </li>
            </ul>
        )
    }

    renderSideBarDoctor = () => {
        return (
            <ul className='sidebar-list'>
                <li className='sidebar-item'>
                    <NavLink to='/doctor/manage-patient' className='sidebar-link'>
                        <span className='sidebar-icon'>
                            <i className='far fa-calendar-alt'></i>
                        </span>
                        <span className='sidebar-text'>bệnh nhân</span>
                    </NavLink>
                </li>
                <li className='sidebar-item'>
                    <NavLink to='/doctor/manage-schedule' className='sidebar-link'>
                        <span className='sidebar-icon'>
                            <i className='far fa-calendar-alt'></i>
                        </span>
                        <span className='sidebar-text'>lịch hẹn</span>
                    </NavLink>
                </li>
            </ul>
        )
    }

    render() {
        let { roleId } = this.props.userInfo
        let resultSideBar = roleId === 'R1' ? this.renderSideBarAdmin() : this.renderSideBarDoctor()
        return (
            <div className='sidebar'>
                <div className='sidebar-header'>
                    <i className='fas fa-user-shield sidebar-shield'></i>
                    <h2 className='sidebar-title'>{`${roleId === 'R1' ? 'Admin' : 'Doctor'}`}</h2>
                </div>
                {resultSideBar}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
