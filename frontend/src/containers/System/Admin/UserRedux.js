import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { getAllCodeService } from '../../../services/userService'
import { LANGUAGES } from '../../../utils'
import * as actions from '../../../store/actions'

class UserRedux extends Component {
    constructor(props) {
        super(props)
        this.state = {
            genderArr: []
        }
    }
    async componentDidMount() {
        this.props.getGenderStart()
        // try {
        //     let res = await getAllCodeService('gender')
        //     if (res && res.errCode === 0) {
        //         this.setState({
        //             genderArr: res.data
        //         })
        //     }
        //     // console.log('>>> check res:', res)
        // } catch (e) {
        //     console.log(e)
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            this.setState({
                genderArr: this.props.genderRedux
            })
        }
    }

    render() {
        let genders = this.state.genderArr
        let language = this.props.language
        console.log('check props from redux:', this.props.genderRedux)
        return (
            <div className='user-redux-container'>
                <div className='title'>Learn Redux with hoi dan IT Chanel</div>
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
                                <input type='email' className='form-control' />
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.password' />
                                </label>
                                <input type='text' className='form-control' />
                            </div>

                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.firs-name' />
                                </label>
                                <input type='text' className='form-control' />
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.last-name' />
                                </label>
                                <input type='text' className='form-control' />
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.phone-number' />
                                </label>
                                <input type='text' className='form-control' />
                            </div>
                            <div className='col-9'>
                                <label>
                                    <FormattedMessage id='manage-user.address' />
                                </label>
                                <input type='text' className='form-control' />
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.gender' />
                                </label>
                                <select className='form-control'>
                                    {genders &&
                                        genders.length > 0 &&
                                        genders.map((item, index) => (
                                            <option key={index}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        ))}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.position' />
                                </label>
                                <select className='form-control'>
                                    <option selected>...</option>
                                    <option value=''></option>
                                </select>
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.role' />
                                </label>
                                <select className='form-control'>
                                    <option selected>...</option>
                                    <option value=''></option>
                                </select>
                            </div>
                            <div className='col-3'>
                                <label>
                                    <FormattedMessage id='manage-user.image' />
                                </label>
                                <input type='text' className='form-control' />
                            </div>
                            <div className='col-12 mt-3'>
                                <div className='btn btn-primary'>
                                    <FormattedMessage id='manage-user.save' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux)
