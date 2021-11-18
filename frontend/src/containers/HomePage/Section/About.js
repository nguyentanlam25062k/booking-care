import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import Slider from 'react-slick'

class About extends Component {
    render() {
        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>Truyền thông nói về chanel hỏi dân IT</div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe
                            width='100%'
                            height='400px'
                            src='https://www.youtube.com/embed/8HWVegyvLxI?list=RD8HWVegyvLxI'
                            title='YouTube video player'
                            frameBorder='0'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className='content-right'>
                        <p>
                            Mira que escuchado música a lo largo de mi vida. desde Metallica hasta Enya y deás. Este
                            tema, puedo decir que es la bso de vida. De verdad muchísimas gracias al creador/ra. ME
                            ENCANTA!
                        </p>
                    </div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About)
