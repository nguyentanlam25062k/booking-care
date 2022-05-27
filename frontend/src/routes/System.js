import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import UserManage from '../containers/System/UserManage'
import UserRedux from '../containers/System/Admin/UserRedux'
import Header from '../containers/Header/Header'
import ManageDoctor from '../containers/System/Admin/ManageDoctor'
import ManageSpecialty from '../containers/System/Specialty/ManageSpecialty'
import ManageClinic from '../containers/System/Clinic/ManageClinic'
import SideBar from '../containers/SideBar/SideBar'
import './System.scss'
import RouteAdmin from '../components/Route/ResolveRoute'
import ResolveRoute from '../components/Route/ResolveRoute'
import _ from 'lodash'
class System extends Component {
    async componentDidMount() {
        let { roleId } = this.props.userInfo

        if (roleId === 'R1') {
            this.props.history.push(`/system/user-redux`)
        } else {
            this.props.history.push(`/doctor/manage-patient`)
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
        const { systemMenuPath, isLoggedIn } = this.props
        let roleId = this.props.userInfo.roleId

        return (
            <div className='system'>
                <SideBar roleId={roleId} />
                <div className='system-container'>
                    {isLoggedIn && <Header />}
                    <div className='system-list container'>
                        <div className='row'>
                            <Switch>
                                <Route path='/system/user-manage' component={UserManage} />
                                <Route path='/system/user-redux' component={UserRedux} />
                                <Route path='/system/manage-doctor' component={ManageDoctor} />
                                <Route path='/system/manage-specialty' component={ManageSpecialty} />
                                <Route path='/system/manage-specialty' component={ManageSpecialty} />
                                <Route path='/system/manage-clinic' component={ManageClinic} />
                                {/*<Route path='/system/manage-schedule' component={Manage} />*/}
                                <Route path='/system/:id' component={UserRedux} />

                                {/*<ResolveRoute role='R1' path='/system/route-admin' component={RouteAdmin} />*/}
                                {/*<Route*/}
                                {/*    component={() => {*/}
                                {/*        return <Redirect to={systemMenuPath} />*/}
                                {/*    }}*/}
                                {/*/>*/}
                            </Switch>
                        </div>
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(System)
