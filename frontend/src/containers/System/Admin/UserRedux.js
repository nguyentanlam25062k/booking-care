import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import _ from "lodash";
import "react-tabs/style/react-tabs.css";
import TabUser from "./TabUser";
import { BsExclamationCircle } from "react-icons/bs";
import LoadingOverlay from "react-loading-overlay";

class UserRedux extends Component {
    constructor(props) {
        super(props);

        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgUrl: "",
            isOpen: false,
            isShowLoading: false,

            email: "user01@gmail.com",
            password: "123456",
            firstName: "user",
            lastName: "02",
            phoneNumber: "01216609255",
            address: "chu se gia lai",
            gender: "",
            position: "",
            role: "",
            avatar: "",

            emailError: false,
            passwordError: false,
            firstNameError: false,
            lastNameError: false,
            phoneNumberError: false,
            addressError: false,

            action: "",
            userEditId: ""
        };
    }

    async componentDidMount() {
        this.setState({
            isShowLoading: true
        });
        await this.props.getGenderStart();
        await this.props.getPositionStart();
        await this.props.getRoleStart();

        this.setState({
            isShowLoading: false
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // _.isEqual(prevProps.roleRedux , this.props.roleRedux)
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : ""
            });
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPosition = this.props.positionRedux;
            this.setState({
                positionArr: arrPosition,
                position: arrPosition && arrPosition.length > 0 ? arrPosition[0].keyMap : ""
            });
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRole = this.props.roleRedux;
            this.setState({
                roleArr: arrRole,
                role: arrRole && arrRole.length > 0 ? arrRole[0].keyMap : ""
            });
        }

        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            let arrPosition = this.props.positionRedux;
            let arrRole = this.props.roleRedux;
            this.setState({
                email: "doctor02@gmail.com",
                password: "123456",
                firstName: "doctor",
                lastName: "02",
                phoneNumber: "01216609255",
                address: "chu se gia lai",

                // email: "",
                // password: "",
                // firstName: "",
                // lastName: "",
                // phoneNumber: "",
                // address: "",
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
                position: arrPosition && arrPosition.length > 0 ? arrPosition[0].keyMap : "",
                role: arrRole && arrRole.length > 0 ? arrRole[0].keyMap : "",
                avatar: "",
                previewImgUrl: "",
                action: CRUD_ACTIONS.CREATE
            });
        }
    }

    handleOnChangeImage = async (e) => {
        let data = e.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgUrl: objectUrl,
                avatar: base64
            });
        }
    };

    openPreviewImage = () => {
        if (!this.state.previewImgUrl) return;
        this.setState({
            isOpen: true
        });
    };

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ["email", "password", "firstName", "lastName", "phoneNumber", "address"];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                // alert(`missing ${arrCheck[i]}`)
                this.setState({
                    [`${arrCheck[i]}Error`]: true
                });
            } else {
                this.setState({
                    [`${arrCheck[i]}Error`]: false
                });
            }
        }
        return {
            isValid
        };
    };

    onChangeInput = (e, id) => {
        let copyState = {
            ...this.state
        };
        copyState[id] = e.target.value;
        this.setState({
            ...copyState
        });
    };

    handleSaveUser = () => {
        let checkInput = this.checkValidateInput();
        console.log(checkInput);
        if (!checkInput.isValid) return;
        let {
            userEditId: id,
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
            gender,
            position: positionId,
            role: roleId,
            action,
            avatar
        } = this.state;

        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewUser({
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                address,
                gender,
                positionId,
                roleId,
                avatar
            });
        }

        if (action === CRUD_ACTIONS.EDIT) {
            this.props.editUserRedux({
                id,
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                address,
                gender,
                positionId,
                roleId,
                avatar
            });
        }
    };

    handleEditUserFromParent = (user) => {
        let imageBase64 = "";
        if (user.image) {
            imageBase64 = new Buffer(user.image, "base64").toString("binary");
        }
        this.setState({
            password: "HARD CODE",
            email: user.email,
            firstName: user.firstName ? user.firstName : "",
            lastName: user.lastName ? user.lastName : "",
            phoneNumber: user.phoneNumber ? user.phoneNumber : "",
            address: user.address ? user.address : "",
            gender: user.gender ? user.gender : "",
            position: user.positionId ? user.positionId : "",
            role: user.roleId ? user.roleId : "",
            userEditId: user.id ? user.id : "",
            avatar: imageBase64,

            emailError: false,
            passwordError: false,
            firstNameError: false,
            lastNameError: false,
            phoneNumberError: false,
            addressError: false,

            previewImgUrl: imageBase64,
            action: CRUD_ACTIONS.EDIT
        });
    };

    render() {
        let genders = this.state.genderArr;
        let positions = this.state.positionArr;
        let roles = this.state.roleArr;

        console.log("this.state", this.state);
        let language = this.props.language;
        let { email, password, firstName, lastName, phoneNumber, address, position, gender, role } = this.state;
        let { emailError, passwordError, firstNameError, lastNameError, phoneNumberError, addressError } = this.state;
        let { isShowLoading } = this.state;

        return (
            <LoadingOverlay active={isShowLoading} spinner text="Loading...">
                <div className="user-redux-container">
                    <div className="user-redux-body">
                        <div className="container">
                            <div className="title"> Quản lí tài khoản </div>
                            <div className="row">
                                <div className="col-12 mb-3 heading">
                                    {/* <FormattedMessage id='manage-user.add' /> */}
                                    Thêm mới người dùng
                                </div>
                                <div className="col-12"></div>
                                <div className="col-3">
                                    <div className={emailError ? "form-group error" : "form-group"}>
                                        <label>
                                            <FormattedMessage id="manage-user.email" />
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={email}
                                            onChange={(e) => this.onChangeInput(e, "email")}
                                            disabled={this.state.action === CRUD_ACTIONS.EDIT}
                                            placeholder={emailError ? "" : "Email"}
                                        />
                                        <span className="error-icon">
                                            <BsExclamationCircle />
                                        </span>
                                        <span className="error-message">Missing email</span>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className={passwordError ? "form-group error" : "form-group"}>
                                        <label>
                                            <FormattedMessage id="manage-user.password" />
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => this.onChangeInput(e, "password")}
                                            disabled={this.state.action === CRUD_ACTIONS.EDIT}
                                            placeholder={emailError ? "" : "Password"}
                                        />
                                        <span className="error-icon">
                                            <BsExclamationCircle />
                                        </span>
                                        <span className="error-message">Missing password</span>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className={firstNameError ? "form-group error" : "form-group"}>
                                        <label>
                                            <FormattedMessage id="manage-user.first-name" />
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={firstName}
                                            onChange={(e) => this.onChangeInput(e, "firstName")}
                                            placeholder={emailError ? "" : "First name"}
                                        />
                                        <span className="error-icon">
                                            <BsExclamationCircle />
                                        </span>
                                        <span className="error-message">Missing firstName</span>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className={lastNameError ? "form-group error" : "form-group"}>
                                        <label>
                                            <FormattedMessage id="manage-user.last-name" />
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={lastName}
                                            onChange={(e) => this.onChangeInput(e, "lastName")}
                                            placeholder={emailError ? "" : "Last name"}
                                        />
                                        <span className="error-icon">
                                            <BsExclamationCircle />
                                        </span>
                                        <span className="error-message">Missing lastName</span>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className={phoneNumberError ? "form-group error" : "form-group"}>
                                        <label>
                                            <FormattedMessage id="manage-user.phone-number" />
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={phoneNumber}
                                            onChange={(e) => this.onChangeInput(e, "phoneNumber")}
                                            placeholder={emailError ? "" : "Phone number"}
                                        />
                                        <span className="error-icon">
                                            <BsExclamationCircle />
                                        </span>
                                        <span className="error-message">Missing phoneNumber</span>
                                    </div>
                                </div>
                                <div className="col-9">
                                    <div className={addressError ? "form-group error" : "form-group"}>
                                        <label>
                                            <FormattedMessage id="manage-user.address" />
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={address}
                                            onChange={(e) => this.onChangeInput(e, "address")}
                                            placeholder={emailError ? "" : "Address"}
                                        />
                                        <span className="error-icon">
                                            <BsExclamationCircle />
                                        </span>
                                        <span className="error-message">Missing address</span>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <label>
                                        <FormattedMessage id="manage-user.gender" />
                                    </label>
                                    <select
                                        className="form-control"
                                        value={gender}
                                        onChange={(e) => this.onChangeInput(e, "gender")}
                                    >
                                        {genders &&
                                            genders.length > 0 &&
                                            genders.map((item, index) => (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="col-3">
                                    <label>
                                        <FormattedMessage id="manage-user.position" />
                                    </label>
                                    <select
                                        className="form-control"
                                        value={position}
                                        onChange={(e) => this.onChangeInput(e, "position")}
                                    >
                                        {positions &&
                                            positions.length > 0 &&
                                            positions.map((item, index) => (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="col-3">
                                    <label>
                                        <FormattedMessage id="manage-user.role" />
                                    </label>
                                    <select
                                        className="form-control"
                                        value={role}
                                        onChange={(e) => this.onChangeInput(e, "role")}
                                    >
                                        {roles &&
                                            roles.length > 0 &&
                                            roles.map((item, index) => (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="col-3">
                                    <label>
                                        <FormattedMessage id="manage-user.image" />
                                    </label>
                                    <div className="preview-container-img">
                                        <input
                                            type="file"
                                            id="previewImg"
                                            hidden
                                            onChange={(e) => this.handleOnChangeImage(e)}
                                        />
                                        <label className="label-upload" htmlFor="previewImg">
                                            Tải ảnh <i className="fas fa-upload"> </i>
                                        </label>
                                        <div
                                            className="preview-image mt-2"
                                            style={{
                                                backgroundImage: `url(${this.state.previewImgUrl})`
                                            }}
                                            onClick={() => this.openPreviewImage()}
                                        ></div>
                                    </div>
                                </div>
                                <div
                                    className="col-12 mb-3"
                                    style={{
                                        marginTop: "-30px"
                                    }}
                                >
                                    <button
                                        className={
                                            this.state.action === CRUD_ACTIONS.EDIT
                                                ? "btn btn-warning"
                                                : "btn btn-primary"
                                        }
                                        onClick={() => this.handleSaveUser()}
                                    >
                                        {this.state.action === CRUD_ACTIONS.EDIT ? (
                                            <>
                                                <i className="fas fa-check"></i>
                                                <FormattedMessage id="manage-user.edit" />
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-plus"></i>
                                                <FormattedMessage id="manage-user.save" />
                                            </>
                                        )}
                                    </button>
                                </div>
                                {/* <div className='col-12 mb-5'>
                                <TableManageUser handleEditUserFromParent={this.handleEditUserFromParent} />
                            </div> */}
                                <div className="col-12">
                                    <TabUser handleEditUserFromParent={this.handleEditUserFromParent} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.isOpen === true && (
                        <Lightbox
                            mainSrc={this.state.previewImgUrl}
                            onCloseRequest={() =>
                                this.setState({
                                    isOpen: false
                                })
                            }
                        />
                    )}
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        editUserRedux: (data) => dispatch(actions.editUser(data))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
