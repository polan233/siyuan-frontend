import React from "react";
import {createRoot} from 'react-dom/client'
import { Button,Drawer, Space, Switch, Slider} from 'antd';

export class mapVisualizeController extends window.BMapGL.Control{
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