import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './TableClinic.scss'
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

class TableClinic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrClinic: []
        }
        this.handleInputThrottled = debounce(this.onChangeSearchClinic, 300)
    }

    async componentDidMount() {
        let { listClinic } = this.props
        this.setState({
            arrClinic: listClinic
        })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
        if (prevProps.listClinic !== this.props.listClinic) {
            this.setState({
                arrClinic: this.props.listClinic
            })
        }
    }

    handleEditClinic = async (user) => {
        let { handleOpenModal, handleCreateClinic, handleActionClinic } = this.props
        handleOpenModal()
        await handleActionClinic('EDIT')
        handleCreateClinic(user)
    }

    handleAddClinic = async () => {
        let { handleOpenModal, handleActionClinic, handleCreateClinic } = this.props
        handleOpenModal()
        await handleActionClinic('CREATE')
        handleCreateClinic()
    }
    handleDeleteClinic = (user) => {
        let { getIdClinicDelete, handleOpenModalDelete } = this.props
        handleOpenModalDelete()
        getIdClinicDelete(user.id)
    }

    handleSortUser = (user, type) => {
        if (type === 'email') {
            this.setState({
                arrClinic: user.sort((a, b) => a[type].split('@')[0].localeCompare(b[type].split('@')[0]))
            })
        } else if (type === 'address') {
            this.setState({
                arrClinic: user.sort((a, b) => a[type].localeCompare(b[type]))
            })
        } else {
            this.setState({
                arrClinic: user.sort((a, b) => a[type] - b[type])
            })
        }
    }

    handleReverseSortUser = (user, type) => {
        if (type === 'email') {
            this.setState({
                arrClinic: user.sort((a, b) => b[type].split('@')[0].localeCompare(a[type].split('@')[0]))
            })
        } else if (type === 'address') {
            this.setState({
                arrClinic: user.sort((a, b) => b[type].localeCompare(a[type]))
            })
        } else {
            this.setState({
                arrClinic: user.sort((a, b) => b[type] - a[type])
            })
        }
    }

    onChangeSearchClinic = async (e) => {
        let term = e.target.value
        let { handleSearchClinic } = this.props
        handleSearchClinic(term)
    }

    render() {
        let { arrClinic } = this.state
        let { pageCurrent, totalPages, handleNextPage, handlePrevPage, totalRows } = this.props
        return (
            <>
                <div className='table'>
                    <div className='table-header'>
                        <div className='table-tab'>phòng khám </div>
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
                                            onClick={() => this.handleSortUser(arrClinic, 'id')}
                                        >
                                            <BsFillCaretUpFill />
                                        </span>
                                        <span
                                            className='btn-sort down'
                                            onClick={() => this.handleReverseSortUser(arrClinic, 'id')}
                                        >
                                            <BsFillCaretDownFill />
                                        </span>
                                    </th>
                                    {/* <th>
                                        ID
                                        <span
                                            className='btn-sort up'
                                            onClick={() => this.handleSortUser(arrClinic, 'id')}
                                        >
                                            <BsFillCaretUpFill />
                                        </span>
                                        <span
                                            className='btn-sort down'
                                            onClick={() => this.handleReverseSortUser(arrClinic, 'id')}
                                        >
                                            <BsFillCaretDownFill />
                                        </span>
                                    </th> */}
                                    <th>
                                        ID - Tên bệnh viện
                                        <span
                                            className='btn-sort up'
                                            onClick={() => this.handleSortUser(arrClinic, 'name')}
                                        >
                                            <BsFillCaretUpFill />
                                        </span>
                                        <span
                                            className='btn-sort down'
                                            onClick={() => this.handleReverseSortUser(arrClinic, 'name')}
                                        >
                                            <BsFillCaretDownFill />
                                        </span>
                                    </th>
                                    <th>
                                        Địa chỉ
                                        <span
                                            className='btn-sort up'
                                            onClick={() => this.handleSortUser(arrClinic, 'address')}
                                        >
                                            <BsFillCaretUpFill />
                                        </span>
                                        <span
                                            className='btn-sort down'
                                            onClick={() => this.handleReverseSortUser(arrClinic, 'address')}
                                        >
                                            <BsFillCaretDownFill />
                                        </span>
                                    </th>

                                    <th>Actions</th>
                                </tr>
                                {arrClinic &&
                                    arrClinic.length > 0 &&
                                    arrClinic.map((item, index) => (
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
                                                    <span>{`${item.id} - ${item.name}`}</span>
                                                </div>
                                            </td>
                                            <td>{item.address}</td>
                                            <td>
                                                <button
                                                    className='btn btn-edit'
                                                    onClick={() => this.handleEditClinic(item)}
                                                >
                                                    <i className='fas fa-pencil-alt' style={{ marginRight: '5px' }}></i>
                                                    Chỉnh sửa
                                                </button>
                                                <button
                                                    className='btn btn-delete'
                                                    onClick={() => this.handleDeleteClinic(item)}
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
                        <div className='table-add col-4' onClick={() => this.handleAddClinic()}>
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

export default connect(mapStateToProps, mapDispatchToProps)(TableClinic)
