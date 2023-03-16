import { Collapse, Select } from 'antd';
import React, { useState } from 'react';
import './App.css'
import {  Space,Button,Row,Col } from 'antd';
import {LeftOutlined,RightOutlined   } from '@ant-design/icons';
const { Panel } = Collapse;
const { Option } = Select;

const testProblems=
[
"为什么大三的女生都很富有啊？",
'一条小河中有20多只青蛙在游泳，只有一只青蛙穿了裤衩，请问为什么？',
'鸡鹅百米赛跑,鸡比鹅跑得快,为什么却后到终点站?',
'一头老母猪过桥，桥能承受500公斤的重量，老母猪重300公斤，可是它到桥中间桥却塌了，请问怎么回事？',
'一只蚂蚁从15万千米的高空掉到地上，问蚂蚁是怎么死的？（拒绝饿死/渴死/老死等低级答案）',
'世界上什么人一下子变老?',
'一颗心值多少钱?',
'一辆客车发生了事故，所有的人都受伤了，为什么小明却没事？'
];
const testAnswers=
[
"女大三抱金砖",
'穿裤衩的青蛙是搓澡的',
'鸡跑错了方向',
'老母猪还纳闷呢',
'嗨（high）死的',
'新娘.因为今天是新娘,明天是老婆.',
'1亿.因为一心一意嘛!',
'因为他不在车上'
];

function getMoxieFromTitle(title){
    //TO-DO: 根据题目获得默写题
    return new ExamList(testProblems,testAnswers);
}
function getShiciFromTitle(title){
    //TO-DO: 根据题目获得默写题
    return new ExamList(testProblems,testAnswers);
}
function getJuziFromTitle(title){
    //TO-DO: 根据题目获得默写题
    return new ExamList(testProblems,testAnswers);
}

class Exam extends React.Component{
    constructor(props){
        super(props);
        this.state={
            select:null,
            moxieShow:false,
            shiciShow:false,
            juziShow:false,
        }
        this.onChange=this.onChange.bind(this);
        this.onNext=this.onNext.bind(this);
        this.onPre=this.onPre.bind(this);
        this.onShow=this.onShow.bind(this);
    }
    onChange(key) {
        this.setState({
            select:key,
        });
        this.setState({
            moxieShow:false,
            shiciShow:false,
            juziShow:false,
        });
    };
    onNext(e){
        const mode=this.state.select;
        if(mode==="Moxie"){
            let list=this.props.moxie;
            list.goNext();
        }
        if(mode==="Shici"){
            let list=this.props.shici;
            list.goNext();
        }
        if(mode==="Juzi"){
            let list=this.props.juzi;
            list.goNext();
        }
        this.setState({
            moxieShow:false,
            shiciShow:false,
            juziShow:false,
        })
    }
    onPre(e){
        
        const mode=this.state.select;
      
        if(mode==="Moxie"){
            let list=this.props.moxie;
            list.goPre();
           
        }
        if(mode==="Shici"){
            let list=this.props.shici;
            list.goPre();
            
        }
        if(mode==="Juzi"){
            let list=this.props.juzi;
            list.goPre();
            
        }
        this.setState({
            moxieShow:false,
            shiciShow:false,
            juziShow:false,
        })
    }

    onShow(e){
        const mode=this.state.select;
        if(mode==="Moxie"){
            this.setState({
                moxieShow:!this.state.moxieShow,
            })
        }
        if(mode==="Shici"){
            this.setState({
                shiciShow:!this.state.shiciShow,
            })
        }
        if(mode==="Juzi"){
            this.setState({
                juziShow:!this.state.juziShow,
            })
        }
    }
    
    render(){
        if(!this.props.show){
            return(
            <div className='exam'></div>
            )
        }
        let panels=[];
        if(this.props.moxie.length>0){
            panels.push(
            <Panel header="古文默写" key="Moxie">
                <ExamContent
                problem={this.props.moxie.getProblem()}
                answer={this.props.moxie.getAnswer()}
                onPre={this.onPre}
                onNext={this.onNext}
                show={this.state.moxieShow}
                onShow={this.onShow}
                >
                </ExamContent>
            </Panel>
            )
        }
        if(this.props.shici.length>0){
            panels.push(
                <Panel header="注释翻译" key="Shici">
                    <ExamContent
                        problem={this.props.shici.getProblem()}
                        answer={this.props.shici.getAnswer()}
                        onPre={this.onPre}
                        onNext={this.onNext}
                        show={this.state.shiciShow}
                        onShow={this.onShow}
                        >
                    </ExamContent>
                </Panel>
            )
        }
        if(this.props.juzi.length>0){
            panels.push(
                <Panel header="句子翻译" key="Juzi">
                    <ExamContent
                        problem={this.props.juzi.getProblem()}
                        answer={this.props.juzi.getAnswer()}
                        onPre={this.onPre}
                        onNext={this.onNext}
                        show={this.state.juziShow}
                        onShow={this.onShow}
                    >
                    </ExamContent>
                </Panel>
            )
        }
        return(
            <div className='exam'>
            <Collapse accordion expandIconPosition='end'  onChange={this.onChange}>
                {panels}
            </Collapse>
            </div>
        );
    }
}

class ExamContent extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <Row>
                <Col span={11}>
                    <ExamProblem content={this.props.problem} onNext={this.props.onNext} onPre={this.props.onPre}/>
                </Col>
                <Col flex={"auto"}>
                    <div id='myDivider'></div>
                </Col>
                <Col span={11}>
                    <ExamAnswer
                        content={this.props.answer}
                        show={this.props.show}
                        onShow={this.props.onShow}
                    />
                </Col>
            </Row>
        );
    }
}

export class ExamList{
    constructor(problems,answers){
        this.problems=problems;
        this.answers=answers;
        this.index=0;
        // if(problems.length!=answers.length){
        //     throw "问题列表与答案列表长度不一致";
        // }
        this.length= this.problems.length<this.answers.length?this.problems.length:this.answers.length;
    }
    getProblem(){
        return this.problems[this.index];
    }
    getAnswer(){
        return this.answers[this.index];
    }
    goNext(){
        this.index=(this.index+1)%this.length;
    }
    goPre(){
        
        this.index=(this.index-1);
        if(this.index<0){
            this.index=this.length-1;
        }
    }
    
}

//需要上级提供一个问题列表
class ExamProblem extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="examContainer">
                <div className='examContent'>
                    <p className='paragraph'>{this.props.content}</p>
                </div>
                <div className='examButton'>
                    <Space>
                    <Button icon={<LeftOutlined />} size={'small'} onClick={this.props.onPre} />
                    <Button icon={<RightOutlined />} size={'small'} onClick={this.props.onNext} />
                    </Space>
                </div>
            </div>
        );
    }
}

//需要上级提供一个答案列表，并且和问题对应
class ExamAnswer extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const show=this.props.show;
        const text= show ? "隐藏答案":"显示答案";
        const content= show? this.props.content:"";
        return(
            <div className="examContainer">
                <div className='examContent'>
                    <p className='paragraph'>{content}</p>
                </div>
                <Space>
                    <Button className='examButton' size='small' onClick={this.props.onShow}>{text}</Button>
                </Space>
            </div>
        );
    }
}

export default Exam;