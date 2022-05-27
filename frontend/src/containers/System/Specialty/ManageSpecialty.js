import React, { Component } from 'react'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import ModalSpecialty from './ModalSpecialty'
import TableSpecialty from './TableSpecialty'

import { CommonUtils } from '../../../utils'
import { toast } from 'react-toastify'
import {
    createNewSpecialty,
    getAllSpecialty,
    getSpecialtyByPagination,
    searchSpecialty
} from '../../../services/userService'
import LoadingOverlay from 'react-loading-overlay'

import ModalNotifySpecialty from './ModalNotifySpecialty'
class ManageSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowLoading: false,

            isOpenModal: false,
            isOpenModalDelete: false,

            action: '',
            name: '',
            imageBase64: '',
            idSpecialty: '',
            listSpecialty: [],

            totalRows: 0,
            pageCurrent: 1,
            limit: 5,
            idItemDelete: null,

            descriptionHTML: '',
            descriptionMarkdown: '',

            nameError: false,
            imageBase64Error: false,
            descriptionHTMLError: false
        }
    }

    async componentDidMount() {
        this.renderDataSpecialty()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
        if (prevState.pageCurrent !== this.state.pageCurrent) {
            this.renderDataSpecialty()
        }
    }

    renderDataSpecialty = async () => {
        let { pageCurrent, limit } = this.state
        this.setState({
            isShowLoading: true
        })
        let resListSpecialtyPagination = await getSpecialtyByPagination(pageCurrent, limit)
        if (resListSpecialtyPagination?.errCode === 0) {
            this.setState({
                isShowLoading: false,

                listSpecialty: resListSpecialtyPagination.data.rows,
                totalRows: resListSpecialtyPagination.data.count,
                idItemDelete: null,
                action: ''
            })
        }
    }

    handlePrevPage = () => {
        let { pageCurrent } = this.state
        this.setState({
            pageCurrent: pageCurrent - 1
        })
    }

    handleNextPage = () => {
        let { pageCurrent } = this.state
        this.setState({
            pageCurrent: pageCurrent + 1
        })
    }

    handleCloseModal = () => {
        this.setState({
            isOpenModal: false
        })
    }

    handleOpenModal = () => {
        this.setState({
            isOpenModal: true
        })
    }

    handleCloseModalDelete = () => {
        this.setState({
            isOpenModalDelete: false
        })
    }

    handleOpenModalDelete = () => {
        this.setState({
            isOpenModalDelete: true
        })
    }

    handleActionSpecialty = (action) => {
        this.setState({
            action: action
        })
    }

    handleOnChangeInput = (e, id) => {
        let stateCopy = { ...this.state }
        stateCopy[id] = e.target.value
        this.setState({
            ...stateCopy
        })
    }

    handleEditorIntroChange = ({ html, text }) => {
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

    handleCreateSpecialty = (item) => {
        let { action } = this.state
        if (action === 'CREATE') {
            this.setState({
                name: '',
                imageBase64: '',
                idSpecialty: '',

                descriptionHTML: '',
                descriptionMarkdown: '',

                nameError: false,
                imageBase64Error: false,
                descriptionHTMLError: false
            })
        }

        if (action === 'EDIT') {
            this.setState({
                name: item?.name ? item.name : '',
                imageBase64: item?.image ? item.image : '',
                idSpecialty: item?.id ? item.id : '',

                descriptionHTML: item?.descriptionHTML ? item.descriptionHTML : '',
                descriptionMarkdown: item?.descriptionMarkdown ? item.descriptionMarkdown : '',

                nameError: false,
                imageBase64Error: false,
                descriptionHTMLError: false
            })
        }
    }

    checkValidInput = () => {
        let isValid = true
        let arrayCheck = ['name', 'imageBase64', 'descriptionHTML']
        for (let i = 0; i < arrayCheck.length; i++) {
            if (!this.state[arrayCheck[i]]) {
                isValid = false
                this.setState({
                    [`${arrayCheck[i]}Error`]: true
                })
            } else {
                this.setState({
                    [`${arrayCheck[i]}Error`]: false
                })
            }
        }
        return isValid
    }

    handleSaveNewSpecialty = async () => {
        let isValid = this.checkValidInput()

        if (isValid) {
            let {
                action,
                name,
                imageBase64,
                idSpecialty,

                descriptionHTML,
                descriptionMarkdown
            } = this.state

            this.setState({
                isShowLoading: true
            })

            let res = await createNewSpecialty({
                action,
                name,
                imageBase64,
                idSpecialty,

                descriptionHTML,
                descriptionMarkdown
            })
            if (res && res.errCode === 0) {
                this.setState({
                    name: '',
                    imageBase64: '',
                    idSpecialty: '',

                    descriptionHTML: '',
                    descriptionMarkdown: '',

                    nameError: false,
                    imageBase64Error: false,
                    descriptionHTMLError: false,
                    isShowLoading: false
                })
                toast.success('Add new Specialty success!')
                this.renderDataSpecialty()
            } else {
                toast.error('Add new Specialty error...')
            }
            this.handleCloseModal()
        }
    }

    getIdSpecialtyDelete = (itemId) => {
        this.setState({
            idItemDelete: itemId
        })
    }

    handleDeleteSpecialty = async (typeDelete) => {
        if (typeDelete) {
            this.renderDataSpecialty()
        }
    }

    handleSearchSpecialty = async (searchTerm) => {
        await this.setState({
            pageCurrent: 1,
            limit: 5
        })
        let { pageCurrent, limit } = this.state
        let resListSpecialtyPagination = await searchSpecialty(searchTerm, pageCurrent, limit)
        if (resListSpecialtyPagination?.errCode === 0) {
            this.setState({
                listSpecialty: resListSpecialtyPagination.data.rows,
                totalRows: resListSpecialtyPagination.data.count,

                idItemDelete: null,
                action: ''
            })
        }
    }

    render() {
        let { isOpenModal, isOpenModalDelete, idItemDelete, listSpecialty, pageCurrent, totalRows, limit } = this.state
        let { isShowLoading } = this.state

        let stateParent = { ...this.state }
        let totalPages = Math.ceil(totalRows / limit)
        console.log('check listSpecialty', { listSpecialty })
        return (
            <LoadingOverlay active={isShowLoading} spinner text='Loading...'>
                <div className='manage-specialty-container'>
                    <div className='container py-15'>
                        <div className='ms-header'>
                            <div className='ms-title manage-title'>
                                <i
                                    className='far fa-address-card'
                                    style={{
                                        marginRight: '5px'
                                    }}
                                ></i>
                                Quản lí chuyên khoa
                            </div>
                            <div className='ms-heading manage-heading mb-5'>Tạo mới thông tin chuyên khoa</div>
                        </div>
                        <div className='ms-body'>
                            <TableSpecialty
                                listSpecialty={listSpecialty}
                                pageCurrent={pageCurrent}
                                totalPages={totalPages}
                                totalRows={totalRows}
                                limit={limit}
                                handleOpenModal={this.handleOpenModal}
                                handleOpenModalDelete={this.handleOpenModalDelete}
                                handleCreateSpecialty={this.handleCreateSpecialty}
                                handleActionSpecialty={this.handleActionSpecialty}
                                handleNextPage={this.handleNextPage}
                                handlePrevPage={this.handlePrevPage}
                                getIdSpecialtyDelete={this.getIdSpecialtyDelete}
                                handleSearchSpecialty={this.handleSearchSpecialty}
                            />
                            <ModalSpecialty
                                isOpenModal={isOpenModal}
                                stateParent={stateParent}
                                handleCloseModal={this.handleCloseModal}
                                handleOnChangeInput={this.handleOnChangeInput}
                                handleOnChangeImage={this.handleOnChangeImage}
                                checkValidInput={this.checkValidInput}
                                handleSaveNewSpecialty={this.handleSaveNewSpecialty}
                                handleEditorIntroChange={this.handleEditorIntroChange}
                            />

                            <ModalNotifySpecialty
                                isOpenModalDelete={isOpenModalDelete}
                                idItemDelete={idItemDelete}
                                handleCloseModalDelete={this.handleCloseModalDelete}
                                handleDeleteSpecialty={this.handleDeleteSpecialty}
                            />
                        </div>
                    </div>
                </div>
            </LoadingOverlay>
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
