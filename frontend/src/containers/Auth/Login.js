import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import * as actions from '../../store/actions'
import Girl from '../.././assets/bookingcare-2020.svg'
import './Login.scss'
import { handleLoginApi } from '../../services/userService'
import { withRouter } from 'react-router'
import { FaFacebookF, FaGoogle } from 'react-icons/fa'
class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: ''
        }
    }

    handleOnChangeUserName = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    handleOnChangePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    handleLogin = async (e) => {
        // e.preventDefault()
        this.setState({
            errMessage: ''
        })
        let { username, password } = this.state
        try {
            let data = await handleLoginApi(username, password)

            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user)
                this.setState({
                    errMessage: data.message
                })
            }
        } catch (e) {
            if (e.response) {
                if (e.response.data) {
                    this.setState({
                        errMessage: e.response.data.message
                    })
                }
            }
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleLogin()
        }
    }

    render() {
        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-login'>Login</div>
                        <div className='col-12 form-group login-input'>
                            {/* <label>User name:</label> */}
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Enter your username'
                                value={this.state.username}
                                onChange={(e) => this.handleOnChangeUserName(e)}
                            />
                        </div>
                        <div className='col-12 form-group login-input'>
                            {/* <label>Password:</label> */}
                            <div className='custom-input-password'>
                                <input
                                    type={this.state.isShowPassword ? 'text' : 'password'}
                                    className='form-control'
                                    placeholder='Enter your password'
                                    value={this.state.password}
                                    onChange={(e) => this.handleOnChangePassword(e)}
                                    onKeyDown={(e) => this.handleKeyDown(e)}
                                />
                                <span onClick={() => this.handleShowHidePassword()}>
                                    <i
                                        className={this.state.isShowPassword ? 'fas fa-eye' : 'fas fa-eye-slash'}
                                        style={{
                                            color: '#00000050'
                                        }}
                                    ></i>
                                </span>
                            </div>
                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            {this.state.errMessage}
                        </div>
                        <div className='col-12'>
                            <button className='btn-login' onClick={(e) => this.handleLogin(e)}>
                                Login
                            </button>
                        </div>
                        <div className='col-12'>
                            <span className='forgot-password'>Forgot password ?</span>
                        </div>
                        <span className='text-other-login'>Or login with:</span>

                        <div className='col-12 social-login'>
                            <div className='google'>
                                <FaFacebookF />
                            </div>
                            <div className='facebook'>
                                <FaGoogle />
                            </div>

                            {/* <i className='fab fa-google-plus-g google'></i>
                            <i className='fab fa-facebook-f facebook'></i> */}
                        </div>
                    </div>
                    <div className='login-content-right'>
                        <div
                            className='logo'
                            // style={{
                            //     background: URL(`${Girl}`)
                            // }}
                        >
                            <img src={Girl} alt='' />
                        </div>
                        <div className='text'>
                            BookingCare là Nền tảng Y tế Chăm sóc sức khỏe toàn diện kết nối người dùng với dịch vụ y tế
                            - chăm sóc sức khỏe hiệu quả, tin cậy
                        </div>
                        <div className='signature-first-name'>--- hom nay tao buon ---</div>
                        <div className='signature-last-name'>lam</div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
