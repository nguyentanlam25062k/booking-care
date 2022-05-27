import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import ManageSchedule from '../containers/System/Doctor/ManageSchedule'
import Header from '../containers/Header/Header'
import ManagePatient from '../containers/System/Doctor/ManagePatient'
import SideBar from '../containers/SideBar/SideBar'
import _ from 'lodash'

class Doctor extends Component {
    async componentDidMount() {
        let { roleId } = this.props.userInfo
        let { userInfo } = this.props
        if (roleId === 'R2') {
            this.props.history.push(`/doctor/manage-patient`)
        } else {
            this.props.history.push(`/system/user-redux`)
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    async componentWillUnmount() {
        await this.props.history.push(`/login`)
    }

    render() {
        const { isLoggedIn } = this.props
        let roleId = this.props.userInfo.roleId
        console.log('check this.props', roleId)
        return (
            <>
                <div className='system'>
                    <SideBar roleId={roleId} />
                    <div className='system-container'>
                        {isLoggedIn && <Header />}
                        <div className='system-list container'>
                            <div className='row'>
                                <Switch>
                                    <Route path='/doctor/manage-schedule' component={ManageSchedule} />
                                    <Route path='/doctor/manage-patient' component={ManagePatient} />
                                    <Route />
                                </Switch>
                            </div>
                        </div>
                    </div>
                </div>

                {/* {isLoggedIn && <Header />}
                <div className='system-container'>
                    <div className='system-list'>
                        <Switch>
                            <Route path='/doctor/manage-schedule' component={ManageSchedule} />
                            <Route path='/doctor/manage-patient' component={ManagePatient} />
                        </Switch>
                    </div>
                </div> */}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Doctor)
