import React from 'react';
import 'antd/dist/reset.css';
import "./App.css"
import { Layout,  Divider } from 'antd';
import Top from './Top'
import Foot from './Foot.js'
import MainContent from './MainContent';
import SecondContent from './SecondContent';
const { Content } = Layout;

const Page = () => (
  <div className='Page'>
    <Layout>
      <Top/>
      <Content>
        <MainContent></MainContent>
        <Divider/>
        <SecondContent></SecondContent>
      </Content>
      <Divider/>
      <Foot></Foot>
    </Layout>
  </div>
);

export default Page;

