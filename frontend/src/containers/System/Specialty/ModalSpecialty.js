import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './ManageSpecialty.scss'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { BsHouseFill, BsFillBookmarkCheckFill, BsPlusLg, BsExclamationCircle } from 'react-icons/bs'
import { AiFillSetting } from 'react-icons/ai'
import { IoLocationSharp } from 'react-icons/io5'
import { IoIosRocket } from 'react-icons/io'
import './ModalSpecialty.scss'

import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

const mdParser = new MarkdownIt(/* Markdown-it options */)

class ModalSpecialty extends Component {
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
        let { isOpenModal, handleCloseModal, handleOnChangeInput, handleSaveNewSpecialty, handleOnChangeImage } =
            this.props

        let { handleEditorIntroChange } = this.props

        let {
            action,
            name,
            imageBase64,

            descriptionMarkdown,

            nameError,
            imageBase64Error,
            descriptionHTMLError
        } = this.props.stateParent

        return (
            <>
                <div>
                    <Modal
                        centered
                        size='xl'
                        zIndex={900}
                        scrollable={true}
                        isOpen={isOpenModal}
                        className='modal-specialty'
                    >
                        <div className='modal-header'>
                            <h5 className='modal-title'>Tạo mới thông tin chuyên khoa</h5>
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
                                </div>

                                <div className='modal-tab-info'>
                                    <div className={toggleState === 1 ? 'modal-info  active' : 'modal-info'}>
                                        <div className='modal-box row'>
                                            <div className='modal-box-heading'>
                                                <span>Giới thiệu chuyên khoa</span>
                                            </div>
                                            <div className='info-body'>
                                                <div className='info-left'>
                                                    <div className={`col-12 form-group ${nameError ? 'error' : ''}`}>
                                                        <label>Tên chuyên khoa </label>
                                                        <input
                                                            type='text'
                                                            className='form-control'
                                                            value={name}
                                                            placeholder='Name specialty'
                                                            onChange={(e) => handleOnChangeInput(e, 'name')}
                                                        />
                                                        <span className='error-icon'>
                                                            <BsExclamationCircle />
                                                        </span>
                                                        <span className='error-message'>Missing name specialty</span>
                                                    </div>

                                                    <div
                                                        className={`col-12 form-group ${
                                                            imageBase64Error ? 'error' : ''
                                                        }`}
                                                    >
                                                        <label style={{ display: 'block' }}>Ảnh chuyên khoa</label>
                                                        <input
                                                            id='modal-select-image'
                                                            className='form-control-file border-none'
                                                            type='file'
                                                            onChange={(e) => handleOnChangeImage(e)}
                                                        />
                                                        <span className='error-message'>Missing image specialty</span>
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
                                                    descriptionHTMLError ? 'error' : ''
                                                }`}
                                            >
                                                <label>Mô tả chuyên khoa</label>
                                                <MdEditor
                                                    style={{ height: '300px' }}
                                                    renderHTML={(text) => mdParser.render(text)}
                                                    onChange={handleEditorIntroChange}
                                                    value={descriptionMarkdown}
                                                />
                                                <span className='error-message'>Missing description specialty</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color='primary'
                                onClick={handleSaveNewSpecialty}
                                className={`${action === 'CREATE' ? 'modal-button-create' : 'modal-button-edit'}`}
                            >
                                {action === 'CREATE' ? (
                                    <span>Tạo mới chuyên khoa</span>
                                ) : (
                                    <span>Lưu chuyên khoa chuyên khoa</span>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalSpecialty)
