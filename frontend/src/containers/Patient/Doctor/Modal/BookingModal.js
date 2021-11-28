import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import './BookingModal.scss'

class BookingModal extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    render() {
        // toggle={}
        let { isOpenModal, closeBookingModal, dataTime } = this.props
        return (
            <Modal isOpen={isOpenModal} className={'booking-modal-container'} size='lg' centered>
                <div className='booking-modal-content'>
                    <div className='booking-modal-header'>
                        <span className='left'>Thông tin đặt lịch khám bệnh</span>
                        <span className='right' onClick={() => closeBookingModal()}>
                            <i className='fas fa-times'></i>
                        </span>
                    </div>
                    <div className='booking-modal-body'>
                        {/* {JSON.stringify(dataTime)} */}
                        <div className='doctor-info'></div>
                        <div className='price'>Giá khám 500.000VND</div>
                        <div className='row'>
                            <div className='col-6 form-group'>
                                <labe>Họ tên</labe>
                                <input type='text' className='form-control' />
                            </div>
                            <div className='col-6 form-group'>
                                <labe>Số điện thoại</labe>
                                <input type='text' className='form-control' />
                            </div>
                            <div className='col-6 form-group'>
                                <labe>Địa chỉ Email</labe>
                                <input type='text' className='form-control' />
                            </div>
                            <div className='col-6 form-group'>
                                <labe>Địa chỉ liên hệ</labe>
                                <input type='text' className='form-control' />
                            </div>
                            <div className='col-12 form-group'>
                                <labe>Lý do khám</labe>
                                <input type='text' className='form-control' />
                            </div>
                            <div className='col-6 form-group'>
                                <labe>Đặt cho ai</labe>
                                <input type='text' className='form-control' />
                            </div>
                            <div className='col-6 form-group'>
                                <labe>Giới tính</labe>
                                <input type='text' className='form-control' />
                            </div>
                        </div>
                    </div>
                    <div className='booking-modal-footer'>
                        <button className='btn-booking-confirm' onClick={() => closeBookingModal()}>
                            Xác nhận
                        </button>
                        <button className='btn-booking-cancel' onClick={() => closeBookingModal()}>
                            Hủy
                        </button>
                    </div>
                </div>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal)
