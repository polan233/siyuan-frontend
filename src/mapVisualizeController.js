import React from "react";
import {createRoot} from 'react-dom/client'
import { Button,Drawer, Space, Switch, Slider,Row,Col,Divider} from 'antd';

export class mapVisualizeController extends window.BMapGL.Control{
    constructor(map,callbackFns){
      super();
      
      this.defaultAnchor = window.BMAP_ANCHOR_TOP_RIGHT;
      this.defaultOffset = new window.BMapGL.Size(20, 20);
      this.map = map
      this.setArcVisibility=callbackFns.setArcVisibility;
      this.setMarkPointVisibility=callbackFns.setMarkPointVisibility;
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
          const dividerStyle={
            'border-top':'rgb(0,0,0)'
          }
          return (
            <div>

              <Button type="primary" id="mapSelectionControllerButton" onClick={this.setOpen}>
                地图选项
              </Button>

              <Drawer  className = "drawer" id="mapSelectionDrawer" width={"30%"} title="地图选项" placement="right" closable={true} onClose={this.setClose} open={this.state.open} getContainer={this.container.parentNode} 
              rootStyle={{
                position: "absolute"
              }}
              bodyStyle={{
                color: "black",
              }}>
                  <Divider dashed orientation="left" style={dividerStyle}>路书控制</Divider>
                  <Row gutter={[22, 24]}
                  justify="start">
                    <Col  span={'24'} >
                    <div><p className="buttonLeftText">路书移动速度</p><Slider/></div>
                    </Col>
                  </Row>
                  <Row gutter={[24, 24]}
                  justify="start">
                    <Col className="startRoadBookCol" flex={"1 1 30px"} >
                        <Space>
                         <Button type="primary" className="drawerSwitch" defaultChecked={false} onClick={() => {
                              this.setState({
                                showRoadBook: true
                              })
                            }} >
                            启动路书
                          </Button>
                        </Space>
                    </Col>
                  </Row>
                  <Divider dashed orientation="left" style={dividerStyle}>作者轨迹控制</Divider>
                  <Row
                  gutter={[22, 24]}
                  justify="start"
                  >
                    <Col flex={'auto'}>
                      <Space>
                        <p className="buttonLeftText">路径</p>
                        <Switch className="drawerSwitch" checkedChildren="开" 
                          unCheckedChildren="关" defaultChecked onChange={(checked) => 
                          {this.props.setArcVisibility(checked)}} 
                        />
                      </Space>
                    </Col>
                    <Col  flex={'auto'}>
                      <Space>
                        <p className="buttonLeftText">标注</p>
                        <Switch className="drawerSwitch" checkedChildren="开" 
                          unCheckedChildren="关" defaultChecked 
                          onChange={(checked) => {this.props.setMarkPointVisibility(checked)}} 
                        />
                      </Space>
                    </Col>
                    {/* 
                    <Col  flex={'auto'}>
                      <Space>
                        <p className="buttonLeftText">折线</p>
                        <Switch className="drawerSwitch" checkedChildren="开" unCheckedChildren="关" 
                        defaultChecked onChange={(checked) => {}} />
                      </Space>
                    </Col>
                    */}
                  </Row>
              </Drawer>
            </div>
          )
        }
      }
      //TO-DO: 给上面这些按钮加onClick
      root.render(
        <MapSelectionDrawer 
          container={this.map.getContainer()} 
          setArcVisibility={this.setArcVisibility}
          setMarkPointVisibility={this.setMarkPointVisibility}
        />
      );
      return card;
    }
  }

export class roadBookController extends window.BMapGL.Control {
  constructor(map, lushu){
    super();
    this.defaultAnchor = window.BMAP_ANCHOR_TOP_LEFT;
    this.defaultOffset = new window.BMapGL.Size(110, 20)
    this.map = map
    this.lushu = lushu
  }
  initialize(map){
    var div = document.createElement('div');
    // div.id = "roadBookController";
    div.classList.add("delOnReset");

    map.getContainer().appendChild(div);
    const root = createRoot(div);
    root.render(<Button type="primary" onClick={() => {
      // this.lushu.stop();
      this.lushu.start();
    }} id="roadBookController">
      开始
    </Button>);
    return div;
  }
}