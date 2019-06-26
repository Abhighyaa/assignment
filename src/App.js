import React from 'react';
import './App.css';
import Menu from './components/Menu.js';
import Table from './components/Table.js';
import Fav from './components/Fav.js'
class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      showAll:true,
      selectValue:'',
    };
  }
  fav=()=>{
    this.setState({showAll:false}); //To determine whether all teams or fav teams only
  }
  all=()=>{
    this.setState({showAll:true}); //To determine whether all teams or fav teams only
  }
  changeSort=(e)=>{
    this.setState({selectValue:e.target.value}); //To determine sort by name or wins
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
