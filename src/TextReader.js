import React from "react";
import { Typography,Button } from 'antd';
import { getContentByTitle } from "./axios/api";
const { Title, Paragraph, Text, Link } = Typography;


class TextReader extends React.Component{
    constructor(props){
        super(props);
        this.state={
            paragraphs:[],
        }
        this.handleContent=this.handleContent.bind(this);
    }
    buildParagraph(textStr_p){
        console.log("text_p",textStr_p)
        let textStr=textStr_p.replace("\r\n\r\n","\r\n");
        let res=[]
        let temp=""
        for(let i=0;i<textStr.length;i++){
            const char=textStr[i];
            if((textStr[i]==='\r'&&i==(textStr.length-2))||(textStr[i]==='\r'&&textStr[i+1]=='\n')){
                console.log("paragraph build complete",temp)
                res.push(<Paragraph className="textReader-p">{temp}</Paragraph>)
                temp=""
            }else{
                temp=temp.concat(new String(char))
                console.log("paragraph building",temp)
            }
        }
        res.push(<Paragraph className="textReader-p">{temp}</Paragraph>)
        return res;
    }
    handleContent(response){
        console.log("handleContent",response)
        const text=this.buildParagraph(response.data.data.content)
        this.setState({
            paragraphs:text
        })
    }
    componentDidMount(){
        //TO-DO api请求获取文章内容并处理
        getContentByTitle(this.props.title,this.handleContent);
        // const text=this.buildParagraph(testText)
        // this.setState({
        //     paragraphs:text
        // })
    }
    render(){
        return(
            <div className="textReader">
                
                <div id="textReader-main">
                    <Typography >
                        <Title id="textReader-title" level={2}>{this.props.title}</Title>
                        <Title id="textReader-author" level={3}>{this.props.author}</Title>
                        {this.state.paragraphs}
                    </Typography>
                </div>
                
            </div>
        )
    }

}

export default TextReader