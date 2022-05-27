import React, { Component } from 'react'
import { connect } from 'react-redux'
import './ManagePatient.scss'
import DatePicker from '../../../components/Input/DatePicker'
import { getAllPatientForDoctor, postSendRemedy } from '../../../services/userService'
import moment from 'moment'
import { LANGUAGES } from '../../../utils'
import RemedyModal from './RemedyModal'
import { toast } from 'react-toastify'
import LoadingOverlay from 'react-loading-overlay'

class ManagePatient extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {},
            isShowLoading: false,
            toggleTab: 1
        }
    }

    async componentDidMount() {
        this.getDataPatient()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    getDataPatient = async () => {
        let { user } = this.props
        let { currentDate } = this.state
        let formattedDate = new Date(currentDate).getTime()

        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formattedDate
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState(
            {
                currentDate: date[0]
            },
            async () => {
                await this.getDataPatient()
            }
        )
    }

    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName
        }
        console.log(data)
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state
        let { language } = this.props
        this.setState({
            isShowLoading: true
        })
        let res = await postSendRemedy({
            email: dataChild.email,
            imageBase64: dataChild.imageBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: language,
            patientName: dataModal.patientName
        })
        this.setState({
            isShowLoading: false
        })
        if (res && res.errCode === 0) {
            toast.success('send remedy success!')
            await this.getDataPatient()
            this.closeRemedyModal()
        } else {
            toast.error('something went wrong...!')
            console.log('error send remedy', res)
        }
    }

    toggleTab = (index) => {
        this.setState({
            toggleTab: index
        })
    }

    render() {
        let { dataPatient, isOpenRemedyModal, dataModal, isShowLoading, toggleTab } = this.state
        let { language } = this.props
        return (
            <>
                <LoadingOverlay active={isShowLoading} spinner text='Loading...'>
                    <div className='manage-patient-container container py-15'>
                        <div className='ms-header'>
                            <div className='ms-title manage-title'>
                                <i
                                    className='far fa-calendar-alt'
                                    style={{
                                        marginRight: '5px'
                                    }}
                                ></i>
                                Quản lí bệnh nhân
                            </div>
                            <div className='ms-heading manage-heading mb-5'>Tạo mới thông tin bệnh nhân</div>
                        </div>
                        <div className='manage-patient-body'>
                            <div className='col-4 form-group'>
                                <label>Chọn ngày khám</label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className='form-control'
                                    value={this.state.currentDate}
                                />
                            </div>

                            {/* =========== MODAL ===========*/}
                            <div className='tab-container mt-5'>
                                <div className='modal-tab-header'>
                                    <button
                                        className={toggleTab === 1 ? 'modal-tab active' : 'modal-tab'}
                                        onClick={() => this.toggleTab(1)}
                                    >
                                        Cần xác nhận (1)
                                    </button>
                                    <button
                                        className={toggleTab === 2 ? 'modal-tab active' : 'modal-tab'}
                                        onClick={() => this.toggleTab(2)}
                                    >
                                        Đã xác nhận (2)
                                    </button>
                                    <button
                                        className={toggleTab === 3 ? 'modal-tab active' : 'modal-tab'}
                                        onClick={() => this.toggleTab(3)}
                                    >
                                        Đã hủy (1)
                                    </button>
                                </div>

                                <div className='content-tabs'>
                                    <div className={toggleTab === 1 ? 'modal-info  active' : 'modal-info'}>
                                        <div className='col-12 table-manage-patient mt-2'>
                                            <table style={{ width: '100%' }}>
                                                <tbody>
                                                    <tr>
                                                        <th>Stt</th>
                                                        <th>Thời gian</th>
                                                        <th>Họ và tên</th>
                                                        <th>Địa chỉ</th>
                                                        <th>Giới tính</th>
                                                        <th>Actions</th>
                                                    </tr>

                                                    {dataPatient && dataPatient.length > 0 ? (
                                                        dataPatient.map((item, index) => {
                                                            let time =
                                                                language === LANGUAGES.VI
                                                                    ? item.timeTypeDataPatient.valueVi
                                                                    : item.timeTypeDataPatient.valueEn
                                                            let gender =
                                                                language === LANGUAGES.VI
                                                                    ? item.patientData.genderData.valueVi
                                                                    : item.patientData.genderData.valueEn

                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{time}</td>
                                                                    <td>{item.patientData.firstName}</td>
                                                                    <td>{item.patientData.address}</td>
                                                                    <td>{gender}</td>
                                                                    <td>
                                                                        <button
                                                                            className='btn mp-btn-confirm'
                                                                            onClick={() => this.handleBtnConfirm(item)}
                                                                        >
                                                                            Xác nhận
                                                                        </button>
                                                                        <button
                                                                            className='btn mp-btn-remedy'
                                                                            onClick={() => this.handleBtnRemedy(item)}
                                                                        >
                                                                            Gửi hóa đơn
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan='6'
                                                                style={{
                                                                    height: '100px',
                                                                    fontSize: '16px'
                                                                }}
                                                            >
                                                                No data
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className={toggleTab === 2 ? 'modal-info  active' : 'modal-info'}>
                                        <div className='col-12 table-manage-patient mt-2'>
                                            <table style={{ width: '100%' }}>
                                                <tbody>
                                                    <tr>
                                                        <th>Stt</th>
                                                        <th>Thời gian</th>
                                                        <th>Họ và tên</th>
                                                        <th>Giới tính</th>
                                                        <th>Giới tính</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                    {dataPatient && dataPatient.length > 0 ? (
                                                        dataPatient.map((item, index) => {
                                                            let time =
                                                                language === LANGUAGES.VI
                                                                    ? item.timeTypeDataPatient.valueVi
                                                                    : item.timeTypeDataPatient.valueEn
                                                            let gender =
                                                                language === LANGUAGES.VI
                                                                    ? item.patientData.genderData.valueVi
                                                                    : item.patientData.genderData.valueEn

                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{time}</td>
                                                                    <td>{item.patientData.firstName}</td>
                                                                    <td>{item.patientData.address}</td>
                                                                    <td>{gender}</td>
                                                                    <td>
                                                                        <button
                                                                            className='btn mp-btn-confirm'
                                                                            onClick={() => this.handleBtnConfirm(item)}
                                                                        >
                                                                            Xác nhận
                                                                        </button>
                                                                        <button
                                                                            className='btn mp-btn-remedy'
                                                                            onClick={() => this.handleBtnRemedy(item)}
                                                                        >
                                                                            Gửi hóa đơn
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan='6'
                                                                style={{
                                                                    height: '100px',
                                                                    fontSize: '16px'
                                                                }}
                                                            >
                                                                No data
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className={toggleTab === 3 ? 'modal-info  active' : 'modal-info'}>
                                        <div className='col-12 table-manage-patient mt-2'>
                                            <table style={{ width: '100%' }}>
                                                <tbody>
                                                    <tr>
                                                        <th>Stt</th>
                                                        <th>Thời gian</th>
                                                        <th>Họ và tên</th>
                                                        <th>Giới tính</th>
                                                        <th>Giới tính</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                    {dataPatient && dataPatient.length > 0 ? (
                                                        dataPatient.map((item, index) => {
                                                            let time =
                                                                language === LANGUAGES.VI
                                                                    ? item.timeTypeDataPatient.valueVi
                                                                    : item.timeTypeDataPatient.valueEn
                                                            let gender =
                                                                language === LANGUAGES.VI
                                                                    ? item.patientData.genderData.valueVi
                                                                    : item.patientData.genderData.valueEn

                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{time}</td>
                                                                    <td>{item.patientData.firstName}</td>
                                                                    <td>{item.patientData.address}</td>
                                                                    <td>{gender}</td>
                                                                    <td>
                                                                        <button
                                                                            className='btn mp-btn-confirm'
                                                                            onClick={() => this.handleBtnConfirm(item)}
                                                                        >
                                                                            Xác nhận
                                                                        </button>
                                                                        <button
                                                                            className='btn mp-btn-remedy'
                                                                            onClick={() => this.handleBtnRemedy(item)}
                                                                        >
                                                                            Gửi hóa đơn
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan='6'
                                                                style={{
                                                                    height: '100px',
                                                                    fontSize: '16px'
                                                                }}
                                                            >
                                                                No data
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <RemedyModal
                        isOpenModal={isOpenRemedyModal}
                        dataModal={dataModal}
                        closeRemedyModal={this.closeRemedyModal}
                        sendRemedy={this.sendRemedy}
                    />
                </LoadingOverlay>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        user: state.user.userInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient)
