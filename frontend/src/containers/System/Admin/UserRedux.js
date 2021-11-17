import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { getAllCodeService } from '../../../services/userService'
import { LANGUAGES } from '../../../utils'
import * as actions from '../../../store/actions'
import './UserRedux.scss'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import TableManageUser from './TableManageUser'
class UserRedux extends Component {
    constructor(props) {
        super(props)

        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgUrl: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: ''
        }
    }

    async componentDidMount() {
        this.props.getGenderStart()
        this.props.getPositionStart()
        this.props.getRoleStart()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].key : ''
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPosition = this.props.positionRedux
            this.setState({
                positionArr: arrPosition,
                position: arrPosition && arrPosition.length > 0 ? arrPosition[0].key : ''
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRole = this.props.roleRedux
            this.setState({
                roleArr: arrRole,
                role: arrRole && arrRole.length > 0 ? arrRole[0].key : ''
            })
        }

        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: '',
                position: '',
                role: '',
                avatar: ''
            })
        }
    }

    handleOnChangeImage = (e) => {
        let data = e.target.files
        let file = data[0]
        if (file) {
            let objectUrl = URL.createObjectURL(file)
            this.setState({
                previewImgUrl: objectUrl,
                avatar: file
            })
        }
    }

    openPreviewImage = () => {
        if (!this.state.isOpen) return
        this.setState({
            isOpen: true
        })
    }

    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber']
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false
                alert(`this input is required: ${arrCheck[i]}`)
                break
            }
        }
        return isValid
    }

    onChangeInput = (e, id) => {
        let copyState = {
            ...this.state
        }
        copyState[id] = e.target.value
        this.setState({
            ...copyState
        })
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput()
        if (!isValid) return

        let {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
            gender,
            position: positionId,
            role: roleId
        } = this.state

        this.props.createNewUser({
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            address,
            gender,
            positionId,
            roleId
        })
    }

    render() {
        let genders = this.state.genderArr
        let positions = this.state.positionArr
        let roles = this.state.roleArr
        let language = this.props.language

        let { email, password, firstName, lastName, phoneNumber, address, position, avatar } = this.state

        return (
            <div className='user-redux-container'>
                <div className='title'> Learn Redux with hoi dan IT Chanel </div>
                <div className='user-redux-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'>
                                <FormattedMessage id='manage-user.add' />
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.email' />
                                </label>
                                <input
                                    type='email'
                                    className='form-control'
                                    value={email}
                                    onChange={(e) => this.onChangeInput(e, 'email')}
                                />
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.password' />
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={password}
                                    onChange={(e) => this.onChangeInput(e, 'password')}
                                />
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.first-name' />
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={firstName}
                                    onChange={(e) => this.onChangeInput(e, 'firstName')}
                                />
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.last-name' />
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={lastName}
                                    onChange={(e) => this.onChangeInput(e, 'lastName')}
                                />
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.phone-number' />
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={phoneNumber}
                                    onChange={(e) => this.onChangeInput(e, 'phoneNumber')}
                                />
                            </div>
                            <div className='col-9'>
                                <label>
                                    <FormattedMessage id='manage-user.address' />
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={address}
                                    onChange={(e) => this.onChangeInput(e, 'address')}
                                />
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.gender' />
                                </label>
                                <select className='form-control' onChange={(e) => this.onChangeInput(e, 'gender')}>
                                    {genders &&
                                        genders.length > 0 &&
                                        genders.map((item, index) => (
                                            <option key={index} value={item.key}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.position' />
                                </label>
                                <select className='form-control' onChange={(e) => this.onChangeInput(e, 'position')}>
                                    {positions &&
                                        positions.length > 0 &&
                                        positions.map((item, index) => (
                                            <option key={index} value={item.key}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.role' />
                                </label>
                                <select className='form-control' onChange={(e) => this.onChangeInput(e, 'role')}>
                                    {roles &&
                                        roles.length > 0 &&
                                        roles.map((item, index) => (
                                            <option key={index} value={item.key}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.image' />
                                </label>
                                <div className='preview-container-img'>
                                    <input
                                        type='file'
                                        id='previewImg'
                                        hidden
                                        onChange={(e) => this.handleOnChangeImage(e)}
                                    />
                                    <label className='label-upload' htmlFor='previewImg'>
                                        Tải ảnh <i className='fas fa-upload'> </i>
                                    </label>
                                    <div
                                        className='preview-image mt-2'
                                        style={{
                                            backgroundImage: `url(${this.state.previewImgUrl})`
                                        }}
                                        onClick={() => this.openPreviewImage()}
                                    ></div>
                                </div>
                            </div>
                            <div className='col-12 my-3' onClick={() => this.handleSaveUser()}>
                                <div className='btn btn-primary'>
                                    <FormattedMessage id='manage-user.save' />
                                </div>
                            </div>
                            <div className='col-12 mb-5'>
                                <TableManageUser />
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
        )
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
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux)
