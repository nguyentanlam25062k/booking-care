import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './TableSpecialty.scss'
import {
    BsFillCaretDownFill,
    BsFillCaretUpFill,
    BsArrowLeft,
    BsArrowRight,
    BsFillPersonPlusFill,
    BsFillPlusCircleFill,
    BsSearch
} from 'react-icons/bs'
import { FaHeart } from 'react-icons/fa'
import { debounce } from 'lodash'
import { withRouter } from 'react-router'

class TableSpecialty extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrSpecialty: []
        }
        this.handleInputThrottled = debounce(this.onChangeSearchSpecialty, 300)
    }

    async componentDidMount() {
        let { listSpecialty } = this.props
        this.setState({
            arrSpecialty: listSpecialty
        })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
        if (prevProps.listSpecialty !== this.props.listSpecialty) {
            this.setState({
                arrSpecialty: this.props.listSpecialty
            })
        }
    }

    handleEditSpecialty = async (user) => {
        let { handleOpenModal, handleCreateSpecialty, handleActionSpecialty } = this.props
        handleOpenModal()
        await handleActionSpecialty('EDIT')
        handleCreateSpecialty(user)
    }

    handleAddSpecialty = async () => {
        let { handleOpenModal, handleActionSpecialty, handleCreateSpecialty } = this.props
        handleOpenModal()
        await handleActionSpecialty('CREATE')
        handleCreateSpecialty()
    }
    handleDeleteSpecialty = (user) => {
        let { getIdSpecialtyDelete, handleOpenModalDelete } = this.props
        handleOpenModalDelete()
        getIdSpecialtyDelete(user.id)
    }

    handleSortUser = (user, type) => {
        if (type === 'email') {
            this.setState({
                arrSpecialty: user.sort((a, b) => a[type].split('@')[0].localeCompare(b[type].split('@')[0]))
            })
        } else if (type === 'address') {
            this.setState({
                arrSpecialty: user.sort((a, b) => a[type].localeCompare(b[type]))
            })
        } else {
            this.setState({
                arrSpecialty: user.sort((a, b) => a[type] - b[type])
            })
        }
    }

    handleReverseSortUser = (user, type) => {
        if (type === 'email') {
            this.setState({
                arrSpecialty: user.sort((a, b) => b[type].split('@')[0].localeCompare(a[type].split('@')[0]))
            })
        } else if (type === 'address') {
            this.setState({
                arrSpecialty: user.sort((a, b) => b[type].localeCompare(a[type]))
            })
        } else {
            this.setState({
                arrSpecialty: user.sort((a, b) => b[type] - a[type])
            })
        }
    }

    onChangeSearchSpecialty = async (e) => {
        let term = e.target.value
        let { handleSearchSpecialty } = this.props
        handleSearchSpecialty(term)
    }

    handleViewDetailSpecialty = (specialtyId) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${specialtyId}`)
        }
    }

    render() {
        let { arrSpecialty } = this.state
        let { pageCurrent, totalPages, handleNextPage, handlePrevPage, totalRows } = this.props
        return (
            <>
                <div className='table'>
                    <div className='table-header'>
                        <div className='table-tab'>Chuyên khoa </div>
                        <div className='table-search'>
                            <BsSearch className='table-icon-search' />
                            <input type='text' placeholder='Tìm kiếm...' onChange={this.handleInputThrottled} />
                        </div>
                    </div>
                    <div className='table-body'>
                        <table className='table-manage'>
                            <tbody>
                                <tr>
                                    <th>
                                        #
                                        <span
                                            className='btn-sort up'
                                            onClick={() => this.handleSortUser(arrSpecialty, 'id')}
                                        >
                                            <BsFillCaretUpFill />
                                        </span>
                                        <span
                                            className='btn-sort down'
                                            onClick={() => this.handleReverseSortUser(arrSpecialty, 'id')}
                                        >
                                            <BsFillCaretDownFill />
                                        </span>
                                    </th>
                                    {/* <th>
                                        ID
                                        <span
                                            className='btn-sort up'
                                            onClick={() => this.handleSortUser(arrSpecialty, 'id')}
                                        >
                                            <BsFillCaretUpFill />
                                        </span>
                                        <span
                                            className='btn-sort down'
                                            onClick={() => this.handleReverseSortUser(arrSpecialty, 'id')}
                                        >
                                            <BsFillCaretDownFill />
                                        </span>
                                    </th> */}
                                    <th>
                                        ID - Tên chuyên khoa
                                        <span
                                            className='btn-sort up'
                                            onClick={() => this.handleSortUser(arrSpecialty, 'name')}
                                        >
                                            <BsFillCaretUpFill />
                                        </span>
                                        <span
                                            className='btn-sort down'
                                            onClick={() => this.handleReverseSortUser(arrSpecialty, 'name')}
                                        >
                                            <BsFillCaretDownFill />
                                        </span>
                                    </th>
                                    <th>
                                        Xem trực tiếp
                                        <span
                                            className='btn-sort up'
                                            onClick={() => this.handleSortUser(arrSpecialty, 'address')}
                                        >
                                            <BsFillCaretUpFill />
                                        </span>
                                        <span
                                            className='btn-sort down'
                                            onClick={() => this.handleReverseSortUser(arrSpecialty, 'address')}
                                        >
                                            <BsFillCaretDownFill />
                                        </span>
                                    </th>

                                    <th>Actions</th>
                                </tr>
                                {arrSpecialty &&
                                    arrSpecialty.length > 0 &&
                                    arrSpecialty.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div>{index + 1}</div>
                                            </td>
                                            {/* <td>{item.id}</td> */}
                                            <td>
                                                <div className='table-name'>
                                                    <span
                                                        className='table-icon'
                                                        style={{
                                                            background: `url(${item.image}) center / contain no-repeat`
                                                        }}
                                                    ></span>
                                                    <span>{`${item.name}`}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div
                                                    style={{
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => this.handleViewDetailSpecialty(item.id)}
                                                >
                                                    <span
                                                        style={{
                                                            color: '#6c757d',
                                                            marginRight: '5px'
                                                        }}
                                                    >
                                                        Link:
                                                    </span>
                                                    <span
                                                        style={{
                                                            color: '#0d6efd'
                                                        }}
                                                    >{`http://localhost:3000/detail-specialty/${item.id}`}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    className='btn btn-edit'
                                                    onClick={() => this.handleEditSpecialty(item)}
                                                >
                                                    <i className='fas fa-pencil-alt' style={{ marginRight: '5px' }}></i>
                                                    Chỉnh sửa
                                                </button>
                                                <button
                                                    className='btn btn-delete'
                                                    onClick={() => this.handleDeleteSpecialty(item)}
                                                >
                                                    <i className='fas fa-trash' style={{ marginRight: '5px' }}></i>
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='table-footer'>
                        <div className='table-add col-4' onClick={() => this.handleAddSpecialty()}>
                            {/* <BsFillPersonPlusFill /> */}
                            <span>Thêm mới phòng khám</span>
                            <BsFillPlusCircleFill />
                        </div>
                        <div className='table-total-row col-4'>{`Tổng số phòng khám hiện tại (${totalRows})`}</div>
                        <div className='table-pagination col-4'>
                            <div
                                className='table-page prev'
                                style={{ pointerEvents: pageCurrent <= 1 ? 'none' : 'auto' }}
                                onClick={() => {
                                    handlePrevPage()
                                }}
                            >
                                <BsArrowLeft /> prev
                            </div>
                            <div className='table-page'>1</div>
                            <div className='table-page'>2</div>
                            <div className='table-page'>3</div>
                            <div className='table-page'>...</div>
                            <div className='table-page'>10</div>
                            <div
                                className='table-page next'
                                style={{ pointerEvents: pageCurrent >= totalPages ? 'none' : 'auto' }}
                                onClick={() => {
                                    handleNextPage()
                                }}
                            >
                                next <BsArrowRight />
                            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TableSpecialty))
