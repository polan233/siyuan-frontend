import React from "react";
import {createRoot} from 'react-dom/client'
import TextReader from './TextReader'
import { Button,Drawer, Space,Typography } from 'antd';
import {getContentByTitle} from "./axios/api"
const {  Paragraph } = Typography;

export class textReaderController extends window.BMapGL.Control{
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