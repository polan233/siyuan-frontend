import React from "react";
import { Map, Arc, Polyline, Marker } from "react-bmapgl";
import { getAuthorPath } from "./axios/api";

const mapStyle = {
  width: "100%",
  margin: "2px",
  height: "70vh",
  minHeight: "30vh",
  resize: "vertical",
  overflow: "auto",
};

export default class MyMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      components: [],
    };
    this.created = false;
    this.addArc = this.addArc.bind(this);
    this.addMarkers = this.addMarkers.bind(this);
    this.addPolyline = this.addPolyline.bind(this);
    this.addArcs = this.addArcs.bind(this);
    this.searchCityPoint = this.searchCityPoint.bind(this);
  }

  _initMap() {
    var localcity = new window.BMapGL.LocalCity();
    this.map = this.mapRef.map;
    localcity.get((e) => {
      var point = new window.BMapGL.Point(e.center.lng, e.center.lat);
      this.map.centerAndZoom(point, 5);
    });
    this.map.enableScrollWheelZoom(true);
    this.map.addControl(new window.BMapGL.ScaleControl());
    this.map.addControl(new window.BMapGL.ZoomControl());
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
        var element = path_city[index];
        this.searchCityPoint(element, (results) => {
          if(results.getNumPois() <= 0) reject("城市不存在"+element);
          path_point[index] = results.getPoi(0).point;
          if (index == path_city.length - 1) resolve(path_point);
        });
      }
    });
  }
  addArc(from, to) {
    var newArc = (
      <Arc
        // key={Date.now()}
        autoViewport
        showStartPoint
        showEndPoint
        enableAnimation
        data={[{ from: from, to: to }]}
      />
    );
    this.setState((state) => ({
      components: state.components.slice().concat([newArc]),
    })); // state的更新是异步的
  }
  addArcs(path_city) {
    this.getCityPointArray(path_city).then((path) => {
      if (path.length < 2) return;
      for (let i = 0; i < path.length - 1; i++) {
        this.addArc({point: path[i], city: path_city[i]}, {point: path[i + 1], city: path_city[i+1]});
      }
    }).catch((e) => {
      window.alert(e);
    });
  }
  addPolyline(path_city) {
    this.getCityPointArray(path_city).then((path_point) => {
      var newPolyline = (
        <Polyline
          // key={Date.now()}
          path={path_point}
          clip={false}
          geodesic={true}
          strokeWeight={3}
        ></Polyline>
      );
      this.setState((state) => ({
        components: state.components.slice().concat([newPolyline]),
      }));
    }).catch((e) => {
      window.alert(e);
    });
  }
  addMarkers(positions) {
    this.getCityPointArray(positions).then((path_point) => {
      path_point.forEach(element => {
        var newMarker = <Marker key={Date.now()} position={element} />;
        this.setState((state) => ({
          components: state.components.slice().concat([newMarker]),
        }));
      });
    }).catch((e) => {
      window.alert(e);
    });
  }
  componentDidMount() {
    if (!this.created) {
      this._initMap();
      this.created = !this.created;
    }
  }
  render() {
    return (
      <Map
        ref={(ref) => {
          this.mapRef = ref;
        }}
        style={mapStyle}
      >
        {this.state.components}
      </Map>
    );
  }
}

export function createAuthorRoadBook(author, map) {
  // // 百度地图API功能
  // function G(id) {
  //   return document.getElementById(id);
  // }
  // var map = new BMap.Map("l-map");
  // map.centerAndZoom("北京", 12); // 初始化地图,设置城市和地图级别。
  // var ac = new BMap.Autocomplete({ //建立一个自动完成的对象
  //   input: "suggestId",
  //   location: map,
  // });
  // ac.addEventListener("onhighlight", function (e) {
  //   //鼠标放在下拉列表上的事件
  //   var str = "";
  //   var _value = e.fromitem.value;
  //   var value = "";
  //   if (e.fromitem.index > -1) {
  //     value =
  //       _value.province +
  //       _value.city +
  //       _value.district +
  //       _value.street +
  //       _value.business;
  //   }
  //   str =
  //     "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
  //   value = "";
  //   if (e.toitem.index > -1) {
  //     _value = e.toitem.value;
  //     value =
  //       _value.province +
  //       _value.city +
  //       _value.district +
  //       _value.street +
  //       _value.business;
  //   }
  //   str +=
  //     "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
  //   G("searchResultPanel").innerHTML = str;
  // });
  // var myValue;
  // ac.addEventListener("onconfirm", function (e) {
  //   //鼠标点击下拉列表后的事件
  //   var _value = e.item.value;
  //   myValue =
  //     _value.province +
  //     _value.city +
  //     _value.district +
  //     _value.street +
  //     _value.business;
  //   G("searchResultPanel").innerHTML =
  //     "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
  //   setPlace();
  // });
  // function setPlace() {
  //   map.clearOverlays(); //清除地图上所有覆盖物
  //   function myFun() {
  //     var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
  //     map.centerAndZoom(pp, 18);
  //     map.addOverlay(new BMap.Marker(pp)); //添加标注
  //   }
  //   var local = new BMap.LocalSearch(map, {
  //     //智能搜索
  //     onSearchComplete: myFun,
  //   });
  //   local.search(myValue);
  // }
  // // 将地址解析结果显示在地图上，并调整地图视野
}
