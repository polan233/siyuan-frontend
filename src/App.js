import React from 'react';
import { DatePicker,Button,Space, Typography } from 'antd';
function ButtonGroup(){
    return(
        <div>
            <Button type="primary">Primary Button</Button>
        </div>
    )
}
function App () {
  return(
  <div className='App'>
    <ButtonGroup/>
    <DatePicker/>
  </div>
  )
};

export default App;