import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import './TableManageUser.scss'
// import ModalEditUser from './ModalEditUser'

class TableManageUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            usersRedux: []
        }
    }

    componentDidMount() {
        this.props.fetchUserRedux()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                usersRedux: this.props.listUsers
            })
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteUserRedux(user.id)
    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParent(user)
    }

    render() {
        let arrUsers = this.state.usersRedux
        return (
            <table id='TableManageUser'>
                <tbody>
                    <tr>
                        <th>Email</th>
                        <th>firstName</th>
                        <th>lastName</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                    {arrUsers &&
                        arrUsers.length > 0 &&
                        arrUsers.map((item, index) => (
                            <tr key={index}>
                                <td>{item.email}</td>
                                <td>{item.firstName}</td>
                                <td>{item.lastName}</td>
                                <td>{item.address}</td>
                                <td>
                                    <button className='btn-edit' onClick={() => this.handleEditUser(item)}>
                                        <i className='fas fa-pencil-alt'></i>
                                    </button>
                                    <button className='btn-delete' onClick={() => this.handleDeleteUser(item)}>
                                        <i className='fas fa-trash'></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        listUsers: state.admin.users
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteUserRedux: (id) => dispatch(actions.deleteUser(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser)
