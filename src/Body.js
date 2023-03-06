import React,{ Suspense, lazy } from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import { Divider } from 'antd';
import { getGroupProblem,getArticleTypeByName,getExamContents } from './axios/api';
import { QuestionList } from './Question';
import { ExamList } from './Exam';

const authorDict={
    "title":"author",
    "1":"author1",
    "2":"author2",
    "3":"author3",
    "4":"author4",
    "5":"author5",
}

const MainContent= lazy(()=>import('./MainContent'))
const SecondContent=lazy(()=>import('./SecondContent'))

class Body extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTitle: "",
            selectedAuthor: "",
            authorDict:{},
            groupQuestions:new QuestionList([]),
            hasExam:false,
            moxieList:null,
            shiciList:null,
            juziList:null,
        }
        this.handleNavClick=this.handleNavClick.bind(this);
        this.getAuthorByTitle=this.getAuthorByTitle.bind(this);
        this.setAuthorDict=this.setAuthorDict.bind(this);
        this.handleGroupProblemResponse=this.handleGroupProblemResponse.bind(this);
        this.handleLoadExam=this.handleLoadExam.bind(this);
        this.handleExamContent=this.handleExamContent.bind(this);
    }
    getAuthorByTitle(title){
        return this.state.authorDict[title];
    }
    setAuthorDict(dict){
        this.setState({
            authorDict:dict,
        });
    }
    handleGroupProblemResponse(response){
        let data=response.data.data;
        this.setState({
            groupQuestions:new QuestionList(data.problems)
        })
    }
    handleNavClick(e){
        return new Promise((resolve,reject)=>{
            const title=e.key;
            const author=this.getAuthorByTitle(e.key)
            this.setState({
                selectedTitle:title,
                selectedAuthor: author
            })
            getGroupProblem(title,author,this.handleGroupProblemResponse)
            getArticleTypeByName(title,this.handleLoadExam);//判断文章类型并渲染exam
            resolve({title:title,author:author});
        })
    }
    handleLoadExam(title,response){
        const data=response.data.data.isModern;
        if(data){
            this.setState({
                hasExam:false
            })
        }
        else{
            getExamContents(title,this.handleExamContent)
        }
    }
    handleExamContent(response){
        const data=response.data.data;
        let moxie=data.moxie;
        let shici=data.zhushi;
        let juzi=data.juzi;
        this.setState({
            moxieList:new ExamList(moxie.problems,moxie.answers),
            shiciList: new ExamList(shici.problems,shici.answers),
            juziList:new ExamList(juzi.problems,juzi.answers),
        })
        this.setState({
            hasExam:true
        })
    }
    render(){
        return(
        <div className='body'>
        <Suspense fallback={<div>Loading</div>}>
            <MainContent
                onNavClick={this.handleNavClick}
                selectedTitle={this.state.selectedTitle}
                selectedAuthor={this.state.selectedAuthor}
                setAuthorDict={this.setAuthorDict}
                />
            <Divider/>
            <SecondContent
                selectedTitle={this.state.selectedTitle}
                selectedAuthor={this.state.selectedAuthor}
                groupProblems={this.state.groupQuestions}
                showExam={this.state.hasExam}
                moxieList={this.state.moxieList}
                shiciList={this.state.shiciList}
                juziList={this.state.juziList}
            />
        </Suspense>
        </div>
        )
    }
}
export default Body;