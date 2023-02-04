import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import {BookOutlined  } from '@ant-design/icons';
import { Menu } from 'antd';
import { Layout, Typography } from 'antd';
// import {Map, Marker, NavigationControl, InfoWindow} from 'react-bmapgl'
import 'react-bmapgl'

import { getMenu,handleError,getTypeAndRightContent } from './axios/api';
import { formToJSON } from 'axios';
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
  
var items = [
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




class MainContent extends React.Component{
    constructor(props){
      super(props);
      //当前选中课文和作者状态提升到Body中维护
      this.state={
        items:items,
        rightTitle:"",
        rightContent:null
      }

      this.getRightTitle=this.getRightTitle.bind(this);
      this.handleNavResponse=this.handleNavResponse.bind(this);
      this.componentDidMount=this.componentDidMount.bind(this);
      this.onMenuClick=this.onMenuClick.bind(this);
      this.handleGetRightContent=this.handleGetRightContent.bind(this);
    }
    
    getRightTitle(){
        if(this.props.selectedTitle===""){
            return "";
        }
        return ' -- '+this.props.selectedAuthor;
    }
    
    handleNavResponse(response) {
      console.log("handleNavResponse called",response)
      let items=[];
      let data=response.data.data;
      let authorTab={};
      let keys=Object.keys(data);
      for(let i=0;i<keys.length;i++){
        const key=keys[i];
        let temp=[];
        let children=data[key];
        for(let j=0;j<children.length;j++){
          let child=children[j];
          temp.push(getItem(child.text_name,child.text_name));
          authorTab[child.text_name]=child.author_name;
        }
        items.push(getItem(key,key,<BookOutlined />,temp));
      }
      //console.log(items);
      this.setState({
        items:items,
      })
      this.props.setAuthorDict(authorTab);
    }
    handleGetRightContent(response){
      console.log("handleGetRightContent called",response)
      const data=response.data.data.additions;
      let list=[];
      for(let i=0;i<data.length;i++){
          list.push(<li key={i}>{data[i]}</li>)
      }
      if(list.length==0){
        list="";
      }
      this.setState({
        rightContent:list,
      })
      console.log("rightContentSet!",this.state)
    }
    onMenuClick(e){
      this.props.onNavClick(e);
      getTypeAndRightContent(this.props.selectedTitle,this.handleGetRightContent);
    }
    componentDidMount(){
      var map = new window.BMapGL.Map("mapContainer");
      var point = new window.BMapGL.Point(115.0, 35.0);
      map.centerAndZoom(point, 5);
      map.enableScrollWheelZoom(true);
      map.addControl(new window.BMapGL.ScaleControl());
      map.addControl(new window.BMapGL.ZoomControl());

      getMenu(this.handleNavResponse);
    }
    render(){
      return(
        <div className='mainContent'>
          <Layout>
            <Sider className='leftNav' style={leftNavStyle} width={256}>
              <div className='leftNav'>
                <Menu
                    onClick={this.onMenuClick}
                    mode="inline"
                    items={this.state.items}
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
                  <Title level={4}>{this.props.selectedTitle}</Title>
                  <Title level={5}>{this.getRightTitle()}</Title>
                  {/* 这个标题需要根据课文题目而定 */}
                  <ul>{this.state.rightContent}</ul>
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