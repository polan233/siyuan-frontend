
import React, { useState } from 'react';
import { Col, Row,Button } from 'antd';
import {  notification, Space } from 'antd';
import beianlogo from "./img/beian.png"
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
                <Row align={'bottom'} justify={'space-around'}>
                    <Col flex={"auto"}>
                        {/*TO-DO 联系我们的链接*/ }
                    </Col>
                    <Col flex={"none"}>
                        <img src={beianlogo} href="https://www.beian.gov.cn/portal/"></img>
                        <a href="https://beian.miit.gov.cn/" target="_blank">沪ICP备2023004909号-1</a>
                    </Col>
                    <Col flex={"auto"}>
                        {/*TO-DO 联系我们的链接*/ }
                    </Col>
                    <Col span={4}>
                        <Contact></Contact>
                    </Col>
                </Row>
        );
    }
}

export default Foot;



const close = () => {
  console.log(
    'Notification was closed. Either the close button was clicked or duration time elapsed.',
  );
};
const Contact = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement) => {
    const key = `open${Date.now()}`;
    const btn = (
      <Space>
        <Button type="primary" size="small" onClick={() => api.destroy(key)}>
          OK
        </Button>
      </Space>
    );
    
    api.info({
      message: '联系我们',
      description:
        '开发者邮箱: 1292437680@qq.com',
      placement,
      btn,
      key,
      onClose: close,
    });
  };
  return (
    <>
      {contextHolder}
      <Button className='contact' type="link" onClick={()=>openNotification('bottom')}>
        联系我们
      </Button>
    </>
  );
};
