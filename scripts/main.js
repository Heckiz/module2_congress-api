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
let app = new Vue({
el: '#app',
data: {  
        //Arreglos de datos
         members:[],
         states:[],
         filter:[]
         
},
})

// Petición fetch
$(function(){
  fetch(url,api)
 .then(response=>response.json())
  .then (function(json) {
    app.members= json.results[0].members
    app.states= filterStates()
    app.filter= filterMembers()
  })
})

//Retornar states para dropdown
function filterStates() {
  let aux=[] 
  for(i=0;i<app.members.length;i++){
  if(aux.indexOf(app.members[i].state)==-1){
  aux.push(app.members[i].state);
  }
  }
      
      return aux;
  }

//Retornar segun filtros
function filterMembers(){
    let aux=[];
    let checked = Array.from(document.querySelectorAll("input[name=party]:checked")).map(x => x.value) // valores de los checkbox activos

    let selec = document.getElementById("states").value //valor de dropdown seleccionado

    aux = app.members.filter(function(member){
      return checked.indexOf(member.party)!=-1 && (selec==member.state||selec=="all")
    })
    return aux;
    }



//Filtrar en cada cambio de estado
document.getElementById("Democrat").onclick=function(){
app.filter = filterMembers();
}
document.getElementById("Republican").onclick=function(){
app.filter = filterMembers();
}
document.getElementById("Independent").onclick=function(){
app.filter = filterMembers();
}
document.getElementById("states").onchange=function(){
app.filter = filterMembers();
}

}

