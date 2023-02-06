import React from "react";
import { Map, Arc, Polyline, Marker } from "react-bmapgl";
import { getAuthorPath } from "./axios/api";
import "./LuShu"

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
    this.addRoadBook = this.addRoadBook.bind(this);
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
          if (results.getNumPois() <= 0) reject("城市不存在" + element);
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
    this.getCityPointArray(path_city)
      .then((path) => {
        if (path.length < 2) return;
        for (let i = 0; i < path.length - 1; i++) {
          this.addArc(
            { point: path[i], city: path_city[i] },
            { point: path[i + 1], city: path_city[i + 1] }
          );
        }
      })
      .catch((e) => {
        window.alert(e);
      });
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
        this.setState((state) => ({
          components: state.components.slice().concat([newPolyline]),
        }));
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
          this.setState((state) => ({
            components: state.components.slice().concat([newMarker]),
          }));
        });
      })
      .catch((e) => {
        window.alert(e);
      });
  }
  addRoadBook(path_city) {
    this.getCityPointArray(path_city).then((path) => {
      var polyline = new window.BMapGL.Polyline(path, {
        clip: false,
        geodesic: true,
        strokeWeight: 3,
      });
      function startLushu(map) {
        var fly =
          "data:image/png;base64,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";
        var lushu = new window.BMapGLLib.LuShu(
          map, polyline.getPath(), {
          geodesic: true,
          autoCenter: true,
          icon: new window.BMapGL.Icon(fly, new window.BMapGL.Size(48, 48), {
            anchor: new window.BMapGL.Size(24, 24),
          }),
          speed: 1000000,
          enableRotation: true,
        });
        lushu.start();
      }
      this.map.addOverlay(polyline);
      startLushu(this.map);
    })
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
