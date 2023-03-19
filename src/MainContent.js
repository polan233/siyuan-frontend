import React from 'react';
// import 'antd/dist/reset.css';
// import "./App.css"
import {BookOutlined  } from '@ant-design/icons';
import { Menu } from 'antd';
import { Layout, Typography,Card  } from 'antd';
import MyMap from './Mymap';
import { getMenu, getAuthorPath } from './axios/api';
import { getAuthorIntroduction } from './axios/api';
const {  Sider, Content } = Layout;
const { Paragraph } = Typography;


const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  color: '#fff',
  backgroundColor: '#fafafa',
};

const leftNavStyle = {
  textAlign: 'left',
  lineHeight: '75px',
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
        subMenuKeys:[],
        openKeys:[]
      }

      this.getRightTitle=this.getRightTitle.bind(this);
      this.handleNavResponse=this.handleNavResponse.bind(this);
      this.componentDidMount=this.componentDidMount.bind(this);
      this.onMenuClick=this.onMenuClick.bind(this);
      this.getRightContent=this.getRightContent.bind(this);
      //this.refreshControllers=this.refreshControllers.bind(this)
      this.handleLoadRoadBook=this.handleLoadRoadBook.bind(this);
      this.onOpenChange=this.onOpenChange.bind(this);
    }
    
    getRightTitle(){
        if(this.props.selectedTitle===""){
            return "";
        }
        return ' -- '+this.props.selectedAuthor;
    }
    getRightContent(){
      console.log("getAuthorIntroduction",this.props.selectedAuthor)
      if(this.props.selectedAuthor!==undefined&&
        this.props.selectedAuthor!==""&&this.props.selectedAuthor!==null)
      {
        getAuthorIntroduction(this.props.selectedAuthor).then((res)=>{
          const data=res.data;
          console.log("getAuthorIntroduction",data);
          this.setState({
            rightContent:data.data,
          })
        })
      }
    }
    
    
    handleNavResponse(response) {
      let items=[];
      let data=response.data.data;
      let authorTab={};
      let keys=Object.keys(data);
      //console.log("keys",keys)
      this.setState({
        subMenuKeys:keys,
        openKeys:["必修一"]
      })
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
      //TO-DO:
      /*
      1.按地点合并点
      2.排序点
      3.生成Arcs
      4. 返回按time排序的path和events
      */
     const setTimeOutCallBack= ()=>{
      function buildTime(dataCell){
        const time=dataCell.time;
        let res=time;
        if(res.indexOf("-00")!==-1){ //日月不详
          let index=res.indexOf('-');
          res=time.substr(0,index)+"年日期不详";
        }
        else{
          let temp=res.split("-");
          res=temp[0]+"年"+temp[1]+"月"+temp[2]+"日";
        }
        if(dataCell.isBC){
          res="公元前 "+res
        }
        return res;
      }
        let data=response.data.data;
        let data0=data.slice();

        // 生成按time排序的path和events,为路书小飞机使用
        data0.sort((a,b)=>{
            if(a.isBC){
              if(b.isBC){
                return b.time.localeCompare(a.time);
              }
              else{
                return -1;
              }
            }
            else{
              if(b.isBC){
                return 1;
              }
              else
                return a.time.localeCompare(b.time);
            }
        })
        console.log("handleLoadRoadBook data0",data0)

        let res_lushu={path:[],events:[],times:[],citys:[]}
        for(let i=0;i<data0.length;i++){
          data0[i].time=buildTime(data0[i]);
          res_lushu.path.push({
            lng:data0[i].lng,
            lat:data0[i].lat,
          });
          res_lushu.events.push(data0[i].event);
          res_lushu.times.push(data0[i].time);
          res_lushu.citys.push(data0[i].cityName)
        }
        console.log("res_lushu",res_lushu)

        //生成按城市排序并合并同一城市点的res,为Arcs使用
        let path_city=[];
        let path_point=[];
        let path_event=[]; //里面存一个字符串数组,表示本地点的各种事件
        let path_time=[]; //里面存一个字符串数组,表示本地点的各种事件对应的时间
        //console.log("handleLoadRoadBook",data)
        // 按地点合并事件点

        var len = 0;

        for (let i=0;i<data.length;){
          let temp=data[i];
          let cur_city=temp.cityName;
          let loop_city=cur_city;

          path_event[len]=[]
          path_time[len]=[]

          path_city[len]=cur_city;
          path_point[len]={
            lng:temp.lng,
            lat:temp.lat
          }

          //当城市不变化,在这里循环并把同一城市的信息放入 length 对应位置
          while(loop_city===cur_city){
            path_event[len].push(temp.event);
            path_time[len].push(temp.time);

            i++;
            if(i>=data.length) break;
            temp=data[i];
            loop_city=temp.cityName;
          }
          len++;
        }
        //至此合并事件点操作完成
        let res=[];
        for(let i=0;i<len;i++){
          res.push({})
          res[i].cityName=path_city[i];
          res[i].point=path_point[i];
          res[i].events=path_event[i];
          res[i].times=path_time[i];
          res[i].author=this.props.selectedAuthor;
        }
        //console.log("handleLoadRoadBook data building",res);

        res.sort(function(A,B){
          let atime=A.times[0];
          let btime=B.times[0];
          let aBC=false;
          let bBC=false;
          let a=atime;
          let b=btime;

          if(a.indexOf("公元前")!==-1)
            {a=a.substr(4);aBC=true}
          if(b.indexOf("公元前")!==-1)
            {b=b.substr(4);bBC=true}

          if(aBC){
            if(bBC)
              return b.localeCompare(a)
            else
              return -1
          }
          else{
            if(bBC)
              return 1
            else
              return a.localeCompare(b)
          }
        })
        //console.log("handleLoadRoadBook data building sorted",res);
        //至此排序完成
        //TO-DO: 生成事件点的弹出窗口内容
        
        //TO-DO:改 addRoadBook
        this.map.addRoadBook(res,res_lushu);
     }
      setTimeout(setTimeOutCallBack);
    }
    
    onMenuClick(e){
      this.props.onNavClick(e).then((res)=>{
        
        //getAuthorPath(res.author, this.handleGetAuthorPath);
        this.map.switchNovel();
        //this.map.addRoadBook(["北京","上海","南京","徐州","亳州","周口"]);
        this.getRightContent();

        getAuthorPath(res.author,this.handleLoadRoadBook);
        this.map.refreshControllers({selectedTitle:res.title,selectedAuthor:res.author})
      });
    }
    componentDidMount(){
      getMenu(this.handleNavResponse);
    }
    onOpenChange(keys){
      //console.log("keys",keys)
      let openKeys=this.state.openKeys;
      const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
      if (this.state.subMenuKeys.indexOf(latestOpenKey) === -1) {
        this.setState({openKeys:keys});
      } else {
        const temp= (latestOpenKey ? [latestOpenKey] : []);
        this.setState({openKeys:temp});
      }
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
                    openKeys={this.state.openKeys}
                    onOpenChange={this.onOpenChange}
                    items={this.state.items}
                />
              </div>
            </Sider>
            <Content style={contentStyle} id="content">
              {content}
            </Content>
            <Sider style={siderStyle}>
              <Card className='info' bordered={true} title={this.props.selectedAuthor}>
                <Typography>
                  {/* 现在这里放作者简介 */}
                  <Paragraph>{this.state.rightContent}</Paragraph>
                </Typography>
              </Card>
            </Sider>
            </Layout>
        </div>
      );
    }
  }

export default MainContent;