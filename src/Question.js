import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import {  Space,Typography,Card,Button } from 'antd';
import {LeftOutlined,RightOutlined   } from '@ant-design/icons';

const { Paragraph  } = Typography;

class Question extends React.Component{
    constructor(props){
      super(props)
    }
    render(){
      return(
        <Card id='questionCard' size="default" title="Question" bordered >
          <div className='question'>
            <Typography>
              <Paragraph className='paragraph'>
                In the process of internal desktop applications development, many different design specs and
                implementations would be involved, which might cause designers and developers difficulties and
                duplication and reduce the efficiency of development.
              </Paragraph>
            </Typography>
            <div className='questionButtons'>
            <Space>
              <Button icon={<LeftOutlined />} size={'small'} />
              <Button icon={<RightOutlined />} size={'small'} />
            </Space>
            </div>
            
          </div>
        </Card>
      );
    }
  }
export default Question;