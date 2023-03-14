import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import {  Divider } from 'antd';
import Exam from './Exam.js'
import Question from './Question.js';



class SecondContent extends React.Component{
    constructor(props){
      super(props)
    }
    render(){
      return(
        <div className='secondContent'>
          <Question
            selectedTitle={this.props.selectedTitle}
            selectedAuthor={this.props.selectedAuthor}
            questions={this.props.groupProblems}
            show={this.props.showQuestion}
          />
          <Divider/>
          <Exam
            selectedTitle={this.props.selectedTitle}
            selectedAuthor={this.props.selectedAuthor}
            show={this.props.showExam}
            moxie={this.props.moxieList}
            shici={this.props.shiciList}
            juzi={this.props.juziList}
          />
        </div>
      );
    }
  }
export default SecondContent;