import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './CategoryDoctor.scss'
import HomeHeader from '../HomePage/HomeHeader'

import { BsSearch } from 'react-icons/bs'
import { getAllDoctors, searchDoctor } from '../../services/userService'
import _ from 'lodash'
import { withRouter } from 'react-router'
class CategoryDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listDoctor: [],
            isSearch: false
        }
    }

    async componentDidMount() {
        let resListDoctor = await getAllDoctors()
        if (resListDoctor?.errCode === 0) {
            this.setState({
                listDoctor: resListDoctor.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    searchDoctor = _.debounce(async (e) => {
        //search doctor page 1 with 100 rows

        let searchTerm = e.target.value
        let resListDoctor = await searchDoctor(searchTerm, 1, 100)
        if (resListDoctor?.errCode === 0) {
            this.setState({
                listDoctor: resListDoctor.data.rows,
                isSearch: true
            })
        } else {
            this.setState({
                listDoctor: [],
                isSearch: true
            })
        }
    }, 300)

    handleViewDetailDoctor = (doctorId) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctorId}`)
        }
    }

    render() {
        let { listDoctor, totalDoctor } = this.state
        console.log('check listDoctor', listDoctor)
        return (
            <>
                <HomeHeader isThemeBlue={true} />
                <div className='category-doctor'>
                    <div className='category-doctor-top'>
                        <div className='category-doctor-search'>
                            <BsSearch className='category-doctor-icon' />
                            <input
                                type='category-doctor-text'
                                placeholder='Tìm kiếm bác sĩ...'
                                onChange={(e) => this.searchDoctor(e)}
                            />
                        </div>
                    </div>
                    <div className='category-doctor-body'>
                        <div className='container'>
                            <div className='category-doctor-heading'>Danh sách bác sĩ</div>
                            {listDoctor?.length > 0 ? (
                                listDoctor.map((item, index) => (
                                    <div
                                        className='category-doctor-item'
                                        key={index}
                                        onClick={() => this.handleViewDetailDoctor(item.id)}
                                    >
                                        <div
                                            className='category-doctor-image'
                                            style={{
                                                background: `url(${item?.image}) center / cover no-repeat`
                                            }}
                                        ></div>
                                        <div className='category-doctor-content'>
                                            <div className='category-doctor-title'>
                                                {`${item?.positionData?.valueVi ?? ''} ${item?.lastName ?? ''} ${
                                                    item?.firstName ?? ''
                                                }`}
                                            </div>
                                            <div className='category-doctor-text'>{`${
                                                item?.specialtyData?.name ?? ''
                                            }`}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='category-doctor-no-data'>Không tìm thấy bác sĩ</div>
                            )}
                        </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoryDoctor))
