import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import {BookOutlined  } from '@ant-design/icons';
import { Menu } from 'antd';

import { Layout, Typography } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

// import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmapgl'

import 'react-bmapgl'
const {  Sider, Content } = Layout;
const { Title } = Typography;

const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 50,
    lineHeight: '64px',
    backgroundColor: '#fafafa',
  };
const mapStyle = {
  width: "100%",
  margin: "2px",
  height: "70vh",
  minHeight: "30vh",
  resize: 'vertical',
  overflow: 'auto'
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
        getItem('Option 1', '1'), getItem('Option 2', '2'),
        getItem('Option 3', '3'), getItem('Option 4', '4')
    ]),
    {
        type: 'divider',
    },
    getItem('Navigation Two', 'sub2', <BookOutlined />, [
        getItem('Option 5', '5'),
        getItem('Option 6', '6'),
        getItem('Option 7', '7'), getItem('Option 8', '8')
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
    {
        type: 'divider',
    },
];
const authorDict={
    "title":"author",
    "1":"author1",
    "2":"author2",
    "3":"author3",
    "4":"author4",
    "5":"author5",
}
  class MainContent extends React.Component{
    constructor(props){
      super(props);
      this.state = {
        selectedTitle: "",
        selectedAuthor: ""
      }
      this.onNavClick=this.onNavClick.bind(this);
      this.getRightTitle=this.getRightTitle.bind(this);
      this.getRightContent=this.getRightContent.bind(this);
      this.getAuthorByTitle=this.getAuthorByTitle.bind(this);
    }
    getAuthorByTitle(title){
        return authorDict[title];
    }
    onNavClick = (e) => {
      console.log(e.key);
      this.setState({
        selectedTitle: e.key,
        selectedAuthor: this.getAuthorByTitle(e.key)
      })
    }
    getRightTitle(){ //TODO:获得右侧栏标题
        if(this.state.selectedTitle===""){
            return "实词翻译";
        }
        return "实词翻译"+this.state.selectedTitle
    }
    
    getRightContent(){//TODO:获得右侧栏内容
        if(this.state.selectedTitle===""){
            return ""
        }
        let list=[
            this.state.selectedAuthor,
            "师者，所以传道受业解惑也 \n 受：通“授”，传授，讲授",
            "或师焉，或不焉 \n 不：通“否”，表否定"
        ]
        return(
            list.map( (content)=>
                <li>{content}</li>
            )
        );
    }
    componentDidMount(){
      var map = new window.BMapGL.Map("mapContainer");
      var point = new window.BMapGL.Point(115.0, 35.0);
      map.centerAndZoom(point, 5);
      map.enableScrollWheelZoom(true);
      map.addControl(new window.BMapGL.ScaleControl());
      map.addControl(new window.BMapGL.ZoomControl());
    }
    render(){
      return(
        <div className='mainContent'>
          <Layout>
            <Sider className='leftNav' style={leftNavStyle} width={256}>
              <div className='leftNav'>
                <Menu
                    onClick={this.onNavClick}
                    mode="inline"
                    items={items}
                />
              </div>
            </Sider>
            <Content style={contentStyle}>
              <div className='map'>
                {}
                  <div id="mapContainer" style={mapStyle}></div>
              </div>
            </Content>
            <Sider style={siderStyle}>
              <div className='info'>
                <Typography>
                  <Title level={3}>{this.getRightTitle('title')}</Title>
                  {/* 这个标题需要根据课文题目而定 */}
                  <ul>{this.getRightContent('titile')}</ul>
                  {/*内容也需要根据课文题目而定*/}
              </Typography>
              </div>
            </Sider>
            </Layout>
        </div>
      );
    }
  }

export default MainContent;