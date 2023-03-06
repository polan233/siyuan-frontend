import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import {BookOutlined,  } from '@ant-design/icons';
import { Menu } from 'antd';
import { Layout, Typography,Card  } from 'antd';
import MyMap from './Mymap';
import { getMenu,getTypeAndRightContent, getAuthorPath } from './axios/api';


const {  Sider, Content } = Layout;
const { Title } = Typography;


const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  color: '#fff',
  backgroundColor: '#fafafa',
};

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
  




class MainContent extends React.Component{
    constructor(props){
      super(props);
      //当前选中课文和作者状态提升到Body中维护
      this.state={
        items:[],
        rightTitle:"",
        rightContent:null,
        
      }

      this.getRightTitle=this.getRightTitle.bind(this);
      this.handleNavResponse=this.handleNavResponse.bind(this);
      this.componentDidMount=this.componentDidMount.bind(this);
      this.onMenuClick=this.onMenuClick.bind(this);
      this.handleGetRightContent=this.handleGetRightContent.bind(this);
      //this.refreshControllers=this.refreshControllers.bind(this)
    
      this.handleLoadRoadBook=this.handleLoadRoadBook.bind(this);
    }
    
    getRightTitle(){
        if(this.props.selectedTitle===""){
            return "";
        }
        return ' -- '+this.props.selectedAuthor;
    }
    
    
    handleNavResponse(response) {
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
          temp.push(getItem(child.textName,child.textName));
          authorTab[child.textName]=child.authorName;
        }
        items.push(getItem(key,key,<BookOutlined />,temp));
      }
      this.setState({
        items:items,
      })
      this.props.setAuthorDict(authorTab);
    }
    handleLoadRoadBook(response){
      
      let data=response.data.path;
      let path_city=[];
      let path_event=[];
      for (let i=0;i<data.length;i++){
        if(data[i].isBC)
          data[i].time='-'+data[i].time
      }
      data.sort(function(a,b){
        if(a.time[0]=='-'){
          if(b.time[0]=='-')
            return b.time.localeCompare(a.time)
          else
            return -1
        }
        else{
          if(b.time[0]=='-')
            return 1
          else
            return a.time.localeCompare(b.time)
        }
      })
      for (let i=0;i<data.length;i++){
        path_city.push(data[i].city);
        if(data[i].time[0]=='-'){
          data[i].time='BC '+data[i].time.substr(1);
        }
        path_event.push({ time:data[i].time, event:data[i].event })
      }
      this.map.addRoadBook(path_city,path_event);
    }
    handleGetRightContent(response){
      console.log(response)
      const data=response.data.data.additions;
      let list=[];
      for(let i=0;i<data.length;i++){
          list.push(<li key={i}>{data[i]}</li>)
      }
      if(list.length===0){
        list="";
      }
      this.setState({
        rightContent:list,
      })
    }
    onMenuClick(e){
      this.props.onNavClick(e).then((res)=>{
        getTypeAndRightContent(res.title,this.handleGetRightContent);
        getAuthorPath(res.author, this.handleGetAuthorPath);
        this.map.switchNovel();
        //this.map.addRoadBook(["北京","上海","南京","徐州","亳州","周口"]);
        getAuthorPath(res.author,this.handleLoadRoadBook);
        this.map.refreshControllers({selectedTitle:res.title,selectedAuthor:res.author})
      });
    }
    componentDidMount(){
      getMenu(this.handleNavResponse);
    }
    render(){

      const content=
        <MyMap
          className="map"
          ref={(ref) => {this.map = ref}}
          />
      
      return(
        <div className='mainContent'>
          <Layout>
            <Sider  style={leftNavStyle} width={256}>
              <div className='leftNav'>
                <Menu id='navMenu'
                    onClick={this.onMenuClick}
                    mode="inline"
                    items={this.state.items}
                />
              </div>
            </Sider>
            <Content style={contentStyle} id="content">
              {content}
            </Content>
            <Sider style={siderStyle}>
              <Card className='info' bordered={true}>
                <Typography>
                  <Title level={4}>{this.props.selectedTitle}</Title>
                  <Title level={5}>{this.getRightTitle()}</Title>
                  {/* 这个标题需要根据课文题目而定 */}
                  <ol>{this.state.rightContent}</ol>
                  {/*内容也需要根据课文题目而定*/}
                </Typography>
              </Card>
            </Sider>
            </Layout>
        </div>
      );
    }
  }

export default MainContent;