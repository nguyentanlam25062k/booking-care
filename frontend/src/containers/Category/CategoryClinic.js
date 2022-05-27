import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './CategoryClinic.scss'
import HomeHeader from '../HomePage/HomeHeader'

import { BsSearch } from 'react-icons/bs'
import { getAllClinic, searchClinic } from '../../services/userService'
import _ from 'lodash'
import { withRouter } from 'react-router'
class CategoryClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listClinic: [],
            isSearch: false
        }
    }

    async componentDidMount() {
        let resListClinic = await getAllClinic()
        if (resListClinic?.errCode === 0) {
            this.setState({
                listClinic: resListClinic.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    searchClinic = _.debounce(async (e) => {
        //search clinic page 1 with 100 rows

        let searchTerm = e.target.value
        let resListClinic = await searchClinic(searchTerm, 1, 100)
        if (resListClinic?.errCode === 0) {
            this.setState({
                listClinic: resListClinic.data.rows,
                isSearch: true
            })
        } else {
            this.setState({
                listClinic: [],
                isSearch: true
            })
        }
    }, 300)

    handleViewDetailClinic = (clinicId) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinicId}`)
        }
    }

    render() {
        let { listClinic, totalClinic } = this.state
        console.log('check listClinic', listClinic)
        return (
            <>
                <HomeHeader isThemeBlue={true} />
                <div className='category-clinic'>
                    <div className='category-clinic-top'>
                        <div className='category-clinic-search'>
                            <BsSearch className='category-clinic-icon' />
                            <input
                                type='category-clinic-text'
                                placeholder='Tìm kiếm phòng khám...'
                                onChange={(e) => this.searchClinic(e)}
                            />
                        </div>
                    </div>
                    <div className='category-clinic-body'>
                        <div className='container'>
                            <div className='category-clinic-heading'>Danh sách phòng khám</div>
                            {listClinic?.length > 0 ? (
                                listClinic.map((item, index) => (
                                    <div
                                        className='category-clinic-item'
                                        key={index}
                                        onClick={() => this.handleViewDetailClinic(item.id)}
                                    >
                                        <div
                                            className='category-clinic-image'
                                            style={{
                                                background: `url(${item?.image}) center / cover no-repeat`
                                            }}
                                        ></div>
                                        <div className='category-clinic-content'>
                                            <div className='category-clinic-title'>{` ${item?.name ?? ''} `}</div>
                                            <div className='category-clinic-text'>{`${
                                                item?.clinicData?.name ?? ''
                                            }`}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='category-clinic-no-data'>Không tìm thấy phòng khám</div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoryClinic))
