import React from "react";
import Script from 'react-load-script'

class BmapScript extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scriptStatus: 'no'
        }
    }

    handleScriptCreate() {
      this.setState({ scriptLoaded: false })
    }
     
    handleScriptError() {
      this.setState({ scriptError: true })
    }
     
    handleScriptLoad() {
      this.setState({ scriptLoaded: true, scriptStatus: 'yes' })
    }

    render() {
        return (
            <>
            <Script
              url="//api.map.baidu.com/api?type=webgl&v=2.0&ak=2R13Vq0ZVL2spBcmuuEGSg6aojKxs4uA"
              onCreate={this.handleScriptCreate.bind(this)}
              onError={this.handleScriptError.bind(this)}
              onLoad={this.handleScriptLoad.bind(this)}
            />
            <div>动态脚本引入状态：{this.state.scriptStatus}</div>
            </>
        );
    }
}

export default BmapScript;
