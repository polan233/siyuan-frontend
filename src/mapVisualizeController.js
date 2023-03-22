import React from "react";
import {createRoot} from 'react-dom/client'
import { Button,Drawer, Space, Switch, Slider,Row,Col} from 'antd';

export class mapVisualizeController extends window.BMapGL.Control{
    constructor(map,callbackFns){
      super();
      
      this.defaultAnchor = window.BMAP_ANCHOR_TOP_RIGHT;
      this.defaultOffset = new window.BMapGL.Size(20, 20);
      this.map = map
      this.setArcVisibility=callbackFns.setArcVisibility;
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
  
              <Drawer  className = "drawer" id="mapSelectionDrawer" width={"30%"} title="地图选项" placement="right" closable={true} onClose={this.setClose} open={this.state.open} getContainer={this.container.parentNode} 
              extra={
                    <Button onClick={this.setClose} type="primary" className="drawerContent">
                      重置
                    </Button>
              }
              rootStyle={{
                position: "absolute"
              }}
              bodyStyle={{
                color: "black",
              }}>
                  <Row gutter={[24, 24]}
                  justify="start">
                    <Col className="startRoadBookCol" flex={"1 1 30px"} >
                        <Space><p className="buttonLeftText">路书</p><Switch className="drawerSwitch" checkedChildren="开" unCheckedChildren="关" defaultChecked={false} onChange={(checked) => {
                          this.setState({
                            showRoadBook: checked
                          })
                        }} /></Space>
                    </Col>
                  </Row>
                  <Row gutter={[22, 24]}
                  justify="start">
                    <Col  span={'24'} >
                    {this.state.showRoadBook?<div><p className="buttonLeftText">路书移动速度</p><Slider/></div>:null}
                    </Col>
                  </Row>
                  <Row
                  gutter={[22, 24]}
                  justify="start"
                  >
                    <Col flex={'auto'}>
                      <Space><p className="buttonLeftText">路径</p><Switch className="drawerSwitch" checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={(checked) => {this.props.setArcVisibility(checked)}} /></Space>
                    </Col>
                    <Col  flex={'auto'}>
                      <Space><p className="buttonLeftText">标注</p><Switch className="drawerSwitch" checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={(checked) => {}} /></Space>
                    </Col>
                    <Col  flex={'auto'}>
                      <Space><p className="buttonLeftText">折线</p><Switch className="drawerSwitch" checkedChildren="开" unCheckedChildren="关" defaultChecked onChange={(checked) => {}} /></Space>
                    </Col>
                  </Row>
              </Drawer>
            </div>
          )
        }
      }
      //TO-DO: 给上面这些按钮加onClick
      root.render(<MapSelectionDrawer container={this.map.getContainer()} setArcVisibility={this.setArcVisibility}/>);
      return card;
    }
  }