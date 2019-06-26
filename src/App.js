import React from 'react';
import './App.css';
import Menu from './Menu.js';
import Table from './Table.js';
import Fav from './Fav.js'
class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      showAll:true,
      selectValue:'',
    };
  }
  fav=()=>{
    this.setState({showAll:false});
  }
  all=()=>{
    this.setState({showAll:true});
  }
  changeSort=(e)=>{
    this.setState({selectValue:e.target.value});
    console.log("in fun"+e.target.value)
  }
  render(){ 
    return (
      <div>
        <Menu myFav={this.fav} show={this.all} sortBy={this.changeSort}></Menu>
        { this.state.showAll ? <Table sortByValue={this.state.selectValue}></Table>  : <Fav sortByValue={this.state.selectValue}></Fav> }
        
      </div>
    );
  }
}

export default App;
