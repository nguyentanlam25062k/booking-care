import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './ManageSpecialty.scss'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import { CommonUtils } from '../../../utils'
import { createNewSpecialty } from '../../../services/userService'
import { toast } from 'react-toastify'

const mdParser = new MarkdownIt(/* Markdown-it options */)

class ManageSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: ''
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
            descriptionHTML: html,
            descriptionMarkdown: text
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

    handleSaveNewSpecialty = async () => {
        let res = await createNewSpecialty(this.state)
        if (res && res.errCode === 0) {
            toast.success('Add new specialty success!')
        } else {
            toast.error('Add new specialty error...')
        }
        console.log('check state manage specialty', this.state)
        console.log('check res manage specialty', res)
    }

    render() {
        let { name, descriptionMarkdown } = this.state
        return (
            <div className='manage-specialty-container'>
                <div className='container'>
                    <div className='ms-title'>Quản lí chuyên khoa</div>
                    <div className='add-new-specialty row'>
                        <div className='col-6 form-group'>
                            <label>Tên chuyên khoa</label>
                            <input
                                type='text'
                                className='form-control'
                                value={name}
                                onChange={(e) => this.handleOnChangeInput(e, 'name')}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label>Ảnh chuyên khoa</label>
                            <input
                                type='file'
                                className='form-control-file'
                                onChange={(e) => this.handleOnChangeImage(e)}
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
                            <button className='btn-save-specialty' onClick={() => this.handleSaveNewSpecialty()}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty)
