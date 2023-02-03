import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import { Divider } from 'antd';
import MainContent from './MainContent';
import SecondContent from './SecondContent';
import { getGroupProblem } from './axios/api';
import { QuestionList } from './Question';
const authorDict={
    "title":"author",
    "1":"author1",
    "2":"author2",
    "3":"author3",
    "4":"author4",
    "5":"author5",
}

class Body extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTitle: "",
            selectedAuthor: "",
            authorDict:{},
            groupQuestions:new QuestionList([]),
        }
        this.handleNavClick=this.handleNavClick.bind(this);
        this.getAuthorByTitle=this.getAuthorByTitle.bind(this);
        this.setAuthorDict=this.setAuthorDict.bind(this);
        this.handleGroupProblemResponse=this.handleGroupProblemResponse.bind(this);
    }
    getAuthorByTitle(title){
        return this.state.authorDict[title];
    }
    setAuthorDict(dict){
        //console.log(dict);
        this.setState({
            authorDict:dict,
        });
    }
    handleGroupProblemResponse(response){
        console.log("handleProblemResponse called",response);
        let data=response.data.data;
        this.setState({
            groupQuestions:new QuestionList(data.problems)
        })
    }
    handleNavClick(e){
        console.log("handleNavClick Called",e.key);
        const title=e.key;
        const author=this.getAuthorByTitle(e.key)
        this.setState({
            selectedTitle:title,
            selectedAuthor: author
        })
        getGroupProblem(title,author,this.handleGroupProblemResponse)
        console.log("Body state set!");
    }
    render(){
        return(
        <div className='body'>
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
            />
        </div>
        )
    }
}
export default Body;