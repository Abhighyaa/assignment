import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

class Logo extends React.Component {
    constructor(props){
        super(props);
        this.state={
            loading:true
        };
    }
    render(){
        // if(this.state.loading==true)
        //         return(<div>Loading Logo...</div>)
        // else{
            return(
                <div>
                    <LazyLoadImage className="image"
                        alt="loading..."
                        effect="blur"
                        placeholdersrc="loading..."
                        src={this.props.url}  />
                    {/* <img src={this.props.url} alt="not available" className="image" /> */}
                </div>
            );
        // }
    }
}

export default Logo;