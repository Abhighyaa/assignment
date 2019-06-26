import React from 'react';
import Logo from './Logo.js';
import Page from './Page.js';
import Star from './star.png';
import Star1 from './star1.png';
import {default as localforage} from 'localforage';

class Table extends React.Component {

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
            fav: Star
        };
        this.toggle = this.toggle.bind(this);
    }
    toggle=(item)=>{
        console.log(item)
        
        localforage.getItem(item.team_id).then(function(value) {
           console.log(value)
           if(value==null){
                let t = {
                    team_id : item.team_id,
                    logo_url : item.logo_url,
                    name : item.name,
                    wins : item.wins,
                    losses : item.losses
                }
                localforage.setItem(item.team_id,t).then(function(value){
                    console.log(item.team_id+' : '+value)
                    console.log("added to fav")
                    this.setState( {fav: Star1} );
                }).catch(function(err){
                    console.log('try later');
                })
           }
           else{
                localforage.removeItem(item.team_id).then(function() {
                    console.log('Removed from fav');
                    this.setState( {fav: Star} );
                }).catch(function(err) {
                    console.log('Try later');
                });
           }
        }).catch(function(err) {
            console.log("try later!")
            
        });
       
        
    }
    displayCorrespondingTeams(num) {
        // alert(num)
        this.setState({currentPage: num});
        
        // console.log(this.state.currentPage)
    }

    componentDidMount() {
        fetch('https://api.opendota.com/api/teams')
        .then(res => res.json())
        .then(
            (result) => {
                // console.log(typeof(result));
                this.setState({
                    teams: result,
                    loading : false
                });
            },
            (error) => {
                console.log(error);
            }
        )
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
        if(this.props.sortByValue=="wins"&&this.state.prev!="wins" ){
            let res=this.state.teams;
            res.sort(function(a,b){
                return parseInt(b.wins)  - parseInt(a.wins);
            }) 
            this.setState({teams:res})            
        }
        if(this.props.sortByValue=="name"&& this.state.prev!="name"){
            let res=this.state.teams;
            res.sort(function(a,b){
                return a.name.localeCompare(b.name)
            }) 
            this.setState({teams:res})            
        }
    }

    render(){
        if(this.state.loading===true)
            return(<div>Loading teams information...</div>)
        else{
            this.state.indexLast=this.state.currentPage*this.state.teamsOnOnePage;
            this.state.indexFirst=this.state.indexLast-this.state.teamsOnOnePage;
            this.state.currentPageTeams=this.state.teams.slice(this.state.indexFirst,this.state.indexLast);
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
                                        <td><img src={this.state.fav} onClick={()=> this.toggle(item)} width="30px" height="30px"></img></td>
                                    </tr>
                                    )
                                
                                })}
                        </tbody>
                    </table>
                    <Page teamsOnOnePage={this.state.teamsOnOnePage} totalTeams={this.state.teams.length} display={this.displayCorrespondingTeams.bind(this)}></Page>
                </div>
            );
        }
    }
}

export default Table;