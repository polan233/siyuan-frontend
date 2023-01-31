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
          />
          <Divider/>
          <Exam
            selectedTitle={this.props.selectedTitle}
            selectedAuthor={this.props.selectedAuthor}
          />
        </div>
      );
    }
  }
export default SecondContent;