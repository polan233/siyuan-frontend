import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import {  Col, Row } from 'antd';
import { Input } from 'antd';
import logoPic from './img/logo192.png';
const { Search } = Input;


const onSearch = (value) => console.log(value);

class Top extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(
      <div className='Top'>
        <Row justify="space-around" align={"middle"}>
          <Col flex={"200px"}>
            <img id='topLogo' src={logoPic} className="logoBig" width={"200px"} height={"100px"} alt="LOGO"/>
          </Col>
          <Col flex="auto" />
          <Col flex={"300px"}>
              <Search id='topSearch' size='large' placeholder="input search text"  allowClear onSearch={onSearch} style={{ width: 300 }} />
          </Col>
          <Col flex="auto" />
        </Row>
      </div>
    );
  }
}
export default Top;