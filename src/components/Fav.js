import React from 'react';
import Logo from './Logo.js';
import Page from './Page.js';
import Star1 from './star1.png';
import {default as localforage} from 'localforage';

class Fav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            favTeams: [],
            loading : true,
            currentPage : 1,
            currentPageTeams : [],
            teamsOnOnePage : 15,
            indexFirst : 0  ,
            indexLast:0,
            prev:null,
            prevShowAll:null,
        };
        this.removeFav = this.removeFav.bind(this);
    }
    removeFav=(team)=>{
        //remove from fav
        localforage.removeItem(team.team_id).then(function() {
            console.log('Removed from fav');
        }).catch(function(err) {
            console.log('Try later');
        });
        this.componentDidMount();
    }
    displayCorrespondingTeams(num) {
        this.setState({currentPage: num});
    }

    componentDidMount() {
        var result=[];
        localforage.iterate(function(value, key, iterationNumber) {
            //determine all teams stored in index db
            result.push(JSON.parse(JSON.stringify(value)));
        }).then(() => {
            this.setState({
                favTeams: result,
                loading : false
            });
        }).catch(function(err) {
            console.log(err);
        });
        // if(this.props.selectValue)
    }
    // to present sorted order when switching from one all to fav tab or vice versa
    static getDerivedStateFromProps(props, state) {
        if(props.sortByValue=="wins"){
            let res=state.favTeams;
            res.sort(function(a,b){
                return parseInt(b.wins)  - parseInt(a.wins);
            }) 
            return {favTeams:res}            
        }
        if(props.sortByValue=="name"){
            let res=state.favTeams;
            res.sort(function(a,b){
                return a.name.localeCompare(b.name)
            }) 
            return {favTeams:res}           
        }
    }
    //to prevent infinite loop caused by sorting by name or wins 
    getSnapshotBeforeUpdate(prevProps, prevState) {
        this.state.prev=prevProps.sortByValue;
        this.state.prevShowAll=prevProps.showAll;
    }
    //determine whether to sort by name or wins
    componentDidUpdate(){
            if(this.props.sortByValue=="wins"&& this.state.prev!="wins"){
                let res=this.state.favTeams;
                res.sort(function(a,b){
                    return parseInt(b.wins)  - parseInt(a.wins);
                }) 
                this.setState({favTeams:res})            
            }
            if(this.props.sortByValue=="name"&& this.state.prev!="name" ){
                let res=this.state.favTeams;
                res.sort(function(a,b){
                    return a.name.localeCompare(b.name)
                }) 
                this.setState({favTeams:res})            
            }
    }

    render(){
        if(this.state.loading===true)
            return(<div>Loading Fav teams information...</div>)
        else{
            
            this.state.indexLast=this.state.currentPage*this.state.teamsOnOnePage;
            this.state.indexFirst=this.state.indexLast-this.state.teamsOnOnePage;
            this.state.currentPageTeams=this.state.favTeams.slice(this.state.indexFirst,this.state.indexLast);
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
                            
                            {this.state.currentPageTeams.map((team,key) =>{
             
                                return (
                                    <tr key = {team.team_id}>
                                        <td><Logo url={team.logo_url}></Logo></td>
                                        <td>{team.name}</td>
                                        <td>{team.wins}</td>
                                        <td>{team.losses}</td>
                                        <td><img src={require('./star1.png')} alt="fav" width="30px" height="30px" onClick={()=>this.removeFav(team)}></img></td>
                                    </tr>
                                    )
                                
                                })}
                        </tbody>
                    </table>
                    {/* {this.state.currentPageTeams[0]["name"]} */}
                    <Page teamsOnOnePage={this.state.teamsOnOnePage} totalTeams={this.state.favTeams.length} display={this.displayCorrespondingTeams.bind(this)}></Page>
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