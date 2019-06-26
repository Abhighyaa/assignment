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
            teamsOnOnePage : 15,
            indexFirst : 0  ,
            indexLast:0,
            prev:null,
            prevShowAll:null,
            fav:false
        };
        this.toggle = this.toggle.bind(this);
    }
    // Tried to toggle star icon but faced issues of lifecycle hooks as unable to set state
    // isFav=(team)=>{
    //     localforage.getItem(team.team_id).then(function(value) {
    //         if(value==null){
    //             this.setState({fav:false})
    //              addFav(team)}   
    //         else
    //             this.setState({fav:false})
    //              remFav(team)}
    //     }).catch(function(err) {
    //         console.log("try later!")
    //     });
    // }
    // addFav=(team)=>{
    //     let t = {
    //         team_id : team.team_id,
    //         logo_url : team.logo_url,
    //         name : team.name,
    //         wins : team.wins,
    //         losses : team.losses
    //     }
    //     localforage.setItem(team.team_id,t).then(function(value){
    //         console.log(team.team_id+' : '+value)
    //         console.log("added to fav")
    //     }).catch(function(err){
    //         console.log('try later');
    //     })
    // }
    // remFav(team){
    //     localforage.removeItem(team.team_id).then(function() {
    //         console.log('Removed from fav');
    //     }).catch(function(err) {
    //         console.log('Try later');
    //     });
    // }
    toggle=(team)=>{
        // Tried to toggle star icon but faced issues
        // this.isFav(team)
        // console.log(this.state.fav)
        // if(this.state.fav)
        //     this.remFav(team);
        // else    
        //     this.addFav(team);
        localforage.getItem(team.team_id).then(function(value) {
            //determine if it is present in fav
            if(value==null){
                //add to fav if not present
                let t = {
                    team_id : team.team_id,
                    logo_url : team.logo_url,
                    name : team.name,
                    wins : team.wins,
                    losses : team.losses
                }
                localforage.setItem(team.team_id,t).then(function(value){
                    alert(team.name+"added to fav")
                }).catch(function(err){
                    console.log('try later');
                })
            }
            else{
                //remove from fav if already present
                localforage.removeItem(team.team_id).then(function() {
                    alert(team.name+'Removed from fav');
                }).catch(function(err) {
                    console.log('Try later');
                });
            }
        }).catch(function(err) {
            console.log("try later!")
        }); 
    }
    displayCorrespondingTeams(num) {
        this.setState({currentPage: num});
    }
    componentDidMount() {
        //fetch list of all teams 
        fetch('https://api.opendota.com/api/teams')
        .then(res => res.json())
        .then(
            (result) => {
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
    // to present sorted order when switching from one all to fav tab or vice versa
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
    //to prevent infinite loop caused by sorting by name or wins 
    getSnapshotBeforeUpdate(prevProps, prevState) {
        this.state.prev=prevProps.sortByValue;
        this.state.prevShowAll=prevProps.showAll;
    }
    //determine whether to sort by name or wins
    componentDidUpdate(){
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
        if(this.state.loading===true) // allow rest page to render without waiting for this part
            return(<div>Loading teams information...</div>)
        else{
            //determine the teams on current page for pagination
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
                            {this.state.currentPageTeams.map((team,key) =>{
             
                                return (
                                    <tr key = {team.team_id}>
                                        <td><Logo url={team.logo_url}></Logo></td>
                                        <td>{team.name}</td>
                                        <td>{team.wins}</td>
                                        <td>{team.losses}</td>
                                        <td><img src={Star} onClick={()=> this.toggle(team)} width="30px" height="30px"></img></td>
                                        {/* tried toggling the icon
                                            {  this.isFav(team)?                                            
                                            <td><img src={Star} onClick={()=> this.addFav(team)} width="30px" height="30px"></img></td>
                                            :
                                            <td><img src={Star1} onClick={()=> this.remFav(team)} width="30px" height="30px"></img></td>
                                        } */}
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