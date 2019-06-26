import React from 'react';
class Logo extends React.Component {
    constructor(props){
        super(props);
        this.state={
            loaded:false //set to true when loaded to allow rest components to render without waiting for it 
        };
    }
    render(){
        return(
            <img src={this.props.url} onLoad={() => this.setState({loaded: true})} alt="not available" className="image" style={this.state.loaded ? {} : {visibility: 'hidden'}}/>
        );
    }
}

export default Logo;