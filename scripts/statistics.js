// API URL
let url;
if(document.getElementById("senatePage")||document.getElementById("housePage")){
    if(document.getElementById("senatePage")){
         url="https://api.propublica.org/congress/v1/113/senate/members.json"
    }
    if(document.getElementById("housePage")){
         url="https://api.propublica.org/congress/v1/113/house/members.json"
    }

// API KEY
let api={"headers":{
          "X-API-Key": "Sl0IF7oK5fgRa4fONIhKkaYtGNxfvFBIsKr6BEls" }};


//Vue Component        
var app = new Vue({
el: '#app',
data: {  members: [],
    cantDemocrats:0,
    cantRepublican:0,
    cantIndependent:0,
    cantTotal:0,
    votesDemocrats:0,
    votesRepublican:0,
    votesIndependent:0,
    votesTotal:0,
    leastEngaged:[],
    mostEngaged:[],
    leastLoyal:[],
    mostLoyal:[]
        
},
})

// Petición fetch
$(function(){
    fetch(url,api)
   .then(response=>response.json())
    .then (function(json) {
      app.members= json.results[0].members
      coutMembers()
      countVotes()
      restTable()
    })
  })

//Contar miembros de cada partido 
  function coutMembers(){
    app.cantDemocrats = app.members.filter(function(member){return member.party=="D"})
    app.cantRepublican = app.members.filter(function(member){return member.party=="R"})
    app.cantIndependent= app.members.filter(function(member){return member.party=="I"})
    app.cantTotal= app.cantDemocrats.length+app.cantRepublican.length+app.cantIndependent.length;
  }

  //Contar votos 
  function countVotes() {  
      let aux_D=0, aux_R=0, aux_I=0;
    for(i=0;i<app.cantDemocrats.length;i++){aux_D+=app.cantDemocrats[i].votes_with_party_pct}
    for(i=0;i<app.cantRepublican.length;i++){aux_R+=app.cantRepublican[i].votes_with_party_pct}
    for(i=0;i<app.cantIndependent.length;i++){aux_I+=app.cantIndependent[i].votes_with_party_pct}
    if(aux_D!=0){app.votesDemocrats= Math.round(aux_D/app.cantDemocrats.length)}
    if(aux_R!=0){app.votesRepublican= Math.round(aux_R/app.cantRepublican.length)} 
    if(aux_I!=0){app.votesIndependent= Math.round(aux_I/app.cantIndependent.length)}
    app.votesTotal= Math.round((app.votesDemocrats+app.votesRepublican+app.votesIndependent)/3)
  }


  //Contar Loyal && Engaded members
  function restTable(){
    let limit=Math.round(10*app.cantTotal/100); //10% de los miembros
    let LeastLoyal=[],MostLoyal=[],LeastEngaged=[],MostEngaged=[];//En cada array se guardan las posiciones donde se encuentran los miembros

    for(j=0;j<limit;j++){

        let minLoyal  = 100, maxLoyal  = 0, minEngaged= 100, maxEngaged= 0;
        let posMinLoyal,posMaxLoyal,posMinEngaged,posMaxEngaged;

    for(i=0;i<app.members.length;i++){
      //LEAST LOYAL
        if(app.members[i].votes_with_party_pct<=minLoyal&&LeastLoyal.indexOf(i)==-1){
            minLoyal= app.members[i].votes_with_party_pct;
            posMinLoyal=i;
        }
      //MOST LOYAL
        if(app.members[i].votes_with_party_pct>=maxLoyal&&MostLoyal.indexOf(i)==-1){
            maxLoyal = app.members[i].votes_with_party_pct;
            posMaxLoyal=i;
        }
      //LEAST ENGAGED
        if(app.members[i].missed_votes_pct>=maxEngaged&&LeastEngaged.indexOf(i)==-1){
                maxEngaged = app.members[i].missed_votes_pct;
                posMaxEngaged=i;
            }
      //MOST ENGAGES
        if(app.members[i].missed_votes_pct<=minEngaged&&MostEngaged.indexOf(i)==-1){
                minEngaged = app.members[i].missed_votes_pct;
                posMinEngaged=i;
            }
        }

        LeastLoyal.push(posMinLoyal);
        app.leastLoyal.push(app.members[posMinLoyal]);
    
        MostLoyal.push(posMaxLoyal);
        app.mostLoyal.push(app.members[posMaxLoyal]);
    
        LeastEngaged.push(posMaxEngaged);
        app.leastEngaged.push(app.members[posMaxEngaged]);

       MostEngaged.push(posMinEngaged);
        app.mostEngaged.push(app.members[posMinEngaged]);

    }
    }
}