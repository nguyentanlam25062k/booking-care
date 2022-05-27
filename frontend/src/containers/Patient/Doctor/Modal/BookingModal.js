import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";
import DatePicker from "../../../../components/Input/DatePicker";
import ProfileDoctor from "../ProfileDoctor";
import * as actions from "../../../../store/actions";
import Select from "react-select";

import "./BookingModal.scss";
import { LANGUAGES } from "../../../../utils";
import { postPatientAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import _ from "lodash";
import moment from "moment";
import { withRouter } from "react-router";

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "patient 01",
            phoneNumber: "0929697411",
            email: "patient01@gmail.com",
            address: "chu se, gia lai",
            reason: "dau bung",
            selectedGender: "",
            birthday: "",
            genders: "",
            doctorId: "",
            timeType: ""
        };
    }

    async componentDidMount() {
        this.props.getGenders();
        let doctorId = this.props.match.params.id;
        this.setState({
            doctorId: doctorId
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            });
        }
        if (prevProps.genders !== this.props.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
            });
        }
        if (prevProps.dataTime !== this.props.dataTime) {
            let { dataTime } = this.props;
            let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : "";
            console.log(doctorId);
            if (doctorId) {
                this.setState({
                    doctorId: doctorId,
                    timeType: dataTime.timeType
                });
            }
        }
    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            result = data.map((item) => ({
                label: language === LANGUAGES.VI ? item.valueVi : item.valueEn,
                value: item.keyMap
            }));
        }
        return result;
    };

    handleOnChangeInput = (e, id) => {
        let stateCopy = { ...this.state };
        stateCopy[id] = e.target.value;
        this.setState({
            ...stateCopy
        });
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        });
    };

    handleChangeSelect = (selectedOption) => {
        this.setState({
            selectedGender: selectedOption
        });
    };

    buildTimeBooking = (dataTime) => {
        let { language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            let time = language === LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            let date =
                language === LANGUAGES.VI
                    ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
                    : moment
                          .unix(+dataTime.date / 1000)
                          .locale("en")
                          .format("dddd - MM/DD/YYYY");

            return `${time} ${date}`;
        }
        return ``;
    };

    buildDoctorName = (dataName) => {
        let { language } = this.props;
        let name = "";
        if (dataName && !_.isEmpty(dataName)) {
            name =
                language === LANGUAGES.VI
                    ? `${dataName.doctorData.firstName} ${dataName.doctorData.lastName}`
                    : `${dataName.doctorData.lastName} ${dataName.doctorData.firstName}`;
        }
        return name;
    };

    handleConfirmBooking = async () => {
        // validate input
        let { fullName, phoneNumber, email, address, reason, selectedGender, birthday, doctorId, timeType } =
            this.state;
        let { language, dataTime } = this.props;
        let date = new Date(birthday).getTime();
        let timeString = this.buildTimeBooking(dataTime);
        let doctorName = this.buildDoctorName(dataTime);

        let res = await postPatientAppointment({
            fullName,
            phoneNumber,
            email,
            address,
            reason,
            selectedGender: selectedGender.value,
            date: dataTime.date,
            birthday: date,
            doctorId: doctorId,
            timeType,
            language,
            timeString,
            doctorName
        });

        if (res && res.errCode === 0) {
            toast.success("Booking appointment success");
            this.props.closeBookingModal();
        } else {
            toast.error(res.errMessage || "Booking appointment error");
        }
        console.log("check state booking modal", this.state);
    };

    render() {
        // toggle={}
        let { fullName, phoneNumber, email, address, reason, birthday, genders, selectedGender } = this.state;
        let { isOpenModal, closeBookingModal, dataTime } = this.props;
        let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : "";

        return (
            <Modal isOpen={isOpenModal} className={"booking-modal-container"} size="lg" centered>
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <span className="left">
                            <FormattedMessage id="patient.booking-modal.title" />
                        </span>
                        <span className="right" onClick={() => closeBookingModal()}>
                            <i className="fas fa-times"></i>
                        </span>
                    </div>
                    <div className="booking-modal-body">
                        {/* {JSON.stringify(dataTime)} */}

                        <div className="doctor-info">
                            <ProfileDoctor
                                doctorId={doctorId}
                                isShowDescriptionDoctor={false}
                                dataTime={dataTime}
                                isShowLinkDetail={false}
                                isShowPrice={true}
                            />
                        </div>
                        <div className="row">
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.full-name" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={fullName}
                                    onChange={(e) => {
                                        this.handleOnChangeInput(e, "fullName");
                                    }}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.phone-number" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        this.handleOnChangeInput(e, "phoneNumber");
                                    }}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.email" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => {
                                        this.handleOnChangeInput(e, "email");
                                    }}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.address" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={address}
                                    onChange={(e) => {
                                        this.handleOnChangeInput(e, "address");
                                    }}
                                />
                            </div>
                            <div className="col-12 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.reason" />
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={reason}
                                    onChange={(e) => {
                                        this.handleOnChangeInput(e, "reason");
                                    }}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.birthday" />
                                </label>
                                <DatePicker
                                    onChange={this.handleOnChangeDatePicker}
                                    className="form-control"
                                    value={birthday}
                                />
                            </div>
                            <div className="col-6 form-group">
                                <label>
                                    <FormattedMessage id="patient.booking-modal.gender" />
                                </label>
                                <Select value={selectedGender} onChange={this.handleChangeSelect} options={genders} />
                            </div>
                        </div>
                    </div>
                    <div className="booking-modal-footer">
                        <button className="btn-booking-confirm" onClick={() => this.handleConfirmBooking()}>
                            <FormattedMessage id="patient.booking-modal.btn-confirm" />
                        </button>
                        <button className="btn-booking-cancel" onClick={() => closeBookingModal()}>
                            <FormattedMessage id="patient.booking-modal.btn-cancel" />
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart())
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BookingModal));
