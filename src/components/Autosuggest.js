import React from 'react';
import Star from './star.png';
import Logo from './Logo.js';
import {default as localforage} from 'localforage';
class Autosuggest extends React.Component {
    //create an autosuggest input search from all Teams in api
    constructor(props){
        super(props);
        this.state={
            suggestionsList:[],
            suggestedTeams:[],
            value:'',
            loading : true,
        }
        this.toggle = this.toggle.bind(this);
        this.betterFun=this.betterFun.bind(this);
    }
    componentDidMount() {
        //fetch list of all teams
        fetch('https://api.opendota.com/api/teams')
        .then(res => res.json())
        .then(
            (result) => {
                // console.log(typeof(result));
                this.setState({
                    suggestionsList: result,
                });
            },
            (error) => {
                console.log(error);
            }
        )
    }
    search(){
        //if input is found to be 0 at any moment, immediately stop autosuggest
        if(this.state.value.length===0) 
            this.setState({suggestedTeams:[]})
        else{
            //find suggested teams matching to the input value regular expression
            let suggestions=[];
            let suggestionsList=[];
            const regex = new RegExp(`^${this.state.value}`,'i');
            suggestionsList=this.state.suggestionsList.sort(function(a,b){
                return a.name.localeCompare(b.name)
            });
            suggestions=suggestionsList.filter(v=>regex.test(v.name));
            this.setState({suggestedTeams:suggestions});
        }
    }
    callSearch=(fn,d)=>{
        // delay calling search function
        let timer,args;
        return () =>{
            let context = this;
            args=this.arguments;
            clearTimeout(timer);
            timer = setTimeout(()=>{
                {this.search.apply(context,this.arguments)}
            },d)
        }
    }
    //a function better than regular search -> creating suggestions after each input change
    betterFun =this.callSearch(this.search,300);  
    handleChange = (e) => {
        this.setState({value:e.target.value})
        this.betterFun();
    }
    toggle=(team)=>{
        localforage.getItem(team.team_id).then(function(value) {
            // determine whether the team is present in index DB favorites
            if(value==null){
                //if not then add to fav and store in IndexDB
                let t = {
                    team_id : team.team_id,
                    logo_url : team.logo_url,
                    name : team.name,
                    wins : team.wins,
                    losses : team.losses
                }
                localforage.setItem(team.team_id,t).then(function(value){
                    console.log(team.team_id+' : '+value)
                    alert("added to fav")
                }).catch(function(err){
                    console.log('try later');
                })
            }
            else{
                // if already added remove from indexDb
                localforage.removeItem(team.team_id).then(function() {
                    alert('Removed from fav');
                }).catch(function(err) {
                    console.log('Try later');
                });
            }
        }).catch(function(err) {
            console.log("try later!")
        }); 
    }
    render(){
        return(
            <div className="autosuggest">
                <input type="text"  onChange={this.handleChange}></input>
                <div style={this.state.suggestedTeams.length>0 ? {} : {display: 'none'}}>
                    Searched Results are :
                    
                    <table className="table">
                        <tbody>
                            <tr>
                                <th>Logo</th>
                                <th>Name</th>
                                <th>Wins</th>
                                <th>Losses</th>
                                <th>Favourite</th>
                            </tr>
                            {this.state.suggestedTeams.map((team,key) =>{
             
                                return (
                                    <tr key = {team.team_id}>
                                        <td><Logo url={team.logo_url}></Logo></td>
                                        <td>{team.name}</td>
                                        <td>{team.wins}</td>
                                        <td>{team.losses}</td>
                                        <td><img src={Star} onClick={()=> this.toggle(team)} width="30px" height="30px"></img></td>
                                    </tr>
                                    )
                                
                                })}
                        </tbody>
                    </table>
                    All Teams :
                </div>
                
            </div>
        );
    }
}

export default Autosuggest;