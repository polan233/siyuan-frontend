import React from "react";
import {createRoot} from 'react-dom/client'
import { Map, Arc, Polyline, Marker,InfoWindow,CustomOverlay } from "react-bmapgl";
import { getAuthorPath } from "./axios/api";
import { Button, Popover, Collapse, Drawer, Space, Switch, Slider} from 'antd';
import "./LuShu"

const {Panel} = Collapse

const mapStyle = {
  position: "relative",
  width: "100%",
  margin: "2px",
  height: "70vh",
  minHeight: "30vh",
  resize: "vertical",
  overflow: "auto",
};

const TYPE = {
  MARKER: 1,
  ARC: 1 << 1,
  POLYLINE: 1 << 2,
  CONTROLLER: 1 << 3,
  MARKPOINT: 1 << 4
}
var onShowText;

class showTextButton extends window.BMapGL.Control{
  constructor(map){
    super();
    this.defaultAnchor = window.BMAP_ANCHOR_TOP_LEFT;
    this.defaultOffset = new window.BMapGL.Size(20, 20)
    this.map = map
  }
  initialize(map){
    var div = document.createElement('div');
    map.getContainer().appendChild(div);
    const root = createRoot(div);
    root.render(<Button type="primary" onClick={() => {onShowText()}} id="showTextButton">
      展示文本
    </Button>);
    return div;
  }
}

class mapSelectionController extends window.BMapGL.Control{
  constructor(map){
    super();
    this.defaultAnchor = window.BMAP_ANCHOR_TOP_RIGHT;
    this.defaultOffset = new window.BMapGL.Size(20, 20);
    this.map = map
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
          showRoadBook: false
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
            <Drawer className = "drawer" id="mapSelectionDrawer" width={"30%"} title="地图选项" placement="right" closable={true} onClose={this.setClose} open={this.state.open} getContainer={this.container} destroyOnClose
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
                <Space>显示路径<Switch className="drawerSwitch" defaultChecked onChange={() => {}} /></Space>
                <Space>显示标注<Switch className="drawerSwitch" defaultChecked onChange={() => {}} /></Space>
                <Space>显示折线<Switch className="drawerSwitch" defaultChecked onChange={() => {}} /></Space>
            </Drawer>
          </div>
        )
      }
    }
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
    onShowText=this.props.onShowText;
    this.state = {
      components: [],
      path_event:[]
    };
    this.created = false;
    this.searchCityPoint = this.searchCityPoint.bind(this);
    this.getCityPointArray = this.getCityPointArray.bind(this);
    this.centerAndZoom = this.centerAndZoom.bind(this);
    this.reset = this.reset.bind(this);
    this.switchNovel = this.switchNovel.bind(this);
    this.addComponent = this.addComponent.bind(this);
    this.addArc = this.addArc.bind(this);
    this.addMarkers = this.addMarkers.bind(this);
    this.addPolyline = this.addPolyline.bind(this);
    this.addArcsAndInfoWindow = this.addArcsAndInfoWindow.bind(this);
    this.addRoadBook = this.addRoadBook.bind(this);
    this.addMarkPoint=this.addMarkPoint.bind(this);
  }

  _initMap() {
    var localcity = new window.BMapGL.LocalCity();
    this.map = this.mapRef.map;
    localcity.get((e) => {
      var point = new window.BMapGL.Point(e.center.lng, e.center.lat);
      this.map.centerAndZoom(point, 5);
    });
    this.map.enableScrollWheelZoom(true);
    this.map.enablePinchToZoom();
    this.map.setTrafficOff();
    this.map.addControl(new window.BMapGL.ScaleControl());
    this.map.addControl(new window.BMapGL.ZoomControl());
    this.map.addControl(new showTextButton(this.map));
  }
  searchCityPoint(city, completHandler) {
    var searcher;
    searcher = new window.BMapGL.LocalSearch(this.map, {
      onSearchComplete: completHandler,
    });
    searcher.search(city);
  }
  getCityPointArray(path_city) {
    return new Promise((resolve, reject) => {
      var path_point = Array(path_city.length);
      for (let index = 0; index < path_city.length; index++) {
        const element = path_city[index];
        this.searchCityPoint(element, (results) => {
          if (results.getNumPois() <= 0) reject("城市不存在" + element);
          path_point[index] = results.getPoi(0).point;
          // console.log("path_point building",path_point)
          let flag=true;
          for(let i=0;i<path_point.length;i++){
            if(path_point[i]==null) {flag=false;break;}
          }
          if (flag) {
            // console.log("path_point done",path_point)
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
      console.log(element.classList)
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

  addComponent(type, value) {
    this.setState((state) => ({
      components: state.components.slice().concat([new MapComponent(type, value)])
    })); // state的更新是异步的
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

  addArcsAndInfoWindow(path_city,path_event) {
    this.getCityPointArray(path_city).then((path) => {
      if (path.length < 2) return;
      for (let i = 0; i < path.length - 1; i++) {
        this.addArc({point: path[i], city: path_city[i]}, {point: path[i + 1], city: path_city[i+1]})
      }
      for(let i=0;i<path.length;i++){
        this.addMarkPoint(path[i],path_event[i].event,path_event[i].time) //TO-DO addArcsAndInfoWindow
      }
    }).catch((e) => {
      window.alert(e);
    });
  }

  addMarkPoint(point,text,title){
    var content = (
        <div className="pathContent">
          <p>{text}</p>
        </div>
    )
    var newMarkPoint=(
      <CustomOverlay position={point}>
        <Popover content={content} title={title} trigger={"hover"}>
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

  addRoadBook(path_city,path_event) {
    this.setState({
      path_event:path_event
    })
    this.getCityPointArray(path_city).then((path) => {
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
    });
      function startLushu(map) {
        lushu.stop();
        lushu.start();
      }
      // this.map.addOverlay(polyline);
      this.addArcsAndInfoWindow(path_city,path_event);
      

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
    });
  }
  
  componentDidMount() {
    if (!this.created) {
      this._initMap();
      this.created = !this.created;
    }
    this.map.addControl(new mapSelectionController(this.map));
  }
  render() {
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