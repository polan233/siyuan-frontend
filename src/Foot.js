
import React, { useState } from 'react';
import { Col, Row,Button } from 'antd';
import './App.css'

const footText="本网站与数据还处于测试阶段，有问题请通过下方链接联系我们"

class Foot extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div className='foot'>
                <Slogan text={footText}></Slogan>
                <Links></Links>
            </div>
        );
    }
}

function Slogan(props){
    return(
        <div className='slogan'>
            <p className='paragraph'>{props.text}</p>
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
                    <Col flex={"auto"}>
                        {/*TO-DO 联系我们的链接*/ }
                    </Col>
                    <Col span={4}>
                        <Button type='link' ghost>联系我们</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Foot;