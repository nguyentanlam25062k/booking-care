import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
import './RemedyModal.scss'
import * as actions from '../../../store/actions'
import { CommonUtils } from '../../../utils'

class RemedyModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            imageBase64: ''
        }
    }

    async componentDidMount() {
        if (this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataModal !== this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    handleOnChangeEmail = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    handleOnChangeImage = async (e) => {
        let data = e.target.files
        let file = data[0]
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            // let objectUrl = URL.createObjectURL(file)
            this.setState({
                imageBase64: base64
            })
        }
    }

    handleSendRemedy = () => {
        this.props.sendRemedy(this.state)
    }

    render() {
        let { isOpenModal, closeRemedyModal } = this.props
        return (
            <Modal isOpen={isOpenModal} className={'booking-modal-container'} size='lg' centered>
                <div className='modal-header'>
                    <h5 className='modal-title'>Gửi hóa đơn khám bệnh cho bệnh nhân</h5>
                    <button type='button' className='btn-close' aria-label='Close' onClick={closeRemedyModal}></button>
                </div>
                <ModalBody>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label>Email bệnh nhân</label>
                            <input
                                className='form-control'
                                type='email'
                                value={this.state.email}
                                onChange={(e) => this.handleOnChangeEmail(e)}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label>Chọn file đơn thuốc</label>
                            <input
                                className='form-control-file'
                                type='file'
                                onChange={(e) => this.handleOnChangeImage(e)}
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color='primary' onClick={() => this.handleSendRemedy()}>
                        Send
                    </Button>
                    <Button onClick={closeRemedyModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal)
