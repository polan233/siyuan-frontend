import React from "react";
import {createRoot} from 'react-dom/client'
import { Map, Arc, Polyline, Marker,CustomOverlay } from "react-bmapgl";
import { Button, Popover, Typography, Drawer, Space, Switch, Slider} from 'antd';
import "./LuShu"
import TextReader from "./TextReader";
import { getContentByTitle} from "./axios/api";


const { Title, Paragraph, Text, Link } = Typography;
const mapStyle = {
  position: "relative",
  width: "98%",
  margin: "2px",
  height: "70vh",
  minHeight: "30vh",
  resize: "vertical",
  overflow: "auto",
};

const TYPE = {
  MARKER: 1, //1
  ARC: 1 << 1, //2
  POLYLINE: 1 << 2, //4
  CONTROLLER: 1 << 3, //8
  MARKPOINT: 1 << 4 //16
}


class textReaderController extends window.BMapGL.Control{
  constructor(map){
    super();
    this.defaultAnchor = window.BMAP_ANCHOR_TOP_LEFT;
    this.defaultOffset = new window.BMapGL.Size(20, 20);
    this.map = map
    this.textReader = null
  }
  buildParagraph(textStr_p){
    let textStr=textStr_p.replace("\r\n\r\n","\r\n");
    let res=[]
    let temp=""
    for(let i=0;i<textStr.length;i++){
        const char=textStr[i];
        if((textStr[i]==='\r'&&i==(textStr.length-2))||
        (textStr[i]==='\r'&&textStr[i+1]=='\n')){
            res.push(<Paragraph className="textReader-p">
              {temp}</Paragraph>)
            temp=""
        }else{
            temp=temp.concat(new String(char))
        }
    }
    res.push(<Paragraph className="textReader-p">{temp}</Paragraph>)
    return res;
}
  refresh(contentProps){
    getContentByTitle(contentProps.selectedTitle).then((response)=>{
      console.log("contentBytitle",response)
      let text=this.buildParagraph(response.data.data)
      
      this.textReader.setState((state) => ({
        title: contentProps.selectedTitle,
        author: contentProps.selectedAuthor,
        content:text,
      })); // state的更新是异步的
    }).catch((e)=>{
      console.log(e)
    })
  }
  initialize(map){
    var card = document.createElement('div')
    map.getContainer().appendChild(card);
    const root = createRoot(card);

    class TextReaderDrawer extends React.Component {
      constructor(props){
        super(props)
        this.state = {
          // showRoadBook: false,
          showText:false,
          title: '',
          author: '',
          content:'',
        }
        this.container = props.container
        this.textClose=this.textClose.bind(this)
        this.textOpen=this.textOpen.bind(this)
        
      }
      textOpen(){
        this.setState({
          showText: true
        })
      }
      textClose(){
        this.setState({
          showText: false
        })
      }
      
      render(){
        return (
          <div>
            <Button type="primary" id="textReader-btn" 
              onClick={this.textOpen}>
              展示文本
            </Button>
            <Drawer className = "drawer" id="textReaderDrawer" 
              width={"30%"} title={"文本展示"} 
              placement="left" closable={true} 
              onClose={this.textClose} open={this.state.showText} 
              getContainer={this.container.parentNode} 
              mask={false} maskClosable={false} 
              destroyOnClose
              extra={
              <Space>
                <Button onClick={this.textClose} type="primary" className="drawerContent">
                    关闭文本
                </Button>
              </Space>
              }
              rootStyle={{
                  position: "absolute"
              }}
              bodyStyle={{
                  color: "black"
              }}>
                <TextReader title={this.state.title} author={this.state.author} content={this.state.content}/>
            </Drawer>
          </div>
        )
      }
    }
    //TO-DO: 给上面这些按钮加onClick
    root.render(<TextReaderDrawer container={this.map.getContainer() } ref={(ref) => {this.textReader = ref}}/>);
    return card;
  }
}

class mapSelectionController extends window.BMapGL.Control{
  constructor(map){
    super();
    
    this.defaultAnchor = window.BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new window.BMapGL.Size(20, 20);
    this.map = map
  }
  refresh(contentProps){
    
  }
  initialize(map){
    var card = document.createElement('div')
    map.getContainer().appendChild(card);
    const root = createRoot(card);// todo: WTF

    class MapSelectionDrawer extends React.Component {
      constructor(props){
        super(props)
        this.state = {
          open: false,
          showRoadBook: false,
        }
        this.container = props.container
        this.setOpen = this.setOpen.bind(this)
        this.setClose = this.setClose.bind(this)
      }
      setOpen() {
        this.setState({
          open: true
        })
      }
      setClose() {
        this.setState({
          open: false
        })
      }
      render(){
        // position is fucking so important!
        return (
          <div>

            <Button type="primary" id="mapSelectionControllerButton" onClick={this.setOpen}>
              地图选项
            </Button>

            <Drawer className = "drawer" id="mapSelectionDrawer" width={"30%"} title="地图选项" placement="right" closable={true} onClose={this.setClose} open={this.state.open} getContainer={this.container.parentNode} destroyOnClose
            extra={
                  <Button onClick={this.setClose} type="primary" className="drawerContent">
                    重置
                  </Button>
            }
            rootStyle={{
              position: "absolute"
            }}
            bodyStyle={{
              color: "black"
            }}>
                <Space>启用路书<Switch className="drawerSwitch" defaultChecked={false} onChange={(checked) => {
                  this.setState({
                    showRoadBook: checked
                  })
                }} /></Space>
                {this.state.showRoadBook?<div>移动速度<Slider/></div>:null}<br/>
                <Space>显示路径<Switch className="drawerSwitch" defaultChecked onChange={(checked) => {}} /></Space>
                <Space>显示标注<Switch className="drawerSwitch" defaultChecked onChange={(checked) => {}} /></Space>
                <Space>显示折线<Switch className="drawerSwitch" defaultChecked onChange={(checked) => {}} /></Space>
            </Drawer>
          </div>
        )
      }
    }
    //TO-DO: 给上面这些按钮加onClick
    root.render(<MapSelectionDrawer container={this.map.getContainer()}/>);
    return card;
  }
}


