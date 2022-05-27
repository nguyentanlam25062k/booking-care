import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import './ModalNotifySpecialty.scss'
import { FaRegTimesCircle } from 'react-icons/fa'
import { deleteSpecialtyById } from '../../../services/userService'
import { toast } from 'react-toastify'

class ModalNotifySpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            idItemDelete: null
        }
    }

    async componentDidMount() {
        let { idItemDelete } = this.props
        if (idItemDelete) {
            this.setState({
                idItemDelete: idItemDelete
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let { idItemDelete } = this.props

        if (prevProps.language !== this.props.language) {
        }
        if (prevProps.idItemDelete !== this.props.idItemDelete) {
            this.setState({
                idItemDelete: idItemDelete
            })
        }
    }

    handleDeleteSpecialty = async () => {
        let { idItemDelete, handleCloseModalDelete, handleDeleteSpecialty } = this.props
        let resDeleteSpecialty = await deleteSpecialtyById({ specialtyId: idItemDelete })

        if (resDeleteSpecialty?.errCode === 0) {
            toast.success('Delete specialty success')
            handleDeleteSpecialty(true)
        } else {
            toast.error('Delete failed failed !!')
            handleDeleteSpecialty(false)
        }
        handleCloseModalDelete()
    }

    render() {
        let { isOpenModalDelete, handleCloseModalDelete } = this.props
        return (
            <>
                <div>
                    <Modal centered size='md' zIndex={900} isOpen={isOpenModalDelete} className='modal-notify-delete'>
                        <div className='modal-header'>
                            <h5 className='modal-notify-title'>Xóa phòng khám</h5>
                            <button
                                type='button'
                                className='btn-close'
                                aria-label='Close'
                                onClick={handleCloseModalDelete}
                            ></button>
                        </div>
                        <ModalBody>
                            <div className='modal-notify-body text-center'>
                                <FaRegTimesCircle className='modal-notify-icon' />
                                <div className='modal-notify-heading'>Bạn chắc chắn chứ ?</div>
                                <div className='modal-notify-text'>
                                    Bạn có thật sự muốn <b>xóa phòng khám</b> này ? Quá trình này không thể hoàn tác
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color='primary' onClick={() => this.handleDeleteSpecialty()} className='btn-delete'>
                                Xóa
                            </Button>{' '}
                            <Button onClick={handleCloseModalDelete}>Hủy</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalNotifySpecialty)
