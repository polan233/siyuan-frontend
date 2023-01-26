import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import { Layout, Space,Col, Divider, Row,Typography ,Button,Card} from 'antd';
import { Input } from 'antd';
import logoPic from './img/logo192.png';
import {LeftOutlined,RightOutlined   } from '@ant-design/icons';
import Exam from './Exam.js'
import Foot from './Foot.js'
import MainContent from './MainContent';
const { Search } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Title, Paragraph, Text, Link } = Typography;


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



class Question extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <Card id='questionCard' size="default" title="Question" bordered >
        <div className='question'>
          <Typography>
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
          
        </div>
      </Card>
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
        <Divider/>
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
        <Divider/>
        <SecondContent></SecondContent>
      </Content>
      <Divider/>
      <Foot></Foot>
    </Layout>
  </div>
  
);
export default Page;

