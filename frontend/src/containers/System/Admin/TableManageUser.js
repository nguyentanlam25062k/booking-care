import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./TableManageUser.scss";
import { getUserByRole } from "../../../services/userService";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
class TableManageUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUser: []
        };
    }

    async componentDidMount() {
        let { dataUserFromParent } = this.props;
        this.setState({
            arrUser: dataUserFromParent
        });
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.dataUserFromParent !== this.props.dataUserFromParent) {
            this.setState({
                arrUser: this.props.dataUserFromParent
            });
        }
    }

    handleDeleteUser = async (user) => {
        this.props.deleteUserRedux(user.id);
    };

    handleEditUser = (user) => {
        this.props.handleEditUserFromParent(user);
    };

    handleSortUser = (user, type) => {
        if (type === "email") {
            console.log("check item", user[0].email.split("@")[0]);
            this.setState({
                arrUser: user.sort((a, b) => a[type].split("@")[0].localeCompare(b[type].split("@")[0]))
            });
        } else if (type === "address") {
            this.setState({
                arrUser: user.sort((a, b) => a[type].localeCompare(b[type]))
            });
        } else {
            this.setState({
                arrUser: user.sort((a, b) => a[type] - b[type])
            });
        }
    };

    handleReverseSortUser = (user, type) => {
        if (type === "email") {
            this.setState({
                arrUser: user.sort((a, b) => b[type].split("@")[0].localeCompare(a[type].split("@")[0]))
            });
        } else if (type === "address") {
            this.setState({
                arrUser: user.sort((a, b) => b[type].localeCompare(a[type]))
            });
        } else {
            this.setState({
                arrUser: user.sort((a, b) => b[type] - a[type])
            });
        }
    };

    render() {
        let { arrUser } = this.state;
        return (
            <>
                <table className="TableManageUser">
                    <tbody>
                        <tr>
                            <th>
                                #
                                <span className="btn-sort up" onClick={() => this.handleSortUser(arrUser, "id")}>
                                    <BsFillCaretUpFill />
                                </span>
                                <span
                                    className="btn-sort down"
                                    onClick={() => this.handleReverseSortUser(arrUser, "id")}
                                >
                                    <BsFillCaretDownFill />
                                </span>
                            </th>
                            <th>
                                ID - Họ tên
                                <span className="btn-sort up" onClick={() => this.handleSortUser(arrUser, "id")}>
                                    <BsFillCaretUpFill />
                                </span>
                                <span
                                    className="btn-sort down"
                                    onClick={() => this.handleReverseSortUser(arrUser, "id")}
                                >
                                    <BsFillCaretDownFill />
                                </span>
                            </th>
                            <th>
                                Số điện thoại
                                <span
                                    className="btn-sort up"
                                    onClick={() => this.handleSortUser(arrUser, "phoneNumber")}
                                >
                                    <BsFillCaretUpFill />
                                </span>
                                <span
                                    className="btn-sort down"
                                    onClick={() => this.handleReverseSortUser(arrUser, "phoneNumber")}
                                >
                                    <BsFillCaretDownFill />
                                </span>
                            </th>
                            <th>
                                Email
                                <span className="btn-sort up" onClick={() => this.handleSortUser(arrUser, "email")}>
                                    <BsFillCaretUpFill />
                                </span>
                                <span
                                    className="btn-sort down"
                                    onClick={() => this.handleReverseSortUser(arrUser, "email")}
                                >
                                    <BsFillCaretDownFill />
                                </span>
                            </th>
                            <th>
                                Address
                                <span className="btn-sort up" onClick={() => this.handleSortUser(arrUser, "address")}>
                                    <BsFillCaretUpFill />
                                </span>
                                <span
                                    className="btn-sort down"
                                    onClick={() => this.handleReverseSortUser(arrUser, "address")}
                                >
                                    <BsFillCaretDownFill />
                                </span>
                            </th>
                            <th>Actions</th>
                        </tr>
                        {arrUser &&
                            arrUser.length > 0 &&
                            arrUser.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <div>{index + 1}</div>
                                    </td>
                                    <td>{`${item.id} - ${item?.lastName ? item.lastName : ""} ${item?.firstName}`}</td>
                                    <td>{item.phoneNumber}</td>
                                    <td>{item.email}</td>
                                    <td>{item.address}</td>
                                    <td>
                                        <button className="btn btn-edit" onClick={() => this.handleEditUser(item)}>
                                            <i className="fas fa-pencil-alt" style={{ marginRight: "5px" }}></i>
                                            Chỉnh sửa
                                        </button>
                                        <button className="btn btn-delete" onClick={() => this.handleDeleteUser(item)}>
                                            <i className="fas fa-trash" style={{ marginRight: "5px" }}></i>
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteUserRedux: (id) => dispatch(actions.deleteUser(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
