import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import * as actions from '../../../store/actions'

import './TabUser.scss'
import TableManageUser from './TableManageUser'
import { getAllUsers, getUserByRole } from '../../../services/userService'

class TabUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toggleState: 1,
            listUser: []
        }
    }

    async componentDidMount() {
        this.props.fetchUserRedux()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                listUser: this.props.listUsers
            })
        }
    }

    toggleTab = (index) => {
        this.setState({
            toggleState: index
        })
    }

    handleDataContentTab = () => {
        let { listUser } = this.state

        let userGroupByRole = []
        if (listUser?.length) {
            let listRole = listUser
                .map((item) => item.roleId)
                .filter((item, index, array) => array.indexOf(item) === index)
                .reverse()
            userGroupByRole = listRole.map((item) => {
                let result = {
                    roleId: item,
                    user: []
                }
                for (let i = 0; i < listUser.length; i++) {
                    if (item === listUser[i].roleId) {
                        result.user.push({ ...listUser[i] })
                    }
                }
                return result
            })
        }
        return userGroupByRole
    }

    render() {
        let { toggleState } = this.state
        let { roleRedux, handleEditUserFromParent } = this.props
        let userGroupByRole = this.handleDataContentTab()

        return (
            <div className='table-user'>
                <div className='containers'>
                    <div className='bloc-tabs'>
                        {roleRedux?.length > 0 &&
                            roleRedux.map((item, index) => (
                                <button
                                    key={index}
                                    className={toggleState === index + 1 ? 'tabs active-tabs' : 'tabs'}
                                    onClick={() => this.toggleTab(index + 1)}
                                >
                                    {item.valueVi}
                                </button>
                            ))}
                    </div>

                    <div className='content-tabs'>
                        {roleRedux?.length > 0 &&
                            roleRedux.map((item, index) => {
                                for (let i = 0; i < userGroupByRole.length; i++) {
                                    if (userGroupByRole[i].roleId === item.keyMap) {
                                        return (
                                            <div
                                                key={index}
                                                className={
                                                    toggleState === index + 1 ? 'content  active-content' : 'content'
                                                }
                                            >
                                                <TableManageUser
                                                    dataUserFromParent={userGroupByRole[i].user}
                                                    handleEditUserFromParent={handleEditUserFromParent}
                                                />
                                            </div>
                                        )
                                    }
                                }
                            })}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        roleRedux: state.admin.roles,
        listUsers: state.admin.users
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabUser)
