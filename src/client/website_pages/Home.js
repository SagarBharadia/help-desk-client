import React, { Component } from 'react'
import Header from '../layout/Header';
import Footer from '../layout/Footer';

class Home extends Component {
    render() {
        return (
            <div>
                <Header />
                <section>
                    <h1>Home</h1>
                </section>
                <Footer />
            </div>
        )
    }
}

export default Home
