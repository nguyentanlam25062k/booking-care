import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from "../../services/userService";
import ModalUser from "./ModalUser";
import { emitter } from "../../utils/emitter";

import "./UserManage.scss";
import ModalEditUser from "./ModalEditUser";
import { LANGUAGES } from "../../utils";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {}
        };
    }

    async componentDidMount() {
        await this.getAllUsers();
    }

    getAllUsers = async () => {
        let response = await getAllUsers("ALL");
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            });
        }
    };

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        });
    };

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        });
    };

    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        });
    };

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUsers("ALL");
                this.setState({
                    isOpenModalUser: false
                });
                emitter.emit("EVENT_CLEAR_MODAL_DATA");
            }
        } catch (e) {
            console.log(e);
        }
    };

    handleDeleteUser = async (user) => {
        try {
            let res = await deleteUserService(user.id);
            if (res && res.errCode === 0) {
                await this.getAllUsers("ALL");
            } else {
                alert(res.errMessage);
            }
        } catch (e) {
            console.log(e);
        }
    };

    handleEditUser = async (user) => {
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user
        });
    };

    doEditUser = async (user) => {
        try {
            let res = await editUserService(user);
            console.log(">>>do edit user", res);
            if (res && res.errCode === 0) {
                this.setState({
                    isOpenModalEditUser: false
                });
                await this.getAllUsers();
            } else {
                alert(res.errCode);
            }
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        let { language } = this.props;
        let arrUsers = this.state.arrUsers;
        return (
            <>
                <div className="users-container">
                    <ModalUser
                        isOpen={this.state.isOpenModalUser}
                        toggleUserModal={this.toggleUserModal}
                        createNewUser={this.createNewUser}
                    />
                    {this.state.isOpenModalEditUser && (
                        <ModalEditUser
                            isOpen={this.state.isOpenModalEditUser}
                            toggleUserEditModal={this.toggleUserEditModal}
                            currentUser={this.state.userEdit}
                            editUser={this.doEditUser}
                            // createNewUser={this.createNewUser}
                        />
                    )}
                    <div className="title text-center">Manage users</div>
                    <div>
                        <button
                            className="btn btn-primary px-3"
                            onClick={() => {
                                this.handleAddNewUser();
                            }}
                        >
                            <i className="fas fa-plus"></i> Add new user
                        </button>
                    </div>
                    <div className="user-table mt-3">
                        <table className="customers" border="0" cellSpacing="0" cellPadding="0">
                            <tbody>
                                <tr>
                                    <th>Email</th>
                                    <th>firstName</th>
                                    <th>lastName</th>
                                    <th>Address</th>
                                    <th>Position</th>
                                    <th>Actions</th>
                                </tr>
                                {arrUsers &&
                                    arrUsers.map((item, index) => {
                                        let positionValue =
                                            language === LANGUAGES.VI
                                                ? item.positionData.valueVi
                                                : item.positionData.valueEn;
                                        return (
                                            <tr key={index}>
                                                <td>{item.email}</td>
                                                <td>{item.firstName}</td>
                                                <td>{item.lastName}</td>
                                                <td>{item.address}</td>
                                                <td>
                                                    <span className="customers-position">{positionValue}</span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => this.handleEditUser(item)}
                                                    >
                                                        <i className="fas fa-pencil-alt"></i>
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => this.handleDeleteUser(item)}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="users-tab">
                    <Tabs>
                        <TabList>
                            <Tab>Title 1</Tab>
                            <Tab>Title 2</Tab>
                        </TabList>

                        <TabPanel>
                            <h2>Any content 1</h2>
                        </TabPanel>
                        <TabPanel>
                            <h2>Any content 2</h2>
                        </TabPanel>
                    </Tabs>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
