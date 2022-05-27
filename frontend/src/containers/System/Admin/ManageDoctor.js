import React, {Component} from 'react'
import {FormattedMessage} from 'react-intl'
import {connect} from 'react-redux'
import * as actions from '../../../store/actions'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import Select from 'react-select'
import './ManageDoctor.scss'
import {LANGUAGES, CRUD_ACTIONS} from '../../../utils/constant'
import {getDetailInfoDoctor} from '../../../services/userService'
import {BsExclamationCircle} from 'react-icons/bs'
import LoadingOverlay from 'react-loading-overlay'

const mdParser = new MarkdownIt(/* Markdown-it options */)

class TableManageUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowLoading: false,

            // save to markdown table
            contentMarkdown: '',
            contentHTML: '',
            description: '',
            selectedDoctor: '',
            hasOldData: false,
            listDoctors: [],

            // save to doctor_info table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listSpecialty: [],
            listClinic: [],

            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedSpecialty: '',
            selectedClinic: '',

            nameClinic: '',
            addressClinic: '',
            note: '',

            nameClinicError: false,
            addressClinicError: false,
            noteError: false,
            contentMarkdownError: false,
            contentHTMLError: false,
            descriptionError: false,
            selectedDoctorError: false,
            selectedPriceError: false,
            selectedPaymentError: false,
            selectedProvinceError: false,
            selectedSpecialtyError: false,
            selectedClinicError: false
        }
    }

    async componentDidMount() {
        this.setState({
            isShowLoading: true
        })
        await this.props.fetchAllDoctors()
        await this.props.getRequiredDoctorInfo()
        this.setState({
            isShowLoading: false
        })
    }

    buildDataInputSelect = (data, type) => {
        let result = []
        let {language} = this.props
        if (data && data.length > 0) {
            if (type === 'USER') {
                result = data.map((item, index) => {
                    let labelVi = `${item.lastName} ${item.firstName}`
                    let labelEn = `${item.firstName} ${item.lastName}`
                    return {
                        label: language === LANGUAGES.VI ? labelVi : labelEn,
                        value: item.id
                    }
                })
            }

            if (type === 'PRICE') {
                result = data.map((item, index) => {
                    let labelVi = `${item.valueVi}đ`
                    let labelEn = `${item.valueEn} USD`
                    return {
                        label: language === LANGUAGES.VI ? labelVi : labelEn,
                        value: item.keyMap
                    }
                })
            }

            if (['PAYMENT', 'PROVINCE'].includes(type)) {
                result = data.map((item, index) => {
                    let labelVi = `${item.valueVi}`
                    let labelEn = `${item.valueEn}`
                    return {
                        label: language === LANGUAGES.VI ? labelVi : labelEn,
                        value: item.keyMap
                    }
                })
            }

            if (['SPECIALTY', 'CLINIC'].includes(type)) {
                result = data.map((item, index) => {
                    return {
                        label: item.name,
                        value: item.id
                    }
                })
            }
        }
        return result
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USER')
            this.setState({
                listDoctors: dataSelect
            })
        }
        if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
            let {resPrice, resPayment, resProvince, resSpecialty, resClinic} = this.props.allRequiredDoctorInfo
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE')
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT')
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE')
            let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY')
            let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC')

            this.setState({
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listSpecialty: dataSelectSpecialty,
                listClinic: dataSelectClinic
            })
        }
        if (prevProps.language !== this.props.language) {
            let {resPrice, resPayment, resProvince} = this.props.allRequiredDoctorInfo

            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USER')
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE')
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT')
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE')

            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince
            })
        }
    }

    handleEditorChange = ({html, text}) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }

    checkValidInput = () => {
        let isValid = true
        let arrInput = [
            'nameClinic',
            'addressClinic',
            'note',
            'contentMarkdown',
            'description',
            'selectedDoctor',
            'selectedPrice',
            'selectedPayment',
            'selectedProvince',
            'selectedSpecialty',
            'selectedClinic'
        ]

        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false
                this.setState({
                    [`${arrInput[i]}Error`]: true
                })
            } else {
                this.setState({
                    [`${arrInput[i]}Error`]: false
                })
            }
        }
        return isValid
    }

    handleSaveContentMarkdown = () => {
        let isValidInput = this.checkValidInput()
        if (isValidInput) {
            let {
                hasOldData,
                contentHTML,
                contentMarkdown,
                description,
                selectedDoctor,
                selectedPrice,
                selectedPayment,
                selectedProvince,
                nameClinic,
                addressClinic,
                note,
                selectedSpecialty,
                selectedClinic
            } = this.state

            console.log('check state manage doctor', this.state)

            this.props.saveDetailDoctor({
                contentHTML: contentHTML,
                contentMarkdown: contentMarkdown,
                description: description,
                doctorId: selectedDoctor.value,
                action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

                selectedPrice: selectedPrice.value,
                selectedPayment: selectedPayment.value,
                selectedProvince: selectedProvince.value,
                specialtyId: selectedSpecialty.value,
                clinicId: selectedClinic.value,

                nameClinic: nameClinic,
                addressClinic: addressClinic,
                note: note
            })
        }
        return
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({selectedDoctor})
        let res = await getDetailInfoDoctor(selectedDoctor.value)

        if (res?.data?.Markdown && res.errCode === 0) {
            let markdown = res.data.Markdown
            let addressClinic = '',
                nameClinic = '',
                note = '',
                selectedPrice = '',
                selectedPayment = '',
                selectedProvince = '',
                selectedSpecialty = '',
                selectedClinic = ''

            if (res?.data?.Doctor_Info) {
                let {listProvince, listPayment, listPrice, listSpecialty, listClinic} = this.state
                let doctorInfo = res.data.Doctor_Info

                addressClinic = doctorInfo.addressClinic
                nameClinic = doctorInfo.nameClinic
                note = doctorInfo.note

                let {priceId, paymentId, provinceId, specialtyId, clinicId} = doctorInfo

                selectedPrice = listPrice.find((item) => item.value === priceId)
                selectedPayment = listPayment.find((item) => item.value === paymentId)
                selectedProvince = listProvince.find((item) => item.value === provinceId)
                selectedSpecialty = listSpecialty.find((item) => item.value === specialtyId)
                selectedClinic = listClinic.find((item) => item.value === clinicId)

                console.log('find item manage doctor', selectedSpecialty, specialtyId)
            }
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedSpecialty: selectedSpecialty,
                selectedClinic: selectedClinic
            })
        } else {
            this.setState({
                contentHTMl: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
                selectedSpecialty: '',
                selectedClinic: ''
            })
        }
    }

    handleChangeSelectDoctorInfo = async (selectedOption, name) => {
        let stateName = name.name
        let copyState = {...this.state}
        copyState[stateName] = selectedOption

        this.setState({
            ...copyState
        })
    }

    handleOnChangeText = (e, id) => {
        let copyState = {...this.state}
        copyState[id] = e.target.value
        this.setState({
            ...copyState
        })
    }

    render() {
        let {
            selectedDoctor,
            selectedPrice,
            selectedPayment,
            selectedProvince,
            selectedSpecialty,
            selectedClinic,

            hasOldData,

            listDoctors,
            listPrice,
            listPayment,
            listProvince,
            listSpecialty,
            listClinic,

            nameClinicError,
            addressClinicError,
            noteError,
            contentMarkdownError,
            contentHTMLError,
            descriptionError,
            selectedDoctorError,
            selectedPriceError,
            selectedPaymentError,
            selectedProvinceError,
            selectedSpecialtyError,
            selectedClinicError
        } = this.state

        let {isShowLoading} = this.state

        return (
            <>
                <LoadingOverlay active={isShowLoading} spinner text='Loading...'>
                    <div className='manage-doctor-container'>
                        <div className='container'>
                            <div className='manage-doctor-title'>
                                <i
                                    className='fas fa-briefcase-medical'
                                    style={{
                                        marginRight: '5px'
                                    }}
                                ></i>
                                <FormattedMessage id='admin.manage-doctor.title'/>
                            </div>
                            <div className='manage-doctor-heading'>Thêm thông tin bác sĩ</div>
                            <div className='more-info'>
                                <div className={`content-left form-group ${selectedDoctorError ? 'error' : ''}`}>
                                    <label>
                                        <FormattedMessage id='admin.manage-doctor.select-doctor'/>
                                    </label>
                                    <Select
                                        classNamePrefix='react-select'
                                        value={selectedDoctor}
                                        onChange={this.handleChangeSelect}
                                        options={listDoctors}
                                        placeholder={<FormattedMessage id='admin.manage-doctor.select-doctor'/>}
                                        name={'selectedDoctor'}
                                    />

                                    <span className='error-message'>Missing email</span>
                                </div>
                                <div className={`content-right form-group ${descriptionError ? 'error' : ''}`}>
                                    <label>
                                        <FormattedMessage id='admin.manage-doctor.intro'/>
                                    </label>
                                    <textarea
                                        rows='4'
                                        className='form-control'
                                        onChange={(e) => this.handleOnChangeText(e, 'description')}
                                        value={this.state.description}
                                    ></textarea>

                                    <span className='error-message'>Missing description</span>
                                </div>
                            </div>
                            <div className='more-info-extra row'>
                                <div className={`col-4 form-group ${selectedPriceError ? 'error' : ''}`}>
                                    <label>
                                        <FormattedMessage id='admin.manage-doctor.price'/>
                                    </label>
                                    <Select
                                        classNamePrefix='react-select'
                                        value={selectedPrice}
                                        name='selectedPrice'
                                        onChange={this.handleChangeSelectDoctorInfo}
                                        options={listPrice}
                                        placeholder={<FormattedMessage id='admin.manage-doctor.price'/>}
                                    />

                                    <span className='error-message'>Missing price</span>
                                </div>
                                <div className={`col-4 form-group ${selectedPaymentError ? 'error' : ''}`}>
                                    <label>
                                        <FormattedMessage id='admin.manage-doctor.payment'/>
                                    </label>
                                    <Select
                                        classNamePrefix='react-select'
                                        value={selectedPayment}
                                        name='selectedPayment'
                                        onChange={this.handleChangeSelectDoctorInfo}
                                        options={listPayment}
                                        placeholder={<FormattedMessage id='admin.manage-doctor.payment'/>}
                                    />

                                    <span className='error-message'>Missing payment</span>
                                </div>
                                <div className={`col-4 form-group ${selectedProvinceError ? 'error' : ''}`}>
                                    <label>
                                        <FormattedMessage id='admin.manage-doctor.province'/>
                                    </label>
                                    <Select
                                        classNamePrefix='react-select'
                                        value={selectedProvince}
                                        name='selectedProvince'
                                        onChange={this.handleChangeSelectDoctorInfo}
                                        options={listProvince}
                                        placeholder={<FormattedMessage id='admin.manage-doctor.province'/>}
                                    />

                                    <span className='error-message'>Missing province</span>
                                </div>
                                <div className={`col-4 form-group ${nameClinicError ? 'error' : ''}`}>
                                    <label>
                                        <FormattedMessage id='admin.manage-doctor.name-clinic'/>
                                    </label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        onChange={(e) => this.handleOnChangeText(e, 'nameClinic')}
                                        value={this.state.nameClinic}
                                    />

                                    <span className='error-message'>Missing name clinic</span>
                                </div>
                                <div className={`col-4 form-group ${addressClinicError ? 'error' : ''}`}>
                                    <label>
                                        <FormattedMessage id='admin.manage-doctor.address-clinic'/>
                                    </label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        onChange={(e) => this.handleOnChangeText(e, 'addressClinic')}
                                        value={this.state.addressClinic}
                                    />

                                    <span className='error-message'>Missing address clinic</span>
                                </div>
                                <div className={`col-4 form-group ${noteError ? 'error' : ''}`}>
                                    <label>
                                        <FormattedMessage id='admin.manage-doctor.note'/>
                                    </label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        onChange={(e) => this.handleOnChangeText(e, 'note')}
                                        value={this.state.note}
                                    />

                                    <span className='error-message'>Missing node</span>
                                </div>
                                <div className={`col-4 form-group ${selectedSpecialtyError ? 'error' : ''}`}>
                                    <label>
                                        <FormattedMessage id='admin.manage-doctor.specialty'/>
                                    </label>
                                    <Select
                                        classNamePrefix='react-select'
                                        value={selectedSpecialty}
                                        name='selectedSpecialty'
                                        onChange={this.handleChangeSelectDoctorInfo}
                                        options={listSpecialty}
                                        placeholder={<FormattedMessage id='admin.manage-doctor.specialty'/>}
                                    />

                                    <span className='error-message'>Missing specialty</span>
                                </div>
                                <div className={`col-4 form-group ${selectedClinicError ? 'error' : ''}`}>
                                    <label>
                                        <FormattedMessage id='admin.manage-doctor.clinic'/>
                                    </label>
                                    <Select
                                        classNamePrefix='react-select'
                                        value={selectedClinic}
                                        name='selectedClinic'
                                        onChange={this.handleChangeSelectDoctorInfo}
                                        options={listClinic}
                                        placeholder={<FormattedMessage id='admin.manage-doctor.clinic'/>}
                                    />
                                </div>
                            </div>
                            <div className={`col-12 form-group ${contentMarkdownError ? 'error' : ''}`}>
                                <div className='manage-doctor-editor '>
                                    <MdEditor
                                        style={{height: '300px'}}
                                        renderHTML={(text) => mdParser.render(text)}
                                        onChange={this.handleEditorChange}
                                        value={this.state.contentMarkdown}
                                    />
                                </div>
                                <span className='error-message'>Missing content markdown</span>
                            </div>

                            <button
                                className={
                                    hasOldData === true ? 'btn save-content-doctor' : 'btn create-content-doctor'
                                }
                                onClick={() => this.handleSaveContentMarkdown()}
                            >
                                {hasOldData === true ? (
                                    <span>
                                        <FormattedMessage id='admin.manage-doctor.save'/>
                                    </span>
                                ) : (
                                    <span>
                                        <FormattedMessage id='admin.manage-doctor.add'/>
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </LoadingOverlay>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        allDoctors: state.admin.allDoctors,
        allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        getRequiredDoctorInfo: () => dispatch(actions.fetchRequiredDoctorInfo()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser)
