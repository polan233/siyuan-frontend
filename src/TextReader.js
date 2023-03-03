import React from "react";
import { Typography,Button } from 'antd';
import { getContentByTitle } from "./axios/api";
const { Title, Paragraph, Text, Link } = Typography;


class TextReader extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        // getContentByTitle(this.props.title,this.handleContent);
        return(
            <div className="textReader">
                
                <div id="textReader-main">
                    <Typography >
                        <Title id="textReader-title" level={2}>{this.props.title}</Title>
                        <Title id="textReader-author" level={3}>{this.props.author}</Title>
                        {this.props.content}
                    </Typography>
                </div>
                
            </div>
        )
    }

}

export default TextReader