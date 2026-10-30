import React from 'react';
import { Link } from 'react-router-dom';
import "./home.css"
import bg from "../dist/bg.png"
import coin from "../dist/coin.png"
import multipleCoins from "../dist/multiple-coins.png"

function Home() {

    return(
        <div className="text-center p-2 p-lg-4 overflow-hidden">
            <div style={{height: "100vh"}} className='d-flex flex-column'>
                <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,700&display=swap" rel="stylesheet"></link>
                <img style={{right: 0, top: 0, zIndex: -1}} className='w-100 position-absolute img-fluid hero-image' src={bg} alt="" />
                <nav className='p-3 p-lg-0 navbar d-flex justify-content-center'>
                    <div className='w-75'>
                        <div className=' d-flex align-items-center'>
                            <img className='logo img-fluid' src="./spendWise-logo.png" alt="" />
                            <Link className='text-decoration-none text-light fs-2 fw-medium mx-2' to="/">SpendWise</Link>
                        </div>
                    </div>
                </nav>
                <section className='hero-container container w-100 p-3 d-flex flex-column align-items-between justify-content-evenly mb-5 mb-lg-0'>
                    <div className='hero-text-container'>
                        <h1 className='hero-text text-light my-4'>Keep an eye on your money</h1>
                        <div className='my-5'>
                            <a href='/dashboard' className='btn btn-primary fw-medium px-2 px-md-4 mx-1'>Start now</a>
                            <a href='/' className='btn btn-light text-primary px-2 px-md-4 fw-medium mx-1'>Learn more</a>
                        </div>
                    </div>
                    <div style={{top: 0, right: 0, zIndex: -1, height: "100vh", overflow: "hidden"}} className='coins-container position-absolute w-100 d-flex justify-content-evenly align-items-center mt-5 px-0 px-lg-5 gap'>
                        <img className='coin img-fluid mt-5' src={coin} alt="" />
                        <img className='multiple-coins img-fluid mt-5 ' src={multipleCoins} alt="" />
                    </div>
                </section>
            </div>
            <section style={{height: "100vh"}}>
                <div className='w-100 h-100 d-flex flex-column flex-lg-row p-lg-5 p-1 justify-content-center align-items-center'>
                    <div className='w-50 h-50 d-flex justify-content-center'>
                        <div style={{minWidth: "364px", height: "428px"}} className='w-100 left-side text-start d-flex flex-column justify-content-evenly rounded-2 p-4 m-1 m-lg-4'>
                            <h1 className='s fw-semibold' style={{color: "#315DED"}}>What is Spend Wise?</h1>
                            <h4 className='w-100 fw-lighter py-3 fs-2'>SpendWise is a user friendly platform that helps you keep track and monitor your money. Ever asked yourself where did you spend your on? Well, Spend Wise answers that.</h4>
                            <div className='d-flex w-100 justify-content-end'>
                                <div className='circle'></div>
                                <div className='circle'></div>
                                <div className='circle'></div>
                            </div>
                        </div>
                    </div>
                    <div className='w-auto h-50 m-1 m-lg-4 d-flex'>
                        <div className='p-2 bg-dark-subtle rounded-2 m-2 w-100'>
                            <h2>Easy to use</h2>
                        </div>
                        <div className='p-2 bg-dark-subtle rounded-2 m-2 w-100'>
                            <h2>Easy to use</h2>
                        </div>
                        <div className='p-2 bg-dark-subtle rounded-2 m-2 w-100'>
                            <h2>Easy to use</h2>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
