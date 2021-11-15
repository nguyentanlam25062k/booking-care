import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick'

class HomeFooter extends Component {
    render() {
        return (
            <div className='home-footer'>
                <p>
                    &copy; 2021 Hỏi Dân IT với Eric. More information, pleas visit my youtube chanel.
                    <a href='#'>&larr; Click here! &rarr;</a>
                </p>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter)
