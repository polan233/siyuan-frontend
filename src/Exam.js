import { SettingOutlined } from '@ant-design/icons';
import { Collapse, Select } from 'antd';
import React, { useState } from 'react';
import './App.css'
const { Panel } = Collapse;
const { Option } = Select;

class Exam extends React.Component{
    constructor(props){
        super(props);
        this.text = `
            A dog is a type of domesticated animal.
            Known for its loyalty and faithfulness,
            it can be found as a welcome guest in many households across the world.`;
    }
    onChange(key) {
        console.log(key);
    };
    render(){
        return(
            <div className='exam'>
            <Collapse accordion expandIconPosition='end'  onChange={this.onChange}>
                <Panel header="This is panel header 1" key="1">
                    <div className='examContent'>{this.text}</div>
                </Panel>
                <Panel header="This is panel header 2" key="2">
                    <div className='examContent'>{this.text}</div>
                </Panel>
                <Panel header="This is panel header 3" key="3">
                    <div className='examContent'>{this.text}</div>
                </Panel>
            </Collapse>
            </div>
        );
    }
}

export default Exam;