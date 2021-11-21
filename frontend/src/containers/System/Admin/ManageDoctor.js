import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import Select from 'react-select'
import './ManageDoctor.scss'

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

const mdParser = new MarkdownIt(/* Markdown-it options */)

class TableManageUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            contentMarkdown: '',
            contentHtml: '',
            selectedDoctor: '',
            description: ''
        }
    }

    componentDidMount() {}

    componentDidUpdate(prevProps, prevState) {}

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHtml: html
        })
    }

    handleSaveContentMarkdown = () => {
        console.log('check state', this.state)
    }

    handleChange = (selectedDoctor) => {
        this.setState({ selectedDoctor })
        console.log(`Option selected:`, selectedDoctor)
    }

    handleOnChangeDesc = (e) => {
        this.setState({
            description: e.target.value
        })
    }
    render() {
        return (
            <>
                <div className='manage-doctor-container'>
                    <div className='manage-doctor-title'>Tạo thêm thông tin bác sĩ</div>
                    <div className='more-info'>
                        <div className='content-left form-group'>
                            <label>Chọn bác sĩ</label>
                            <Select value={this.state.selectedDoctor} onChange={this.handleChange} options={options} />
                        </div>
                        <div className='content-right'>
                            <label>Thông tin giới thiệu</label>
                            <textarea
                                className='form-control'
                                rows='4'
                                onChange={(e) => this.handleOnChangeDesc(e)}
                                value={this.state.description}
                            ></textarea>
                        </div>
                    </div>
                    <div className='manage-doctor-editor'>
                        <MdEditor
                            style={{ height: '500px' }}
                            renderHTML={(text) => mdParser.render(text)}
                            onChange={this.handleEditorChange}
                        />
                    </div>
                    <button className='save-content-doctor' onClick={() => this.handleSaveContentMarkdown()}>
                        Lưu thông tin
                    </button>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        listUsers: state.admin.users
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteUserRedux: (id) => dispatch(actions.deleteUser(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser)