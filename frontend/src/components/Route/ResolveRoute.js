import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
// import './ResolveRoute.scss'
import { Route, Switch, Redirect } from 'react-router-dom'
import RoleAdmin from './RoleAdmin'

class ResolveRoute extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    async componentDidMount() {}

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
    }

    resolveRoleAdmin = () => {
        let { role, component, ...props } = this.props
        return role === 'R1' ? <Route component={RoleAdmin} {...props} /> : null
    }

    render() {
        return this.resolveRoleAdmin()
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

export default connect(mapStateToProps, mapDispatchToProps)(ResolveRoute)
