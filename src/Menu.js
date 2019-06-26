import React from 'react';
import {default as localforage} from 'localforage';

class Menu extends React.Component {
    render(){
        return(
            <div className="menu">
                <button type="button" onClick={this.props.show}>All Teams</button>
                <button type="button" onClick={this.props.myFav}>My Favourites</button>
                {/* <button type="button" >Sort by Name</button>
                <button type="button" >Sort by Wins</button>                  */}
                <select onChange={this.props.sortBy} value={this.props.selectValue}>
                    <option disabled selected hidden value=''> sort by </option>
                    <option value="name">Name</option>
                    <option value="wins">Wins</option>
                </select>  
            </div>
        );
    }
}

export default Menu;