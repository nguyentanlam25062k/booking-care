import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import Select from 'react-select'
import './ManageDoctor.scss'
import { LANGUAGES, CRUD_ACTIONS } from '../../../utils/constant'
import { getDetailInfoDoctor } from '../../../services/userService'

const mdParser = new MarkdownIt(/* Markdown-it options */)

class TableManageUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: '',
            description: '',
            listDoctors: [],
            hasOldData: false
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors()
    }

    buildDataInputSelect = (data) => {
        let result = []
        let { language } = this.props
        if (data && data.length > 0) {
            result = data.map((item, index) => {
                let obj = {}
                let labelVi = `${item.lastName} ${item.firstName}`
                let labelEn = `${item.firstName} ${item.lastName}`
                obj.label = language === LANGUAGES.VI ? labelVi : labelEn
                obj.value = item.id
                return obj
            })
        }
        return result
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors)
            this.setState({
                listDoctors: dataSelect
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    handleSaveContentMarkdown = () => {
        // let { hasOldData } = this.state
        let { contentMarkdown, contentHTML, selectedDoctor, description, listDoctors, hasOldData } = this.state
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE
        })
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor })
        let res = await getDetailInfoDoctor(selectedDoctor.value)
        if (res?.data?.Markdown && res.errCode === 0) {
            let markdown = res.data.Markdown
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true
            })
        } else {
            this.setState({
                contentHTMl: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false
            })
        }
        console.log('handle change select res', res)
    }

    handleOnChangeDesc = (e) => {
        this.setState({
            description: e.target.value
        })
    }
    render() {
        let { selectedDoctor, listDoctors, hasOldData } = this.state
        return (
            <>
                <div className='manage-doctor-container'>
                    <div className='manage-doctor-title'>Tạo thêm thông tin bác sĩ</div>
                    <div className='more-info'>
                        <div className='content-left form-group'>
                            <label>Chọn bác sĩ</label>
                            <Select value={selectedDoctor} onChange={this.handleChangeSelect} options={listDoctors} />
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
                            value={this.state.contentMarkdown}
                        />
                    </div>
                    <button
                        className={hasOldData === true ? 'save-content-doctor' : 'create-content-doctor'}
                        onClick={() => this.handleSaveContentMarkdown()}
                    >
                        {hasOldData === true ? <span>Lưu thông tin</span> : <span>Tạo thông tin</span>}
                    </button>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser)
