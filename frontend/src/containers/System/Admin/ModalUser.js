import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import './ModalUser.scss'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
class ModalUser extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    render() {
        return (
            <Modal isOpen={false}>
                <ModalHeader>Modal title</ModalHeader>
                <ModalBody>Modal body text goes here.</ModalBody>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser)
