
import React, { useState } from 'react';
import { Col, Row } from 'antd';
import './App.css'


class Foot extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className='foot'>
                <Slogan text={"2131231231231231231231"}></Slogan>
                <Links></Links>
            </div>
        );
    }
}

function Slogan(props){
    return(
        <div className='slogan'>
            <p>{props.text}</p>
        </div>
    );
}

class Links extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className='links'>
                <Row align={'middle'} justify={'space-around'}>
                    <Col span={4}>col-4</Col>
                    <Col span={4}>col-4</Col>
                    <Col span={4}>col-4</Col>
                    <Col span={4}>col-4</Col>
                    <Col span={4}>col-4</Col>
                    <Col span={4}>col-4</Col>
                </Row>
            </div>
        );
    }
}

export default Foot;