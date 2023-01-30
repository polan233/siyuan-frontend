import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import { Layout,  Divider } from 'antd';
import Top from './Top'
import Foot from './Foot.js'
import Body from './Body'
const { Content } = Layout;

const Page = () => (
  <div className='Page'>
    <Layout>
      <Top/>
      <Content>
        <Body/>
      </Content>
      <Divider/>
      <Foot></Foot>
    </Layout>
  </div>
);

export default Page;