class MapComponent{
  constructor(type, value){
    this.type = type;
    this.value = value;
    this.show = true;
  }
}

export default class MyMap extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      components: [],
      path_ark:[],
      path_lushu:[],
      controllers: [],
      
    };

    this.created = false;

    this._addController = this._addController.bind(this);
    this.refreshControllers = this.refreshControllers.bind(this);
    this.searchCityPoint = this.searchCityPoint.bind(this);
    this.getCityPointArray = this.getCityPointArray.bind(this);
    this.centerAndZoom = this.centerAndZoom.bind(this);
    this.reset = this.reset.bind(this);
    this.switchNovel = this.switchNovel.bind(this);
    this.addComponent = this.addComponent.bind(this);
    this.addArc = this.addArc.bind(this);
    this.addMarkers = this.addMarkers.bind(this);
    this.addPolyline = this.addPolyline.bind(this);
    //this.addArcsAndInfoWindow = this.addArcsAndInfoWindow.bind(this);
    this.addArcs=this.addArcs.bind(this);
    this.addMarkPoints=this.addMarkPoints.bind(this);
    this.addRoadBook = this.addRoadBook.bind(this);
    this.addMarkPoint=this.addMarkPoint.bind(this);
  }

  _initMap() {
    var localcity = new window.BMapGL.LocalCity();
    this.map = this.mapRef.map;
    // localcity.get((e) => {
    //   var point = new window.BMapGL.Point(e.center.lng, e.center.lat);
    //   this.map.centerAndZoom(point, 5);
    // });
    this.map.setMapType("B_EARTH_MAP");
    this.map.enableScrollWheelZoom(true);
    this.map.enablePinchToZoom();
    this.map.setTrafficOff();
    this.map.addControl(new window.BMapGL.ScaleControl());
    this.map.addControl(new window.BMapGL.ZoomControl());
    // this.map.addControl(new window.BMapGL.MapTypeControl());
    // this.map.addControl(new showTextButton(this.map));
  }
  _addController(newController) {
    this.setState((state) => ({
      // components: state.components.slice().concat([new MapComponent(type, value)])
      controllers: state.controllers.slice().concat([newController])
    })); // state的更新是异步的
    this.map.addControl(newController);
  }
  searchCityPoint(city, completHandler) {
    var searcher;
    searcher = new window.BMapGL.LocalSearch(this.map, {
      onSearchComplete: completHandler,
    });
    searcher.search(city);
  }


  //已弃用
  getCityPointArray(path_city) { //输入 城市名 列表
    return new Promise((resolve, reject) => {
      let path_point = Array(path_city.length);
      for (let index = 0; index < path_city.length; index++) {
        const element = path_city[index];
        this.searchCityPoint(element, (results) => {
          if (results.getNumPois() <= 0) reject("城市不存在" + element);
          path_point[index] = results.getPoi(0).point;
          let flag=true;
          for(let i=0;i<path_point.length;i++){
            if(path_point[i]==null) {flag=false;break;}
          }
          if (flag) {
            resolve(path_point);
          } // what the fuck so good 谢谢
        });
      }
    });
  }

  centerAndZoom(path_point) {
    var res = this.map.getViewport(path_point);
    this.map.centerAndZoom(res.center, res.zoom);
  }

  reset() {
    // TODO: 地图重置
    var c = this.map.getContainer();
    // c.remove();
    var c_children = [];
    c.childNodes.forEach((element) => {
      c_children.push(element);
    })
    for(const element of c_children){
      if(element.classList.contains("delOnReset")){
        c.removeChild(element)
      }
    }
    this.map.clearOverlays();
    this.setState((state) => ({
      components: [],
    }))
  }

  switchNovel(){
    this.reset();
    // TODO: 切换文章，暂时想法是用户自行选择保留哪些组件
  }

  refreshControllers(contentProps) {
    this.state.controllers.forEach(element => {
      element.refresh(contentProps)
    });
  }

  addComponent(type, value) {
    const setTimeOutCallBack=()=>{
      this.setState((state) => ({
        components: state.components.slice().concat([new MapComponent(type, value)])
      })); // state的更新是异步的
    }
    setTimeout(setTimeOutCallBack);
  }
  addArc(from, to) {
    var newArc = (
      <Arc
        // key={Date.now()}
        showStartPoint
        showEndPoint
        enableAnimation
        data={[{ from: from, to: to }]}
      />
    );
    this.addComponent(TYPE.ARC, newArc);
  }

  
  addArcs(points){
    const setTimeOutCallBack=()=>{
      const path=points;
      if (path.length >= 2) {
        for (let i = 0; i < path.length - 1; i++) {
          this.addArc({point: path[i]},
            {point: path[i + 1]})
        }
      }
    }
    setTimeOutCallBack(setTimeOutCallBack);
  }
  addMarkPoints(path_ark){
    for(let i=0;i<path_ark.length;i++){
      this.addMarkPoint(path_ark[i].point,path_ark[i].events,path_ark[i].times,path_ark[i].cityName,path_ark[i].author)
    }
  }
  
  addMarkPoint(point,events,times,city,author){
    let innerContent=[]
    
    for(let i=0;i<times.length;i++){
      innerContent.push(
        <div className="pathContent-block">
          <p className="pathContent-time">{times[i]}</p>
          <p className="pathContent-event">{events[i]}</p>
        </div>)
    }
    let content = (
        <div className="pathContent">
          {innerContent}
        </div>
    )
    let newMarkPoint=(
      <CustomOverlay position={point}>
        <Popover content={content} title={author+'-'+city} trigger={"hover"}>
          <div className="markPoint"></div>
        </Popover>
      </CustomOverlay>
    )
    this.addComponent(TYPE.MARKPOINT,newMarkPoint);
  }
  addPolyline(path_city) {
    this.getCityPointArray(path_city)
      .then((path_point) => {
        var newPolyline = (
          <Polyline
            // key={Date.now()}
            path={path_point}
            clip={false}
            geodesic={true}
            strokeWeight={3}
          ></Polyline>
        );
        this.addComponent(TYPE.POLYLINE, newPolyline);
      })
      .catch((e) => {
        window.alert(e);
      });
  }
  addMarkers(positions) {
    this.getCityPointArray(positions)
      .then((path_point) => {
        path_point.forEach((element) => {
          var newMarker = <Marker key={Date.now()} position={element} />;
          this.addComponent(TYPE.MARKER, newMarker);
        });
      })
      .catch((e) => {
        window.alert(e);
      });
  }

  addRoadBook(path_ark,path_lushu) {
    this.setState({
      path_ark:path_ark,
      path_lushu:path_lushu,
    })
    let path=path_lushu.path;
      
    var polyline = new window.BMapGL.Polyline(path, {
      clip: false,
      geodesic: true,
      strokeWeight: 3,
    });
    var fly =
    "data:image/png;base64,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";
    var lushu = new window.BMapGLLib.LuShu(
      this.map, polyline.getPath(), {
      geodesic: true,
      autoCenter: true,
      icon: new window.BMapGL.Icon(fly, new window.BMapGL.Size(48, 48), {
        anchor: new window.BMapGL.Size(24, 24),
      }),
      speed: 1000000,
      enableRotation: true,
      defaultContent:"出发",
      landmarkPois:path
    });
    function startLushu(map) {
      lushu.stop();
      lushu.start();
    }
    this.map.addOverlay(polyline);
    //this.addArcsAndInfoWindow(path_arr);
    // this.addArcs(path_ark.map((e)=>{return e.point}))
    this.addMarkPoints(path_ark)

    class roadBookController extends window.BMapGL.Control {
      constructor(map){
        super();
        this.defaultAnchor = window.BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new window.BMapGL.Size(110, 20)
        this.map = map
      }
      initialize(map){
        var div = document.createElement('div');
        // div.id = "roadBookController";
        div.classList.add("delOnReset");

        map.getContainer().appendChild(div);
        const root = createRoot(div);
        root.render(<Button type="primary" onClick={() => {
          startLushu(this.map)
        }} id="roadBookController">
          开始
        </Button>);
        return div;
      }
    }

    this.map.addControl(new roadBookController(this.map));
    this.centerAndZoom(path);
    // this.addComponent(TYPE.CONTROLLER, new window.BMapGL.ZoomControl(this.map))
  }
  
  componentDidMount() {
    if (!this.created) {
      this._initMap();
      this.created = !this.created;
    }
    this._addController(new mapSelectionController(this.map));
    this._addController(new textReaderController(this.map,this.props.selectedTitle,this.props.selectedAuthor));
    //axios请求获取城市id,城市名称对应列表
  }
  render() {
    // textReaderDrawerContent=<TextReader title={selectedTitle} author={selectedAuthor}/>
    var components = this.state.components.map((value, index, array) => {
      if(value.show) return value.value;
      else return null;
    });

    return (
      <Map
        ref={(ref) => {
          this.mapRef = ref;
        }}
        style={mapStyle}
      >
        
        {components}
      </Map>
    );
  }
}