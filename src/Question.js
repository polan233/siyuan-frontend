import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import {  Space,Typography,Card,Button } from 'antd';
import {LeftOutlined,RightOutlined   } from '@ant-design/icons';
import { getGroupProblem } from './axios/api';

const { Paragraph  } = Typography;

const testQuestionList=["问题1问题1问题1问题1问题1问题1问题1问题1问题1?",
"问题2问题2问题2问题2问题2问题2问题2问题2?",
"问题3问题3问题3问题3问题3问题3问题3问题3问题3问题3问题3?",
"问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4问题4?"]

export class QuestionList{
    constructor(list){
        this.list=list;
        this.index=0;
        this.length=list.length;
    }
    get(){
        return this.list[this.index];
    }
    getNext(){
        this.index=(this.index+1)%this.length;
        return this.list[this.index];
    }
    getPre(){
        this.index=(this.index-1);
        if(this.index<0){
            this.index=this.length-1;
        }
        return this.list[this.index];
    }
}


//先假定不提前存储所有问题,而是每次选择题目时请求本题目对应的问题列表
class Question extends React.Component{
    constructor(props){
        super(props);
        this.state={
            question:this.props.questions.get()
        }
        this.onNextClick=this.onNextClick.bind(this);
        this.onPreClick=this.onPreClick.bind(this);
    }
    onNextClick(e){
        let questions= this.props.questions;
        questions.getNext();
        this.setState({
            question:questions.get()
        })
    }
    onPreClick(e){
        let questions= this.props.questions;
        questions.getPre();
        this.setState({
            question:questions.get()
        })
    }
    componentDidMount(){
        this.setState({
            question:this.props.questions.get()
        })
    }
    render(){
        let questions= this.props.questions;
        const question=questions.get();
        return(
            <Card id='questionCard' size="default" title="小组思考" bordered >
            <div className='question'>
                <Typography>
                <Paragraph className='paragraph'>
                    {question}
                </Paragraph>
                </Typography>
                <div className='questionButtons'>
                <Space>
                <Button icon={<LeftOutlined />} size={'small'} onClick={this.onPreClick} />
                <Button icon={<RightOutlined />} size={'small'} onClick={this.onNextClick} />
                </Space>
                </div>
            </div>
            </Card>
        );
    }
  }
export default Question;