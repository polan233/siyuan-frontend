import 'react-bmapgl'


export function initMap(map) {
    var point = new window.BMapGL.Point(115.0, 35.0);
    map.centerAndZoom(point, 5);
    map.enableScrollWheelZoom(true);
    map.addControl(new window.BMapGL.ScaleControl());
    map.addControl(new window.BMapGL.ZoomControl());
}

export function MapComponent(props){
    console.log(props);
}

export function addArc(from, to, color) {

}