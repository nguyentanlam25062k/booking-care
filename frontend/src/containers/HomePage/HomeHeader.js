import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './HomeHeader.scss'
import logo from '../../assets/bookingcare-2020.svg'
class HomeHeader extends Component {
    render() {
        return (
            <>
                <div className='home-header-container'>
                    <div className='home-header-content'>
                        <div className='left-content'>
                            <i className='fas fa-bars'></i>
                            <img className='header-logo' src={logo} />
                        </div>
                        <div className='center-content'>
                            <div className='children-content'>
                                <div>
                                    <b>
                                        <FormattedMessage id='home-header.specialty' />
                                    </b>
                                </div>
                                <div className='sub-title'>
                                    <FormattedMessage id='home-header.search-doctor' />
                                </div>
                            </div>
                            <div className='children-content'>
                                <div>
                                    <b>
                                        <FormattedMessage id='home-header.health-facility' />
                                    </b>
                                </div>
                                <div className='sub-title'>
                                    <FormattedMessage id='home-header.select-room' />
                                </div>
                            </div>
                            <div className='children-content'>
                                <div>
                                    <b>
                                        <FormattedMessage id='home-header.doctor' />
                                    </b>
                                </div>
                                <div className='sub-title'>
                                    <FormattedMessage id='home-header.select-doctor' />
                                </div>
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
                            <div className='language-vi'>VN</div>
                            <div className='language-en'>EN</div>
                        </div>
                    </div>
                </div>
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
                                    <i className='far fa-mobile-alt'></i>
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
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
