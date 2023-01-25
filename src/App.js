import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import { Layout, Space,Col, Divider, Row,Typography ,Button,Card} from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import logoPic from './img/logo192.png';
import { MailOutlined, SettingOutlined,BookOutlined,LeftOutlined,RightOutlined   } from '@ant-design/icons';
import { Menu } from 'antd';
import Exam from './Exam.js'
import Foot from './Foot.js'
const { Search } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Title, Paragraph, Text, Link } = Typography;
const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#fafafa',
};
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#fafafa',
};
const qusetionStyle ={
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
}
const leftNavStyle = {
  textAlign: 'left',
  lineHeight: '80px',
  color: '#fff',
  backgroundColor: '#fafafa',
}
const siderStyle = {
  textAlign: 'left',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#fafafa',
};
const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#fafafa',
};
const questionFooterStyle = {
  textAlign:"right",
  backgroundColor: '#fafafa',
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
  getItem('Navigation One', 'sub1', <BookOutlined />, [
    getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
    getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
  ]),
  getItem('Navigation Two', 'sub2', <BookOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),
  {
    type: 'divider',
  },
  getItem('Navigation Three', 'sub4', <BookOutlined />, [
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
                <Paragraph >
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

class Question extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div className='question'>
        <Divider></Divider>
          <Typography>
            <Title level={2} className='titile'>Introduction</Title>
            <Paragraph className='paragraph'>
              In the process of internal desktop applications development, many different design specs and
              implementations would be involved, which might cause designers and developers difficulties and
              duplication and reduce the efficiency of development.
            </Paragraph>
          </Typography>
          <div className='questionButtons'>
          <Space>
            <Button icon={<LeftOutlined />} size={'small'} />
            <Button icon={<RightOutlined />} size={'small'} />
          </Space>
          </div>
          <Divider></Divider>
      </div>
    );
  }
}

class SecondContent extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div className='secondContent'>
        <Question/>
        <Exam/>
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
        <SecondContent></SecondContent>
      </Content>
      <Foot></Foot>
      
    </Layout>
  </div>
  
);
export default Page;

