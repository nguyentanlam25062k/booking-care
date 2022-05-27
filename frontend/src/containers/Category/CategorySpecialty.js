import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './CategorySpecialty.scss'
import HomeHeader from '../HomePage/HomeHeader'

import { BsSearch } from 'react-icons/bs'
import { getAllSpecialty, searchSpecialty } from '../../services/userService'
import _ from 'lodash'
import { withRouter } from 'react-router'
class CategorySpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listSpecialty: [],
            isSearch: false
        }
    }

    async componentDidMount() {
        let resListSpecialty = await getAllSpecialty()
        if (resListSpecialty?.errCode === 0) {
            this.setState({
                listSpecialty: resListSpecialty.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    searchSpecialty = _.debounce(async (e) => {
        //search specialty page 1 with 100 rows

        let searchTerm = e.target.value
        let resListSpecialty = await searchSpecialty(searchTerm, 1, 100)
        if (resListSpecialty?.errCode === 0) {
            this.setState({
                listSpecialty: resListSpecialty.data.rows,
                isSearch: true
            })
        } else {
            this.setState({
                listSpecialty: [],
                isSearch: true
            })
        }
    }, 300)

    handleViewDetailSpecialty = (specialtyId) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${specialtyId}`)
        }
    }

    render() {
        let { listSpecialty, totalSpecialty } = this.state
        console.log('check listSpecialty', listSpecialty)
        return (
            <>
                <HomeHeader isThemeBlue={true} />
                <div className='category-specialty'>
                    <div className='category-specialty-top'>
                        <div className='category-specialty-search'>
                            <BsSearch className='category-specialty-icon' />
                            <input
                                type='category-specialty-text'
                                placeholder='Tìm kiếm chuyên khoa...'
                                onChange={(e) => this.searchSpecialty(e)}
                            />
                        </div>
                    </div>
                    <div className='category-specialty-body'>
                        <div className='container'>
                            <div className='category-specialty-heading'>Danh sách chuyên khoa</div>
                            {listSpecialty?.length > 0 ? (
                                listSpecialty.map((item, index) => (
                                    <div
                                        className='category-specialty-item'
                                        key={index}
                                        onClick={() => this.handleViewDetailSpecialty(item.id)}
                                    >
                                        <div
                                            className='category-specialty-image'
                                            style={{
                                                background: `url(${item?.image}) center / cover no-repeat`
                                            }}
                                        ></div>
                                        <div className='category-specialty-content'>
                                            <div className='category-specialty-title'>{` ${item?.name ?? ''} `}</div>
                                            <div className='category-specialty-text'>{`${
                                                item?.specialtyData?.name ?? ''
                                            }`}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='category-specialty-no-data'>Không tìm thấy chuyên khoa</div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategorySpecialty))
