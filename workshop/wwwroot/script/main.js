"user strict"

let divHeader = null;
let divContent = null;
let divFooter = null;

document.addEventListener("DOMContentLoaded", domLoaded);


function domLoaded(){
  //localStorage.clear();
  divContent = document.getElementById("divContent");
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if(userInfo && userInfo.fdUserID){
    
  }else{
    loadTemplate("tlLogin", divContent, true);
  }



}

function loginUser(){
  const domLoginEMail = document.getElementById("domLoginEMail");
  const domLoginPassword  = document.getElementById("domLoginPassword");
  const data = {
    userEMail: domLoginEMail.value,
    userPassword: domLoginPassword.value
  };
  const server = new ServerFetch("POST", "/login", data);
  server.fetchData((res) => {
  
    console.log(res.data);
    localStorage.setItem('userInfo', JSON.stringify(res.data));
  },
  error => {console.log(error)});

  return false;
}


