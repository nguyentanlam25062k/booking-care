import React, { Component } from 'react'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import ModalClinic from './ModalClinic'
import TableClinic from './TableClinic'

import { CommonUtils } from '../../../utils'
import { toast } from 'react-toastify'
import { createNewClinic, getAllClinic, getClinicByPagination, searchClinic } from '../../../services/userService'
import ModalNotifyClinic from './ModalNotifyClinic'
class ManageClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpenModal: false,
            isOpenModalDelete: false,

            action: '',
            name: '',
            address: '',
            imageBase64: '',
            idClinic: '',
            listClinic: [],

            totalRows: 0,
            pageCurrent: 1,
            limit: 5,
            idItemDelete: null,

            descriptionHTMLIntro: '',
            descriptionMarkdownIntro: '',
            descriptionHTMLStrength: '',
            descriptionMarkdownStrength: '',
            descriptionHTMLEquipment: '',
            descriptionMarkdownEquipment: '',
            descriptionHTMLLocation: '',
            descriptionMarkdownLocation: '',
            descriptionHTMLProcess: '',
            descriptionMarkdownProcess: '',

            nameError: false,
            addressError: false,
            imageBase64Error: false,
            descriptionHTMLIntroError: false
        }
    }

    async componentDidMount() {
        this.renderDataClinic()
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
        if (prevState.pageCurrent !== this.state.pageCurrent) {
            this.renderDataClinic()
        }
    }

    renderDataClinic = async () => {
        let { pageCurrent, limit } = this.state
        let resListClinicPagination = await getClinicByPagination(pageCurrent, limit)
        if (resListClinicPagination?.errCode === 0) {
            this.setState({
                listClinic: resListClinicPagination.data.rows,
                totalRows: resListClinicPagination.data.count,
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

    handleActionClinic = (action) => {
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
            descriptionHTMLIntro: html,
            descriptionMarkdownIntro: text
        })
    }

    handleEditorStrengthChange = ({ html, text }) => {
        this.setState({
            descriptionHTMLStrength: html,
            descriptionMarkdownStrength: text
        })
    }

    handleEditorEquipmentChange = ({ html, text }) => {
        this.setState({
            descriptionHTMLEquipment: html,
            descriptionMarkdownEquipment: text
        })
    }

    handleEditorLocationChange = ({ html, text }) => {
        this.setState({
            descriptionHTMLLocation: html,
            descriptionMarkdownLocation: text
        })
    }

    handleEditorProcessChange = ({ html, text }) => {
        this.setState({
            descriptionHTMLProcess: html,
            descriptionMarkdownProcess: text
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

    handleCreateClinic = (item) => {
        let { action } = this.state
        if (action === 'CREATE') {
            this.setState({
                name: '',
                address: '',
                imageBase64: '',
                idClinic: '',

                descriptionHTMLIntro: '',
                descriptionMarkdownIntro: '',
                descriptionHTMLStrength: '',
                descriptionMarkdownStrength: '',
                descriptionHTMLEquipment: '',
                descriptionMarkdownEquipment: '',
                descriptionHTMLLocation: '',
                descriptionMarkdownLocation: '',
                descriptionHTMLProcess: '',
                descriptionMarkdownProcess: '',

                nameError: false,
                addressError: false,
                imageBase64Error: false,
                descriptionHTMLIntroError: false
            })
        }

        if (action === 'EDIT') {
            this.setState({
                name: item?.name ? item.name : '',
                address: item?.address ? item.address : '',
                imageBase64: item?.image ? item.image : '',
                idClinic: item?.id ? item.id : '',

                descriptionHTMLIntro: item?.descriptionHTMLIntro ? item.descriptionHTMLIntro : '',
                descriptionMarkdownIntro: item?.descriptionMarkdownIntro ? item.descriptionMarkdownIntro : '',
                descriptionHTMLStrength: item?.descriptionHTMLStrength ? item.descriptionHTMLStrength : '',
                descriptionMarkdownStrength: item?.descriptionMarkdownStrength ? item.descriptionMarkdownStrength : '',
                descriptionHTMLEquipment: item?.descriptionHTMLEquipment ? item.descriptionHTMLEquipment : '',
                descriptionMarkdownEquipment: item?.descriptionMarkdownEquipment
                    ? item.descriptionMarkdownEquipment
                    : '',
                descriptionHTMLLocation: item?.descriptionHTMLLocation ? item.descriptionHTMLLocation : '',
                descriptionMarkdownLocation: item?.descriptionMarkdownLocation ? item.descriptionMarkdownLocation : '',
                descriptionHTMLProcess: item?.descriptionHTMLProcess ? item.descriptionHTMLProcess : '',
                descriptionMarkdownProcess: item?.descriptionMarkdownProcess ? item.descriptionMarkdownProcess : '',

                nameError: false,
                addressError: false,
                imageBase64Error: false,
                descriptionHTMLIntroError: false
            })
        }
    }

    checkValidInput = () => {
        let isValid = true
        let arrayCheck = ['name', 'address', 'imageBase64', 'descriptionHTMLIntro']
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

    handleSaveNewClinic = async () => {
        let isValid = this.checkValidInput()

        if (isValid) {
            let {
                action,
                name,
                address,
                imageBase64,
                idClinic,

                descriptionHTMLIntro,
                descriptionMarkdownIntro,
                descriptionHTMLStrength,
                descriptionMarkdownStrength,
                descriptionHTMLEquipment,
                descriptionMarkdownEquipment,
                descriptionHTMLLocation,
                descriptionMarkdownLocation,
                descriptionHTMLProcess,
                descriptionMarkdownProcess
            } = this.state

            let res = await createNewClinic({
                action,
                name,
                address,
                imageBase64,
                idClinic,

                descriptionHTMLIntro,
                descriptionMarkdownIntro,
                descriptionHTMLStrength,
                descriptionMarkdownStrength,
                descriptionHTMLEquipment,
                descriptionMarkdownEquipment,
                descriptionHTMLLocation,
                descriptionMarkdownLocation,
                descriptionHTMLProcess,
                descriptionMarkdownProcess
            })
            if (res && res.errCode === 0) {
                this.setState({
                    name: '',
                    address: '',
                    imageBase64: '',
                    idClinic: '',

                    descriptionHTMLIntro: '',
                    descriptionMarkdownIntro: '',
                    descriptionHTMLStrength: '',
                    descriptionMarkdownStrength: '',
                    descriptionHTMLEquipment: '',
                    descriptionMarkdownEquipment: '',
                    descriptionHTMLLocation: '',
                    descriptionMarkdownLocation: '',
                    descriptionHTMLProcess: '',
                    descriptionMarkdownProcess: '',

                    nameError: false,
                    addressError: false,
                    imageBase64Error: false,
                    descriptionHTMLIntroError: false
                })
                toast.success('Add new clinic success!')
                this.renderDataClinic()
            } else {
                toast.error('Add new clinic error...')
            }
            this.handleCloseModal()
        }
    }

    getIdClinicDelete = (itemId) => {
        this.setState({
            idItemDelete: itemId
        })
    }

    handleDeleteClinic = async (typeDelete) => {
        if (typeDelete) {
            this.renderDataClinic()
        }
    }

    handleSearchClinic = async (searchTerm) => {
        await this.setState({
            pageCurrent: 1,
            limit: 5
        })        
        let { pageCurrent, limit } = this.state
        let resListClinicPagination = await searchClinic(searchTerm, pageCurrent, limit)
        if (resListClinicPagination?.errCode === 0) {
            this.setState({
                listClinic: resListClinicPagination.data.rows,
                totalRows: resListClinicPagination.data.count,
                
                idItemDelete: null,
                action: ''
            })
        }
    }

    render() {
        let { isOpenModal, isOpenModalDelete, idItemDelete, listClinic, pageCurrent, totalRows, limit } = this.state
        let stateParent = { ...this.state }
        let totalPages = Math.ceil(totalRows / limit)
        console.log('check state', {
            pageCurrent,
            limit
        })
        return (
            <div className='manage-specialty-container'>
                <div className='container py-15'>
                    <div className='ms-header'>
                        <div className='ms-title manage-title'>
                            <i className='fas fa-home'></i> Quản lí phòng khám
                        </div>
                        <div className='ms-heading manage-heading mb-5'>Tạo mới thông tin phòng khám</div>
                    </div>
                    <div className='ms-body'>
                        <TableClinic
                            listClinic={listClinic}
                            pageCurrent={pageCurrent}
                            totalPages={totalPages}
                            totalRows={totalRows}
                            limit={limit}
                            handleOpenModal={this.handleOpenModal}
                            handleOpenModalDelete={this.handleOpenModalDelete}
                            handleCreateClinic={this.handleCreateClinic}
                            handleActionClinic={this.handleActionClinic}
                            handleNextPage={this.handleNextPage}
                            handlePrevPage={this.handlePrevPage}
                            getIdClinicDelete={this.getIdClinicDelete}
                            handleSearchClinic={this.handleSearchClinic}
                        />
                        <ModalClinic
                            isOpenModal={isOpenModal}
                            stateParent={stateParent}
                            handleCloseModal={this.handleCloseModal}
                            handleOnChangeInput={this.handleOnChangeInput}
                            handleOnChangeImage={this.handleOnChangeImage}
                            checkValidInput={this.checkValidInput}
                            handleSaveNewClinic={this.handleSaveNewClinic}
                            handleEditorIntroChange={this.handleEditorIntroChange}
                            handleEditorStrengthChange={this.handleEditorStrengthChange}
                            handleEditorEquipmentChange={this.handleEditorEquipmentChange}
                            handleEditorLocationChange={this.handleEditorLocationChange}
                            handleEditorProcessChange={this.handleEditorProcessChange}
                        />

                        <ModalNotifyClinic
                            isOpenModalDelete={isOpenModalDelete}
                            idItemDelete={idItemDelete}
                            handleCloseModalDelete={this.handleCloseModalDelete}
                            handleDeleteClinic={this.handleDeleteClinic}
                        />
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
