import React from "react";
import {createRoot} from 'react-dom/client'
import { Map, Arc, Polyline, CustomOverlay,MapvglView, MapvglLayer} from "react-bmapgl";
import { Button, Popover} from 'antd';
import "./Lushu.min"
import { textReaderController } from "./textReaderController";
import {mapVisualizeController} from "./mapVisualizeController"
import blackstyle from './custom_map_config1'

const mapStyle = {
  position: "relative",
  width: "98%",
  margin: "0px",
  height: "80vh",
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
    //this.map.setMapType("B_EARTH_MAP");
    this.map.enableScrollWheelZoom(true);
    this.map.enablePinchToZoom();
    this.map.setTrafficOff();
    this.map.addControl(new window.BMapGL.ScaleControl());
    this.map.addControl(new window.BMapGL.ZoomControl());
    //this.map.addControl(new window.BMapGL.MapTypeControl());
    this.map.setTilt(40);
    
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
        autoViewPort
        showStartPoint
        showEndPoint
        enableAnimation
        textOptions={{
          fontSize:12,
          color: '#00BFFF',
          offset: [0, 8]
        }}
        data={[{ from: from, to: to }]}
      />
    );
    this.addComponent(TYPE.ARC, newArc);
  }

  // addArcsAndInfoWindow(path_arr) {
  //   let path=path_arr.map((e)=>{
  //     return e.point
  //   })
  //   if (path.length >= 2) {
  //     for (let i = 0; i < path.length - 1; i++) {
  //       this.addArc({point: path[i], city: path_arr[i].cityName},
  //         {point: path[i + 1], city: path_arr[i+1].cityName})
  //     }
  //   }
  //   for(let i=0;i<path.length;i++){
  //     this.addMarkPoint(path[i],path_arr[i].events,path_arr[i].times,path_arr[i].cityName)
  //   }
  // }
  addArcs(points){
    const setTimeOutCallBack=()=>{
      // patharr {point, events, times, cityName}
    const path=points;
      if (path.length >= 2) {
        for (let i = 0; i < path.length - 1; i++) {
          this.addArc({point: path[i].point, name: path[i].cityName},
            {point: path[i + 1].point, name: path[i+1].cityName})
        }
      }
    }
    setTimeout(setTimeOutCallBack);
  }

  addMarkPoints(path_ark){
    let points=path_ark.map((e)=>{return e.point})
    //this.addMarkers(points)
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
      <CustomOverlay autoViewPort position={point} offset={new window.BMapGL.Size(0,3)}>
        <Popover content={content} title={author+'-'+city} trigger={"hover"}>
          <div className="markPointContainer">
            {/*红色 */}
            {/*<svg t="1678983893429" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2688" width="27" height="27"><path d="M277.942857 945.980952a234.057143 68.266667 0 1 0 468.114286 0 234.057143 68.266667 0 1 0-468.114286 0Z" fill="#061633" p-id="2689"></path><path d="M277.942857 945.980952a234.057143 68.266667 0 1 0 468.114286 0 234.057143 68.266667 0 1 0-468.114286 0Z" fill="#FF2102" opacity=".3" p-id="2690"></path><path d="M277.942857 945.980952a234.057143 68.266667 0 1 0 468.114286 0 234.057143 68.266667 0 1 0-468.114286 0Z" p-id="2691" data-spm-anchor-id="a313x.7781069.0.i4" class="selected"></path><path d="M512 1014.247619c-112.152381 0-234.057143-21.942857-234.057143-68.266667s121.904762-68.266667 234.057143-68.266666 234.057143 21.942857 234.057143 68.266666-121.904762 68.266667-234.057143 68.266667z m0-112.152381c-136.533333 0-209.67619 29.257143-209.67619 43.885714s73.142857 43.885714 209.67619 43.885715 209.67619-29.257143 209.67619-43.885715-73.142857-43.885714-209.67619-43.885714z" fill="#FF2102" p-id="2692"></path><path d="M726.552381 607.085714c73.142857-73.142857 102.4-177.980952 75.580952-277.942857s-104.838095-175.542857-207.238095-202.361905-209.67619 2.438095-282.819048 73.142858c-114.590476 112.152381-114.590476 292.571429 0 404.723809s299.885714 114.590476 414.476191 2.438095z" fill="#061633" p-id="2693" data-spm-anchor-id="a313x.7781069.0.i2" class="selected"></path><path d="M516.87619 399.847619m-219.428571 0a219.428571 219.428571 0 1 0 438.857143 0 219.428571 219.428571 0 1 0-438.857143 0Z" fill="#401C17" p-id="2694" data-spm-anchor-id="a313x.7781069.0.i1" class="selected"></path><path d="M243.809524 134.095238c151.161905-148.72381 399.847619-148.72381 551.009524 0 151.161905 148.72381 151.161905 392.533333 0 541.257143l-275.504762 268.190476L243.809524 675.352381C92.647619 524.190476 92.647619 282.819048 243.809524 134.095238z m482.742857 472.990476c73.142857-73.142857 102.4-177.980952 75.580952-277.942857s-104.838095-175.542857-207.238095-202.361905-209.67619 2.438095-282.819048 73.142858c-114.590476 112.152381-114.590476 292.571429 0 404.723809s299.885714 114.590476 414.476191 2.438095z" fill="#FF2102" p-id="2695" data-spm-anchor-id="a313x.7781069.0.i3" class="selected"></path></svg>*/} 
            {/*蓝色 */}
            <div className="markPoint">
              <svg t="1679191250175" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2770" width="27" height="27"><path d="M511.997542 0A350.50496 350.50496 0 0 0 265.909862 597.62688L511.997542 845.2096l246.14912-247.58272A350.50496 350.50496 0 0 0 511.997542 0.06144z m0 505.63072a155.12576 155.12576 0 0 1-154.73664-155.51488v-0.13312a155.06432 155.06432 0 0 1 154.624-155.51488h0.06144a155.12576 155.12576 0 0 1 154.78784 155.51488v0.13312a155.06432 155.06432 0 0 1-154.54208 155.45344h-0.19456zM357.260902 958.98624c0 35.91168 69.2736 65.01376 154.73664 65.01376s154.73664-29.11232 154.73664-65.01376-69.28384-65.01376-154.73664-65.01376-154.73664 29.10208-154.73664 65.01376z" fill="#1a9bdf" p-id="2771"></path></svg>
            </div>
          </div>
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
    positions.forEach((element) => {
      var marker = new window.BMapGL.Marker(element);        // 创建标注
      marker.addEventListener("hover",function(e){
        
      })
      this.map.addOverlay(marker);                     // 将标注添加到地图中
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
    var lushu = new window.BMapGLLib.LuShu(
      this.map, polyline.getPath(), {
      geodesic: true,
      autoCenter: true,
      speed: 1000000,
      enableRotation: true,
      defaultContent:"出发",
      landmarkPois:path
    });
    function startLushu(map) {
      lushu.stop();
      lushu.start();
    }
    //this.map.addOverlay(polyline);
    //this.addArcsAndInfoWindow(path_arr);
    this.addArcs(path_ark)
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
    this._addController(new mapVisualizeController(this.map));
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
        mapStyleV2={{styleJson:blackstyle}}
        center={new window.BMapGL.Point(114, 38)}
        zoom={5}
      >
        {/* 
        <MapvglView effects={['bright']}>
          <MapvglLayer
            type="PointLayer"
            data={[{
              geometry: {
                  type: 'Point',
                  coordinates: [116.403748, 39.915055]
              }
          }]}
            options={{
              blend: 'lighter',
              size: 12,
              color: 'rgb(255, 53, 0, 0.6)'
            }}
          />
        </MapvglView>
        */}
        {components}
      </Map>
    );
  }
}