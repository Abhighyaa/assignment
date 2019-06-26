import React from 'react';
import Logo from './Logo.js';
import Page from './Page.js';
import Star1 from './star1.png';
import {default as localforage} from 'localforage';

class Fav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            loading : true,
            currentPage : 1,
            currentPageTeams : [],
            teamsOnOnePage : 5,
            indexFirst : 0  ,
            indexLast:0,
            prev:null,
            prevShowAll:null,
        };
        this.removeFav = this.removeFav.bind(this);
    }
    removeFav=(item)=>{
        // console.log(key,item)
        localforage.removeItem(item.team_id).then(function() {
            console.log('Removed from fav');
        }).catch(function(err) {
            console.log('Try later');
        });
        this.componentDidMount();
    }
    displayCorrespondingTeams(num) {
        // alert(num)
        this.setState({currentPage: num});
        
        // console.log(this.state.currentPage)
    }

    componentDidMount() {
        var result=[];
        localforage.iterate(function(value, key, iterationNumber) {
            // result[key]=value;
            // console.log(value)
            result.push(JSON.parse(JSON.stringify(value)));
        }).then(() => {
            // console.log('Iteration has completed');
            console.log("result is"+result);
            this.setState({
                teams: result,
                loading : false
            });
        }).catch(function(err) {
            console.log(err);
        });
        // if(this.props.selectValue)
    }
    static getDerivedStateFromProps(props, state) {
        if(props.sortByValue=="wins"){
            let res=state.teams;
            res.sort(function(a,b){
                return parseInt(b.wins)  - parseInt(a.wins);
            }) 
            return {teams:res}            
        }
        if(props.sortByValue=="name"){
            let res=state.teams;
            res.sort(function(a,b){
                return a.name.localeCompare(b.name)
            }) 
            return {teams:res}           
        }
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
        this.state.prev=prevProps.sortByValue;
        this.state.prevShowAll=prevProps.showAll;
    }
    componentDidUpdate(){
            // console.log("current"+this.props.sortByValue)
            if(this.props.sortByValue=="wins"&& this.state.prev!="wins"){
                let res=this.state.teams;
                res.sort(function(a,b){
                    return parseInt(b.wins)  - parseInt(a.wins);
                }) 
                this.setState({teams:res})            
            }
            if(this.props.sortByValue=="name"&& this.state.prev!="name" ){
                let res=this.state.teams;
                res.sort(function(a,b){
                    return a.name.localeCompare(b.name)
                }) 
                this.setState({teams:res})            
            }
    }

    render(){
        if(this.state.loading===true)
            return(<div>Loading Fav teams information...</div>)
        else{
            
            this.state.indexLast=this.state.currentPage*this.state.teamsOnOnePage;
            this.state.indexFirst=this.state.indexLast-this.state.teamsOnOnePage;
            this.state.currentPageTeams=this.state.teams.slice(this.state.indexFirst,this.state.indexLast);
            if(this.state.currentPageTeams.length!=0){
            return(
                <div>
                    <table className="table">
                        <tbody>
                            <tr>
                                <th>Logo</th>
                                <th>Name</th>
                                <th>Wins</th>
                                <th>Losses</th>
                                <th>Favourite</th>
                            </tr>
                            
                            {this.state.currentPageTeams.map((item,key) =>{
             
                                return (
                                    <tr key = {item.team_id}>
                                        <td><Logo url={item.logo_url}></Logo></td>
                                        <td>{item.name}</td>
                                        <td>{item.wins}</td>
                                        <td>{item.losses}</td>
                                        <td><img src={require('./star1.png')} alt="fav" width="30px" height="30px" onClick={()=>this.removeFav(item)}></img></td>
                                    </tr>
                                    )
                                
                                })}
                        </tbody>
                    </table>
                    {/* {this.state.currentPageTeams[0]["name"]} */}
                    <Page teamsOnOnePage={this.state.teamsOnOnePage} totalTeams={this.state.teams.length} display={this.displayCorrespondingTeams.bind(this)}></Page>
                </div>
            );
            }
            else{
                return(<div>No Favourite teams.Please add some!!</div>);
            }

        }
    }
}

export default Fav;