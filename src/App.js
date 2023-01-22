import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import { Layout, Space,Col, Divider, Row } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import logoPic from './img/logo192.png';
const { Search } = Input;
const { Header, Footer, Sider, Content } = Layout;

const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
};
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#108ee9',
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#3ba0e9',
};
const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
};
const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1890ff',
    }}
  />
);

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
              <Search id='topSearch' placeholder="input search text"  allowClear onSearch={onSearch} style={{ width: 300 }} />
          </Col>
          <Col flex="auto" />
        </Row>
      </div>
    );
  }
}

const App = () => (
  <Space
    direction="vertical"
    style={{
      width: '100%',
    }}
    size={[0, 48]}
  >
    <Layout>
      <Top/>
    </Layout>
  </Space>
);
export default App;

