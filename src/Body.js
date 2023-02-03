import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import { Divider } from 'antd';
import MainContent from './MainContent';
import SecondContent from './SecondContent';
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
        }
        this.handleNavClick=this.handleNavClick.bind(this);
        this.getAuthorByTitle=this.getAuthorByTitle.bind(this);
        this.setAuthorDict=this.setAuthorDict.bind(this);
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
    handleNavClick(e){
        console.log("handleNavClick Called",e.key);
        this.setState({
            selectedTitle: e.key,
            selectedAuthor: this.getAuthorByTitle(e.key)
        })
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
            />
        </div>
        )
    }
}
export default Body;