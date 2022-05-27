import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './ManageClinic.scss'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { BsHouseFill, BsFillBookmarkCheckFill, BsPlusLg, BsExclamationCircle } from 'react-icons/bs'
import { AiFillSetting } from 'react-icons/ai'
import { IoLocationSharp } from 'react-icons/io5'
import { IoIosRocket } from 'react-icons/io'
import './ModalClinic.scss'

import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

const mdParser = new MarkdownIt(/* Markdown-it options */)

class ModalClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toggleState: 1,
            isOpenLightBoxImage: false
        }
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    toggleTab = (index) => {
        this.setState({
            toggleState: index
        })
    }

    render() {
        let { toggleState, isOpenLightBoxImage } = this.state
        let { isOpenModal, handleCloseModal, handleOnChangeInput, handleSaveNewClinic, handleOnChangeImage } =
            this.props

        let {
            handleEditorIntroChange,
            handleEditorStrengthChange,
            handleEditorEquipmentChange,
            handleEditorLocationChange,
            handleEditorProcessChange
        } = this.props

        let {
            action,
            name,
            address,
            imageBase64,

            descriptionHTMLIntro,
            descriptionMarkdownIntro,
            descriptionHTMLStrength,
            descriptionMarkdownStrength,
            descriptionHTMLEquipment,
            descriptionMarkdownEquipment,
            descriptionHTMLLocation,
            descriptionMarkdownLocation,
            descriptionHTMLProcess,
            descriptionMarkdownProcess,

            nameError,
            addressError,
            imageBase64Error,
            descriptionHTMLIntroError
        } = this.props.stateParent

        return (
            <>
                <div>
                    <Modal centered size='xl' zIndex={900} scrollable={true} isOpen={isOpenModal}>
                        <div className='modal-header'>
                            <h5 className='modal-title'>Tạo mới thông tin phòng khám</h5>
                            <button
                                type='button'
                                className='btn-close'
                                aria-label='Close'
                                onClick={handleCloseModal}
                            ></button>
                        </div>
                        <ModalBody>
                            <div className='modal-container'>
                                <div className='modal-tab-header'>
                                    <button
                                        className={toggleState === 1 ? 'modal-tab active' : 'modal-tab'}
                                        onClick={() => this.toggleTab(1)}
                                    >
                                        <BsHouseFill />
                                        <span>Giới thiệu</span>
                                    </button>
                                    <button
                                        className={toggleState === 2 ? 'modal-tab active' : 'modal-tab'}
                                        onClick={() => this.toggleTab(2)}
                                    >
                                        <BsFillBookmarkCheckFill />
                                        <span>Thế mạnh chuyên môn</span>
                                    </button>

                                    <button
                                        className={toggleState === 3 ? 'modal-tab active' : 'modal-tab'}
                                        onClick={() => this.toggleTab(3)}
                                    >
                                        <IoIosRocket />
                                        <span>Quy trình khám</span>
                                    </button>
                                    <button
                                        className={toggleState === 4 ? 'modal-tab active' : 'modal-tab'}
                                        onClick={() => this.toggleTab(4)}
                                    >
                                        <AiFillSetting />
                                        <span>Trang thiết bị</span>
                                    </button>
                                    <button
                                        className={toggleState === 5 ? 'modal-tab active' : 'modal-tab'}
                                        onClick={() => this.toggleTab(5)}
                                    >
                                        <IoLocationSharp />
                                        <span>Vị trí</span>
                                    </button>
                                </div>

                                <div className='modal-tab-info'>
                                    <div className={toggleState === 1 ? 'modal-info  active' : 'modal-info'}>
                                        <div className='modal-box row'>
                                            <div className='modal-box-heading'>
                                                <span>Giới thiệu phòng khám</span>
                                            </div>
                                            <div className='info-body'>
                                                <div className='info-left'>
                                                    <div className={`col-12 form-group ${nameError ? 'error' : ''}`}>
                                                        <label>Tên phòng khám </label>
                                                        <input
                                                            type='text'
                                                            className='form-control'
                                                            value={name}
                                                            placeholder='Name clinic'
                                                            onChange={(e) => handleOnChangeInput(e, 'name')}
                                                        />
                                                        <span className='error-icon'>
                                                            <BsExclamationCircle />
                                                        </span>
                                                        <span className='error-message'>Missing name clinic</span>
                                                    </div>
                                                    <div className={`col-12 form-group ${addressError ? 'error' : ''}`}>
                                                        <label>Địa chỉ phòng khám </label>
                                                        <input
                                                            type='text'
                                                            className='form-control'
                                                            value={address}
                                                            placeholder='Name clinic'
                                                            onChange={(e) => handleOnChangeInput(e, 'address')}
                                                        />
                                                        <span className='error-icon'>
                                                            <BsExclamationCircle />
                                                        </span>
                                                        <span className='error-message'>Missing address clinic</span>
                                                    </div>

                                                    <div
                                                        className={`col-12 form-group ${
                                                            imageBase64Error ? 'error' : ''
                                                        }`}
                                                    >
                                                        <label style={{ display: 'block' }}>Ảnh phòng khám</label>
                                                        <input
                                                            id='modal-select-image'
                                                            className='form-control-file border-none'
                                                            type='file'
                                                            onChange={(e) => handleOnChangeImage(e)}
                                                        />
                                                        <span className='error-message'>Missing image clinic</span>
                                                    </div>
                                                </div>
                                                <div className='info-right'>
                                                    <div
                                                        className={`col-12 form-group h-100 ${
                                                            imageBase64Error ? 'error' : ''
                                                        }`}
                                                    >
                                                        <div className='modal-box-image'>
                                                            <div
                                                                className='modal-image-preview'
                                                                style={{
                                                                    background: `url(${imageBase64}) center / cover no-repeat`
                                                                }}
                                                                onClick={() =>
                                                                    this.setState({
                                                                        isOpenLightBoxImage: true
                                                                    })
                                                                }
                                                            ></div>
                                                            <BsPlusLg />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={`col-12 form-group mt-2 ${
                                                    descriptionHTMLIntroError ? 'error' : ''
                                                }`}
                                            >
                                                <label>Mô tả phòng khám</label>
                                                <MdEditor
                                                    style={{ height: '300px' }}
                                                    renderHTML={(text) => mdParser.render(text)}
                                                    onChange={handleEditorIntroChange}
                                                    value={descriptionMarkdownIntro}
                                                />
                                                <span className='error-message'>Missing description clinic</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={toggleState === 2 ? 'modal-info  active' : 'modal-info'}>
                                        <div className='modal-box row'>
                                            <div className='modal-box-heading'>
                                                <span>Thế mạnh chuyên môn</span>
                                            </div>

                                            <div className='col-12 form-group mt-2'>
                                                <label>Mô tả thế mạnh chuyên môn</label>
                                                <MdEditor
                                                    style={{ height: '300px' }}
                                                    renderHTML={(text) => mdParser.render(text)}
                                                    onChange={handleEditorStrengthChange}
                                                    value={descriptionMarkdownStrength}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={toggleState === 3 ? 'modal-info  active' : 'modal-info'}>
                                        <div className='modal-box row'>
                                            <div className='modal-box-heading'>
                                                <span>Quy trình khám</span>
                                            </div>

                                            <div className='col-12 form-group mt-2'>
                                                <label>Mô tả quy trình khám</label>
                                                <MdEditor
                                                    style={{ height: '300px' }}
                                                    renderHTML={(text) => mdParser.render(text)}
                                                    onChange={handleEditorProcessChange}
                                                    value={descriptionMarkdownProcess}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={toggleState === 4 ? 'modal-info  active' : 'modal-info'}>
                                        <div className='modal-box row'>
                                            <div className='modal-box-heading'>
                                                <span>Trang thiết bị</span>
                                            </div>

                                            <div className='col-12 form-group mt-2'>
                                                <label>Mô tả trang thiết bị</label>
                                                <MdEditor
                                                    style={{ height: '300px' }}
                                                    renderHTML={(text) => mdParser.render(text)}
                                                    onChange={handleEditorEquipmentChange}
                                                    value={descriptionMarkdownEquipment}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={toggleState === 5 ? 'modal-info  active' : 'modal-info'}>
                                        <div className='modal-box row'>
                                            <div className='modal-box-heading'>
                                                <span>Vị trí</span>
                                            </div>

                                            <div className='col-12 form-group mt-2'>
                                                <label>Mô tả vị trí</label>
                                                <MdEditor
                                                    style={{ height: '300px' }}
                                                    renderHTML={(text) => mdParser.render(text)}
                                                    onChange={handleEditorLocationChange}
                                                    value={descriptionMarkdownLocation}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color='primary'
                                onClick={handleSaveNewClinic}
                                className={`${action === 'CREATE' ? 'modal-button-create' : 'modal-button-edit'}`}
                            >
                                {action === 'CREATE' ? (
                                    <span>Tạo mới phòng khám</span>
                                ) : (
                                    <span>Lưu phòng khám phòng khám</span>
                                )}
                            </Button>
                            <Button onClick={handleCloseModal} variant='light'>
                                Hủy
                            </Button>
                        </ModalFooter>
                    </Modal>
                    <div>
                        {isOpenLightBoxImage && (
                            <Lightbox
                                mainSrc={`${imageBase64}`}
                                onCloseRequest={() => this.setState({ isOpenLightBoxImage: false })}
                            />
                        )}
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalClinic)
