import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './HomeHeader.scss'
import logo from '../../assets/bookingcare-2020.svg'
import { LANGUAGES } from '../../utils'

import { changeLanguageApp } from '../../store/actions'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

class HomeHeader extends Component {
    constructor(props) {
        super(props)
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language)
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }

    render() {
        let { language, isThemeBlue } = this.props
        return (
            <>
                <div className={isThemeBlue ? 'home-header-container theme-blue' : 'home-header-container'}>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className='fas fa-bars'></i>
                            <img
                                className='header-logo'
                                src={logo}
                                alt={`header-logo`}
                                onClick={() => this.returnToHome()}
                            />
                        </div>
                        <div className='center-content'>
                            <div className='children-content'>
                                <div>
                                    <b>
                                        <FormattedMessage id='home-header.specialty' />
                                    </b>
                                </div>
                                <Link to='/category/specialty' className='sub-link'>
                                    <div className='sub-title'>
                                        <FormattedMessage id='home-header.search-doctor' />
                                    </div>
                                </Link>
                            </div>
                            <div className='children-content'>
                                <div>
                                    <b>
                                        <FormattedMessage id='home-header.health-facility' />
                                    </b>
                                </div>
                                <Link to='/category/clinic' className='sub-link'>
                                    <div className='sub-title'>
                                        <FormattedMessage id='home-header.select-room' />
                                    </div>
                                </Link>
                            </div>

                            <div className='children-content'>
                                <div>
                                    <b>
                                        <FormattedMessage id='home-header.doctor' />
                                    </b>
                                </div>
                                <Link to='/category/doctor' className='sub-link'>
                                    <div className='sub-title'>
                                        <FormattedMessage id='home-header.select-doctor' />
                                    </div>
                                </Link>
                            </div>
                            <div className='children-content'>
                                <div>
                                    <b>
                                        <FormattedMessage id='home-header.fee' />
                                    </b>
                                </div>
                                <div className='sub-title'>
                                    <FormattedMessage id='home-header.check-health' />
                                </div>
                            </div>
                        </div>
                        <div className='right-content'>
                            <div className='support'>
                                <i className='fas fa-question-circle'></i>
                                <FormattedMessage id='home-header.support' />
                            </div>
                            <div className={language === LANGUAGES.VI ? 'language-vi active' : 'language-vi'}>
                                <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VN</span>
                            </div>
                            <div className={language === LANGUAGES.EN ? 'language-en active' : 'language-en'}>
                                <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.isShowBanner === true && (
                    <div className='home-header-banner'>
                        <div className='content-up'>
                            {/*  */}
                            <div className='title1'>
                                <FormattedMessage id='banner.title1' />
                            </div>
                            <div className='title2'>
                                <FormattedMessage id='banner.title2' />
                            </div>
                            <div className='search'>
                                <i className='fas fa-search'></i>
                                <input type='text' placeholder='tìm chuyên khoa khám bệnh' />
                            </div>
                        </div>
                        <div className='content-down'>
                            <div className='options'>
                                <div className='options-child'>
                                    <div className='icon-child'>
                                        <i className='far fa-hospital'></i>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child1' />
                                    </div>
                                </div>
                                <div className='options-child'>
                                    <div className='icon-child'>
                                        <i className='fas fa-briefcase-medical'></i>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child2' />
                                    </div>
                                </div>
                                <div className='options-child'>
                                    <div className='icon-child'>
                                        <i className='fas fa-procedures'></i>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child3' />t
                                    </div>
                                </div>
                                <div className='options-child'>
                                    <div className='icon-child'>
                                        <i className='fas fa-flask'></i>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child4' />
                                    </div>
                                </div>
                                <div className='options-child'>
                                    <div className='icon-child'>
                                        <i className='fas fa-user-md'></i>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child5' />
                                    </div>
                                </div>
                                <div className='options-child'>
                                    <div className='icon-child'>
                                        <i className='fas fa-briefcase-medical'></i>
                                    </div>
                                    <div className='text-child'>
                                        <FormattedMessage id='banner.child6' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
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
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader))
