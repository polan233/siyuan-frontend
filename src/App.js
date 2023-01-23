import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import { Layout, Space,Col, Divider, Row,Typography } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import logoPic from './img/logo192.png';
import { MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
const { Search } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Title, Paragraph, Text, Link } = Typography;
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
  backgroundColor: '#e6f4ff',
};
const leftNavStyle = {
  textAlign: 'left',
  lineHeight: '80px',
  color: '#fff',
  backgroundColor: '#e6f4ff',
}
const siderStyle = {
  textAlign: 'left',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#e6f4ff',
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
              <Search id='topSearch' size='large' placeholder="input search text"  allowClear onSearch={onSearch} style={{ width: 300 }} />
          </Col>
          <Col flex="auto" />
        </Row>
      </div>
    );
  }
}

//导航栏
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
    getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
  ]),
  getItem('Navigation Two', 'sub2', <MailOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),
  {
    type: 'divider',
  },
  getItem('Navigation Three', 'sub4', <MailOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),
  getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
];

class MainContent extends React.Component{
  constructor(props){
    super(props);
  }
  onNavClick = (e) => {
    console.log('click ', e);
  };
  render(){
    return(
      <div className='mainContent'>
        <Layout>
          <Sider className='leftNav' style={leftNavStyle}>
            <div className='leftNav'>
              <Menu
                  onClick={this.onNavClick.bind(this)}
                  style={{
                    width: 256,
                  }}
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  mode="inline"
                  items={items}
              />
            </div>
          </Sider>
          <Content style={contentStyle}>
            <div className='map'>
              
            </div>
          </Content>
          <Sider  style={siderStyle}>
            <div className='info'>
              <Typography>
                <Title level={2}>Introduction</Title>
                <Paragraph>
                  In the process of internal desktop applications development, many different design specs and
                  implementations would be involved, which might cause designers and developers difficulties and
                  duplication and reduce the efficiency of development.
                </Paragraph>
            </Typography>
            </div>
          </Sider>
          </Layout>
       
      </div>
    );
  }
}

const Page = () => (
  <div className='Page'>
    <Layout>
      <Top/>
      <Content>
        <MainContent></MainContent>
      </Content>
    </Layout>
  </div>
  
);
export default Page;

