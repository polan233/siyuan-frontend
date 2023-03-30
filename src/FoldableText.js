import React from "react";

export default class FoldableText extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isFold:true,
        }
        this.handleFold=this.handleFold.bind(this);
    }
    handleFold(){
        const fold=this.state.isFold;
        this.setState({
            isFold:!fold,
        });
    }
    render(){
        const text=this.props.text;
        const length=this.props.maxRow*10
        const isFold=this.state.isFold;
        const maxRow=this.props.maxRow;
        let overflow=false;
        let button;
        if(text==null||text==undefined||!text.hasOwnProperty('length')){
            return <></>
        }
        if(text.length > length)
        {
            overflow=true;
            if(isFold){
                button=(<a onClick={this.handleFold}>展开</a>)
            }else{
                button=(<a onClick={this.handleFold}>折叠</a>)
            }
        }
        else
        {
            button=<></>;
        }
        return(
            <div>
                <div
                style = {(isFold&&overflow) ?
                        {
                        textIndent:"1.5rem",
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        webkitBoxOrient: 'vertical',
                        WebkitLineClamp: maxRow,
                    }:{textIndent:"1.5rem"} }
                >{text}
                </div>
                {button}
            </div>
        )
    }
}