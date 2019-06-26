import React from 'react';

const Page = ({teamsOnOnePage,totalTeams,display})=> {
     const pageNumbers=[];
        //no of pages and insert in array
        for(let i=1;i<=Math.ceil(totalTeams/teamsOnOnePage);i++){
            pageNumbers.push(i);
        }
      
        return(
            <div>

                <ul className="page">
                    {pageNumbers.map(number=>(
                        <li key={number}>
                            <a onClick={()=> display(number)}>{number}</a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    
}

export default Page;