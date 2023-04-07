import React from "react";
import {createRoot} from 'react-dom/client'
import { Map, Arc, Polyline, CustomOverlay} from "react-bmapgl";
import { Button, Popover} from 'antd';
import "./Lushu.min"
import { textReaderController } from "./textReaderController";
import {mapVisualizeController} from "./mapVisualizeController"
import lightstyle from './map_style/map_style_tea'


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
  toString(){
    let type="";
    switch(this.type){
      case 1:
        type="MARKER"
        break;
      case 1<<1:
        type="ARC"
        break;
      case 1<<2:
        type="POLYLINE"
        break;
      case 1<<3:
        type="CONTROLLER"
        break;
      case 1<<4:
        type="MARKPOINT"
        break;
      default:
        type="UNDEFINED"
    }
    return type+this.value.toString();
  }
}

export default class MyMap extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      components: [],
      controllers: [],
      lushu: null,
      lushuSpeed:50,
      lushuPauseTime:3,
      lushu_path:[],
      lushu_landmarks:[],
      showArc:true,
      showMarkPoint:true,
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
    this.addPolyline = this.addPolyline.bind(this);
    //this.addArcsAndInfoWindow = this.addArcsAndInfoWindow.bind(this);
    this.addArcs=this.addArcs.bind(this);
    this.addMarkPoints=this.addMarkPoints.bind(this);
    this.addRoadBook = this.addRoadBook.bind(this);
    this.addMarkPoint=this.addMarkPoint.bind(this);
    this.setArcVisibility=this.setArcVisibility.bind(this);
    this.setMarkPointVisibility=this.setMarkPointVisibility.bind(this);
    this.startRoadBook=this.startRoadBook.bind(this);
    this.addAuthorPath=this.addAuthorPath.bind(this);
    this.setRoadBookData=this.setRoadBookData.bind(this);
    this.onRoadBookSpeedChange=this.onRoadBookSpeedChange.bind(this);
    this.onRoadBookPauseTimeChange=this.onRoadBookPauseTimeChange.bind(this);
    this.pauseRoadBook=this.pauseRoadBook.bind(this);
    this.resumeRoadBook=this.resumeRoadBook.bind(this);
    this.roadBookPauseResume=this.roadBookPauseResume.bind(this);
    this.getRoadBookPause=this.getRoadBookPause.bind(this);
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
      lushu: null
    }))
    if(this.state.lushu!=null && this.state.lushu.started){
      this.state.lushu.stop()
    }
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
    const path=points.path;
    let data=[];
      if (path.length >= 2) {
        for (let i = 0; i < path.length - 1; i++) {
          data.push({
            from:{point: path[i], name: points.citys[i]},
            to:{point: path[i + 1], name: points.citys[i+1]}
          })
          // this.addArc({point: path[i].point, name: path[i].cityName},
          //   {point: path[i + 1].point, name: path[i+1].cityName})
        }
      }

    let newArc=(
      <Arc
        // key={Date.now()}
        autoViewPort
        showStartPoint
        showEndPoint
        enableAnimation
        color={"#87CEFA"}
        lineOptions={{
          width: 5,
          color: '#778899'
        }}
        arrowOptions={{
          styleOptions: {
            color: '#363738'
          }
        }}
        animationOptions={{
            width: 2,
            color: () => '#DCDCDCDD',
            interval: 0.1
          }}
        pointOptions={{
          size: 10,
          color: '#708090',
          shape: 'square'
        }}
        textOptions={{
          fontSize:18,
          color: '#172033',
          offset: [-25, 9]
        }}
        data={data}
      />
    )
    this.addComponent(TYPE.ARC, newArc);
    }
    setTimeOutCallBack();
  }
  addArc(from, to) {
    var newArc = (
      <Arc
        // key={Date.now()}
        autoViewPort
        showStartPoint
        showEndPoint
        enableAnimation
        color={"#87CEFA"}
        lineOptions={{
          width: 5,
          color: '#87cefa'
        }}
        arrowOptions={{
          styleOptions: {
            color: '#708090'
          }
        }}
        pointOptions={{
          size: 10,
          color: '#87cefa',
          shape: 'square'
        }}
        textOptions={{
          fontSize:12,
          color: '#4A27F9',
          offset: [0, 9]
        }}
        data={[{ from: from, to: to }]}
      />
    );
    this.addComponent(TYPE.ARC, newArc);
  }
  setArcVisibility(show){
    this.setState({
      showArc:show,
    })
  }

  addMarkPoints(path_arc){
    let points=path_arc.map((e)=>{return e.point})
    //this.addMarkers(points)
    for(let i=0;i<path_arc.length;i++){
      this.addMarkPoint(path_arc[i].point,path_arc[i].events,path_arc[i].times,path_arc[i].cityName,path_arc[i].author,i)
    }
  }
  startRoadBook(){
      const speed=this.state.lushuSpeed;
      var flytime = Math.round((150-600)/100*speed+600); // 150 600 s e
      const pauseTime=this.state.lushuPauseTime;
      if(this.state.lushu!=null)
      {
        this.state.lushu.stop()
        this.state.lushu.setSpeedAndPauseTime(flytime,pauseTime)
        this.state.lushu.start()
      }
      else{
        const path=this.state.lushu_path;
        const data=this.state.lushu_landmarks;
        var lushu = new window.BMapGLLib.LuShu(
          this.map, path, {
          // geodesic: true,
          // autoCenter: true,
          autoCenterAndZoom: true,
          enableRotation: true,
          defaultContent:"出发",
          odCurve:true,
          landmarkPois: data
        }, flytime,pauseTime);
        lushu.start();
        this.setState({
          lushu: lushu
        });
      }
  }
  pauseRoadBook(){
    if(this.state.lushu!=null)
    {
      this.state.lushu.pause()
    }
  }
  resumeRoadBook(){
    if(this.state.lushu!=null)
    {
      this.state.lushu.start()
    }
  }
  roadBookPauseResume(){
    if(this.state.lushu!=null)
    {
      if(this.state.lushu._fromPause){
        this.resumeRoadBook();
      }
      else{
        this.pauseRoadBook();
      }
    }
  }
  getRoadBookPause(){
    if(this.state.lushu!=null)
    {
      return this.state.lushu._fromPause;
    }
  }
  onRoadBookSpeedChange(value){
    this.setState({
      lushuSpeed:value,
    })
  }
  onRoadBookPauseTimeChange(value){
    this.setState({
      lushuPauseTime:value
    })
  }
  
  addMarkPoint(point,events,times,city,author,i){
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
    let icon=(
      <svg t="1679225338201" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1478" width="35" height="35"><path d="M504.4224 929.07519999c-6.69696-2.72384-10.79296-7.3728-12.55424-14.27456-0.88064-3.42016-1.024-31.06816-1.024-221.7984 0-216.12544 0-217.84576-1.37216-219.07456-0.88064-0.8192-4.44416-1.69984-11.0592-2.80576-36.2496-6.08256-70.18496-21.64736-98.16064-45.19936-7.9872-6.69696-21.97504-21.03296-28.2624-28.81536C331.776 371.85535999 317.99296 342.07743999 311.296 309.45279999c-4.7104-22.9376-5.05856-50.5856-0.96256-74.48576 10.0352-58.10176 45.40416-109.62944 96.19456-140.0832C429.52704 81.10079999 454.30784 72.29439999 482.65216 67.91167999c13.25056-1.98656 42.1888-2.19136 54.94784-0.26624 45.52704 6.69696 83.5584 25.04704 115.15904 55.56224 76.1856 73.66656 83.5584 192.1024 16.9984 274.90304-5.59104 7.02464-19.92704 21.504-27.38176 27.79136-28.4672 23.9616-63.54944 39.87456-99.67616 45.32224-5.67296 0.88064-8.25344 1.57696-9.35936 2.51904l-1.57696 1.37216-0.14336 219.5456-0.2048 219.5456-1.78176 3.82976c-3.4816 7.43424-9.56416 11.53024-17.67424 12.02176-3.21536 0.14336-5.3248-0.14336-7.5776-1.024zM417.64864 250.16319999c13.312-4.7104 23.49056-14.9504 28.2624-28.4672 1.37216-3.82976 1.57696-5.7344 1.57696-14.336s-0.2048-10.50624-1.57696-14.336c-4.77184-13.5168-15.29856-24.02304-28.81536-28.81536-3.82976-1.37216-5.7344-1.57696-14.336-1.57696s-10.50624 0.2048-14.336 1.57696c-13.5168 4.77184-24.1664 15.50336-28.73344 28.81536-2.048 6.08256-2.60096 18.2272-1.024 24.84224 3.072 12.96384 11.93984 24.1664 23.90016 30.04416 7.3728 3.62496 11.6736 4.5056 21.56544 4.23936 7.10656-0.14336 9.35936-0.47104 13.5168-1.98656z" fill="#d81e06" p-id="1479"></path></svg>
    )
    let offsetx=0
    if(i==0){
      icon=(<svg t="1679590149675" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5435" width="35" height="35"><path d="M487.8336 104.7552c-83.968-27.1872-165.1712 3.6352-221.184 36.7104-9.8304-32.5632-40.2944-55.296-75.1104-50.944-31.3344 3.9424-56.832 30.6688-60.8256 63.8976-3.4816 29.0304 8.8576 55.1936 29.1328 70.3488v675.8912c0 23.3472 16.9984 43.7248 39.0144 44.4416 22.784 0.7168 41.472-18.6368 41.472-42.6496v-231.2704c227.5328-149.9648 365.8752-45.1072 462.592-21.504 78.8992 19.2512 146.176-11.6224 171.776-26.0608 6.8608-3.84 11.0592-11.4176 11.0592-19.6608V184.8832c0-16.7424-16.64-27.2384-30.7712-19.8144-113.8688 59.9552-227.584-15.104-367.1552-60.3136z m187.136 239.616c-33.9456-7.5776-78.592-23.6544-133.2224-56.0128-96-56.9344-179.6096-3.4304-183.1424-1.1264-18.432 12.0832-42.7008 6.2464-54.2208-13.2096s-6.1952-45.056 12.032-57.3952c5.0688-3.4304 125.7472-83.0464 263.7824-1.2288 47.9232 28.416 85.1456 41.4208 111.1552 47.2064 18.1248 4.0448 30.976 21.1968 30.976 40.8064 0 26.4704-22.9376 46.4384-47.36 40.96z" fill="#d81e06" p-id="5436"></path><path d="M854.9376 165.12c-113.8176 59.904-227.584-15.1552-367.1552-60.3136-83.968-27.1872-165.1712 3.6352-221.184 36.7104-9.8304-32.5632-40.2944-55.296-75.1104-50.944-31.3344 3.9424-56.832 30.6688-60.8256 63.8976-3.4816 29.0304 8.8576 55.1936 29.1328 70.3488v551.6288c26.2656 4.9152 53.1456 8.1408 80.4864 9.472v-114.688c199.3216-131.3792 330.1888-67.1744 424.6016-33.3824 124.5184-109.568 203.1616-270.08 203.1616-448.9728 0-8.704-0.2048-17.3056-0.6144-25.9072a19.8656 19.8656 0 0 0-12.4928 2.1504z m-179.968 179.2512c-33.9456-7.5776-78.592-23.6544-133.2224-56.0128-96-56.9344-179.6096-3.4304-183.1424-1.1264-18.432 12.0832-42.7008 6.2464-54.2208-13.2096s-6.1952-45.056 12.032-57.3952c5.0688-3.4304 125.7472-83.0464 263.7824-1.2288 47.9232 28.416 85.1456 41.4208 111.1552 47.2064 18.1248 4.0448 30.976 21.1968 30.976 40.8064 0 26.4704-22.9376 46.4384-47.36 40.96z" fill="#d81e06" p-id="5437"></path><path d="M266.5984 141.4656c-9.8304-32.5632-40.2944-55.296-75.1104-50.944-31.3344 3.9424-56.832 30.6688-60.8256 63.8976-3.4816 29.0304 8.8576 55.1936 29.1328 70.3488v347.1872c181.2992-15.9744 339.3536-112.8448 437.8112-254.3104-17.2544-7.8848-35.8912-17.4592-55.8592-29.3376-96-56.8832-179.6096-3.3792-183.1424-1.0752-18.432 12.0832-42.7008 6.2464-54.2208-13.2096s-6.1952-45.056 12.032-57.3952c5.0688-3.4304 125.7472-83.0464 263.7824-1.2288 22.4768 13.312 42.496 23.1424 60.2624 30.5664 12.0832-23.8592 22.5792-48.6912 31.4368-74.2912-57.3952-17.2544-117.8112-45.4656-184.064-66.8672-83.968-27.1872-165.2224 3.584-221.2352 36.6592z" fill="#d81e06" p-id="5438"></path><path d="M298.496 255.1808c-1.1776-14.8992 5.2224-29.952 17.9712-38.5536 2.1504-1.4336 24.8832-16.4352 60.7232-27.136 28.4672-28.2112 54.0672-59.2384 76.3904-92.672-71.4752-10.6496-138.6496 16.128-186.9824 44.6464-9.8304-32.5632-40.2944-55.296-75.1104-50.944-31.3344 3.9424-56.832 30.6688-60.8256 63.8976-3.4816 29.0304 8.8576 55.1936 29.1328 70.3488v102.4512c49.6128-17.9712 96.1536-42.2912 138.7008-72.0384z" fill="#f34141" p-id="5439"></path></svg>)
      offsetx=10
    }
    


    let newMarkPoint=(
      <CustomOverlay autoViewPort position={point} offset={new window.BMapGL.Size(offsetx,3)}>
        <Popover content={content} title={author+'-'+city} trigger={"hover"}>
          <div className="markPointContainer">
            {/*红色 */}
            {/*<svg t="1678983893429" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2688" width="27" height="27"><path d="M277.942857 945.980952a234.057143 68.266667 0 1 0 468.114286 0 234.057143 68.266667 0 1 0-468.114286 0Z" fill="#061633" p-id="2689"></path><path d="M277.942857 945.980952a234.057143 68.266667 0 1 0 468.114286 0 234.057143 68.266667 0 1 0-468.114286 0Z" fill="#FF2102" opacity=".3" p-id="2690"></path><path d="M277.942857 945.980952a234.057143 68.266667 0 1 0 468.114286 0 234.057143 68.266667 0 1 0-468.114286 0Z" p-id="2691" data-spm-anchor-id="a313x.7781069.0.i4" class="selected"></path><path d="M512 1014.247619c-112.152381 0-234.057143-21.942857-234.057143-68.266667s121.904762-68.266667 234.057143-68.266666 234.057143 21.942857 234.057143 68.266666-121.904762 68.266667-234.057143 68.266667z m0-112.152381c-136.533333 0-209.67619 29.257143-209.67619 43.885714s73.142857 43.885714 209.67619 43.885715 209.67619-29.257143 209.67619-43.885715-73.142857-43.885714-209.67619-43.885714z" fill="#FF2102" p-id="2692"></path><path d="M726.552381 607.085714c73.142857-73.142857 102.4-177.980952 75.580952-277.942857s-104.838095-175.542857-207.238095-202.361905-209.67619 2.438095-282.819048 73.142858c-114.590476 112.152381-114.590476 292.571429 0 404.723809s299.885714 114.590476 414.476191 2.438095z" fill="#061633" p-id="2693" data-spm-anchor-id="a313x.7781069.0.i2" class="selected"></path><path d="M516.87619 399.847619m-219.428571 0a219.428571 219.428571 0 1 0 438.857143 0 219.428571 219.428571 0 1 0-438.857143 0Z" fill="#401C17" p-id="2694" data-spm-anchor-id="a313x.7781069.0.i1" class="selected"></path><path d="M243.809524 134.095238c151.161905-148.72381 399.847619-148.72381 551.009524 0 151.161905 148.72381 151.161905 392.533333 0 541.257143l-275.504762 268.190476L243.809524 675.352381C92.647619 524.190476 92.647619 282.819048 243.809524 134.095238z m482.742857 472.990476c73.142857-73.142857 102.4-177.980952 75.580952-277.942857s-104.838095-175.542857-207.238095-202.361905-209.67619 2.438095-282.819048 73.142858c-114.590476 112.152381-114.590476 292.571429 0 404.723809s299.885714 114.590476 414.476191 2.438095z" fill="#FF2102" p-id="2695" data-spm-anchor-id="a313x.7781069.0.i3" class="selected"></path></svg>*/} 
            <div className="markPoint">
              {/*蓝色 */}
            {/*<svg t="1679217309100" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1476" width="25" height="25"><path d="M511.997542 0A350.50496 350.50496 0 0 0 265.909862 597.62688L511.997542 845.2096l246.14912-247.58272A350.50496 350.50496 0 0 0 511.997542 0.06144z m0 505.63072a155.12576 155.12576 0 0 1-154.73664-155.51488v-0.13312a155.06432 155.06432 0 0 1 154.624-155.51488h0.06144a155.12576 155.12576 0 0 1 154.78784 155.51488v0.13312a155.06432 155.06432 0 0 1-154.54208 155.45344h-0.19456zM357.260902 958.98624c0 35.91168 69.2736 65.01376 154.73664 65.01376s154.73664-29.11232 154.73664-65.01376-69.28384-65.01376-154.73664-65.01376-154.73664 29.10208-154.73664 65.01376z" fill="#87cefa" p-id="1477"></path></svg>   */}
            {/* 图钉*/}
            {icon}
            </div>
          </div>
        </Popover>
      </CustomOverlay>
    )
    this.addComponent(TYPE.MARKPOINT,newMarkPoint);
  }
  setMarkPointVisibility(show){
    this.setState({
      showMarkPoint:show,
    })
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

  addAuthorPath(path_arc,path_lushu){
    let path=path_lushu.path;
    this.addArcs(path_lushu)
    this.addMarkPoints(path_arc)
    this.centerAndZoom(path);
  }
  setRoadBookData(path_lushu){
    let path=path_lushu.path;
    var landmarkPois = []
    for(let i=0; i<path_lushu.path.length; ++i){
      landmarkPois.push({
        lng: path_lushu.path[i].lng,
        lat: path_lushu.path[i].lat,
        html: ('<div class="lushuInfoWindow">'
                  +'<p class="lushuInfoWindowTitle">'
                  +path_lushu.times[i]
                  +'</p>'
                +'<p class="lushuInfoWindowP">'
                +path_lushu.events[i]
                +'</p></div>'),
      })
    }
    this.setState({
      lushu_path: path,
      lushu_landmarks:landmarkPois
    });
  }
  addRoadBook(path_lushu,speed,pauseTime,data) {
    let path=path_lushu.path;
    var flytime = Math.round((150-600)/100*speed+600); // 150 600 s e
    var lushu = new window.BMapGLLib.LuShu(
      this.map, path, {
      // geodesic: true,
      // autoCenter: true,
      autoCenterAndZoom: true,
      enableRotation: true,
      defaultContent:"出发",
      odCurve:true,
      landmarkPois: data
    }, flytime,pauseTime);
    this.setState({
      lushu: lushu
    }); 
  }
  
  componentDidMount() {
    if (!this.created) {
      this._initMap();
      this.created = !this.created;
    }
    this._addController(new mapVisualizeController(this.map,{
      setArcVisibility:this.setArcVisibility,
      setMarkPointVisibility:this.setMarkPointVisibility,
      startRoadBook:this.startRoadBook,
      onRoadBookSpeedChange:this.onRoadBookSpeedChange,
      onRoadBookPauseTimeChange:this.onRoadBookPauseTimeChange,
      roadBookPauseResume:this.roadBookPauseResume,
      getRoadBookPause:this.getRoadBookPause,
      }
      ));
    this._addController(new textReaderController(this.map,this.props.selectedTitle,this.props.selectedAuthor));
    //axios请求获取城市id,城市名称对应列表
  }
  render() {
    // textReaderDrawerContent=<TextReader title={selectedTitle} author={selectedAuthor}/>
    var components = this.state.components.map((value, index, array) => {
      if(!this.state.showArc&&value.type==TYPE.ARC) return null;
      if(!this.state.showMarkPoint&&value.type==TYPE.MARKPOINT) return null;
      if(value.show) return value.value;
      else return null;
    });

    return (
      <Map
        ref={(ref) => {
          this.mapRef = ref;
        }}
        style={mapStyle}
        mapStyleV2={{styleJson:lightstyle}}
        center={new window.BMapGL.Point(114, 38)}
        zoom={5}
      >
        {/*
        <MapvglView effects={['lighter']}>
          <MapvglLayer
            type="LineLayer"
            blend= 'lighter'
            
            data={[{
              geometry: {
              type: 'LineString',
              coordinates: [
                  [116.394191, 39.91334],
                  [85.770182,30.765311]
              ]
              }
          }]}
            options={{
              width: 12,
              color: 'rgb(255, 53, 0, 0.6)',
              animation:true,
            }}
            animationOptions={{
              animation:true,
            }}
          />
        </MapvglView>
        */}
        
        {components}
      </Map>
    );
  }
}