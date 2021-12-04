import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './ManageClinic.scss'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import { CommonUtils } from '../../../utils'
import { createNewClinic, createNewSpecialty } from '../../../services/userService'
import { toast } from 'react-toastify'

const mdParser = new MarkdownIt(/* Markdown-it options */)

class ManageClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTMLIntro: '',
            descriptionMarkdownIntro: ''
        }
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    handleOnChangeInput = (e, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = e.target.value
        this.setState({
            ...stateCopy
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionHTMLIntro: html,
            descriptionMarkdownIntro: text
        })
    }

    handleOnChangeImage = async (e) => {
        let data = e.target.files
        let file = data[0]
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            this.setState({
                imageBase64: base64
            })
        }
    }

    handleSaveNewClinic = async () => {
        let res = await createNewClinic(this.state)
        if (res && res.errCode === 0) {
            this.setState({
                name: '',
                imageBase64: '',
                address: '',
                descriptionHTMLIntro: '',
                descriptionMarkdownIntro: ''
            })
            toast.success('Add new clinic success!')
        } else {
            toast.error('Add new clinic error...')
        }
        console.log('check state manage clinic', this.state)
        console.log('check res manage clinic', res)
    }

    render() {
        let { name, address, descriptionMarkdown } = this.state
        return (
            <div className='manage-specialty-container'>
                <div className='container'>
                    <div className='ms-title'>Quản lí phòng khám</div>
                    <div className='add-new-specialty row'>
                        <div className='col-6 form-group'>
                            <label>Tên phòng khám</label>
                            <input
                                type='text'
                                className='form-control'
                                value={name}
                                onChange={(e) => this.handleOnChangeInput(e, 'name')}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label>Ảnh phòng khám</label>
                            <input
                                type='file'
                                className='form-control-file'
                                onChange={(e) => this.handleOnChangeImage(e)}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label>Địa chỉ phòng khám</label>
                            <input
                                type='text'
                                className='form-control'
                                value={address}
                                onChange={(e) => this.handleOnChangeInput(e, 'address')}
                            />
                        </div>
                        <div className='col-12'>
                            <MdEditor
                                style={{ height: '300px' }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={this.handleEditorChange}
                                value={descriptionMarkdown}
                            />
                        </div>
                        <div className='col-12'>
                            <button className='btn-save-specialty' onClick={() => this.handleSaveNewClinic()}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic)
