import React, { Component } from 'react'
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll'

export default class Navbar extends Component {
    scrollToTop = () => {
        scroll.scrollToTop()
    }

    render() {
        return (
            <nav className='nav' id='navbar'>
                <div className='nav-content'>
                    <button className='btn btn-danger' onClick={this.scrollToTop}>
                        logo
                    </button>
                    <ul className='nav-items'>
                        <li className='nav-item'>
                            <ScrollLink
                                activeClass='active'
                                to='section1'
                                spy={true}
                                smooth={true}
                                offset={-70}
                                duration={500}
                            >
                                Section 1
                            </ScrollLink>
                        </li>
                        <li className='nav-item'>
                            <ScrollLink
                                activeClass='active'
                                to='section2'
                                spy={true}
                                smooth={true}
                                offset={-70}
                                duration={500}
                            >
                                Section 2
                            </ScrollLink>
                        </li>
                        <li className='nav-item'>
                            <ScrollLink
                                activeClass='active'
                                to='section3'
                                spy={true}
                                smooth={true}
                                offset={-70}
                                duration={500}
                            >
                                Section 3
                            </ScrollLink>
                        </li>
                        <li className='nav-item'>
                            <ScrollLink
                                activeClass='active'
                                to='section4'
                                spy={true}
                                smooth={true}
                                offset={-70}
                                duration={500}
                            >
                                Section 4
                            </ScrollLink>
                        </li>
                        <li className='nav-item'>
                            <ScrollLink
                                activeClass='active'
                                to='section5'
                                spy={true}
                                smooth={true}
                                offset={-70}
                                duration={500}
                            >
                                Section 5
                            </ScrollLink>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}
