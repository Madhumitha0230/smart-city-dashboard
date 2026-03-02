// ================= CARD FOCUS =================
function focusCard(card){
document.querySelectorAll(".card").forEach(c=>c.style.zIndex=1);
card.style.zIndex=10;
}

// ================= PASSWORD TOGGLE =================
function togglePassword(){
let p=document.getElementById("password");
if(p){
p.type = p.type === "password" ? "text" : "password";
}
}

// ================= MAP (RUN ONLY IF EXISTS) =================
if(document.getElementById("map")){
let map=L.map('map').setView([13.0827,80.2707],12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

// ================= TRAFFIC CHART =================
let chart;

if(document.getElementById("chart")){
let ctx=document.getElementById("chart").getContext("2d");
chart=new Chart(ctx,{
type:'line',
data:{
labels:[],
datasets:[{
label:"Traffic Load %",
data:[],
borderColor:"cyan",
fill:false
}]
}
});
}

// ================= LIVE SIMULATION =================
if(document.getElementById("traffic")){

setInterval(()=>{

let traffic=Math.floor(Math.random()*90);
let solar=Math.floor(Math.random()*500+300);
let carbon=Math.floor(Math.random()*60);
let aqi=Math.floor(Math.random()*200);

document.getElementById("traffic").innerText=traffic;
document.getElementById("solar").innerText=solar;
document.getElementById("carbon").innerText=carbon;
document.getElementById("esg").innerText=100-carbon;

document.getElementById("trafficStatus").innerText=
traffic>75?"High Congestion":"Optimal Flow";

let risk="No Alerts";
if(aqi>150) risk="⚠ Air Pollution Critical";
if(traffic>85) risk="🚦 Severe Traffic Alert";

document.getElementById("riskAlert").innerText=risk;

updateChart(traffic);

let performanceEl=document.getElementById("performance");
if(performanceEl){
performanceEl.innerText =
Math.floor((solar + (100-carbon))/10);
}

},3000);

}

// ================= UPDATE CHART =================
function updateChart(val){
if(!chart) return;

if(chart.data.labels.length>10){
chart.data.labels.shift();
chart.data.datasets[0].data.shift();
}

chart.data.labels.push("T"+chart.data.labels.length);
chart.data.datasets[0].data.push(val);
chart.update();
}

// ================= OPTIMIZE TRAFFIC =================
function optimizeTraffic(event){
if(event) event.stopPropagation();
let v=Math.floor(Math.random()*40+20);
document.getElementById("traffic").innerText=v;
updateChart(v);
}

// ================= LOGIN =================
async function login(){

let username=document.getElementById("username").value;
let password=document.getElementById("password").value;

let res=await fetch("/api/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username,password})
});

let data=await res.json();

if(data.success){
window.location.href="index.html";
}else{
let error=document.getElementById("error");
if(error){
error.innerText="Invalid Credentials";
}
}

}

// ================= COMPLAINTS =================
async function loadComplaints(){
let res=await fetch("/api/complaints");
let data=await res.json();

let list=document.getElementById("complaintList");
if(!list) return;

list.innerHTML="";

data.forEach((c,i)=>{
list.innerHTML+=`<div>${c.text} - ${c.status}
<button onclick="updateStatus(${i})">Next</button></div>`;
});

calculateEfficiency(data);

let active=document.getElementById("activeComplaints");
if(active){
active.innerText=data.length;
}
}

async function addComplaint(){
let text=document.getElementById("complaintInput").value;

await fetch("/api/complaints",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({text})
});

loadComplaints();
}

async function updateStatus(id){
await fetch("/api/complaints/"+id,{method:"PUT"});
loadComplaints();
}

function calculateEfficiency(data){
let resolved=data.filter(c=>c.status==="Resolved").length;
let score=data.length===0?100:Math.floor((resolved/data.length)*100);

let eff=document.getElementById("efficiency");
if(eff){
eff.innerText=score;
}
}

// ================= AI ASSISTANT =================
function chat(){

let input=document.getElementById("chatInput");
let chat=document.getElementById("chatbox");

if(!input || !chat) return;

let msg=input.value.toLowerCase();

chat.innerHTML+=`<div>👤 ${msg}</div>`;

let traffic=document.getElementById("traffic")?.innerText || "unknown";
let solar=document.getElementById("solar")?.innerText || "unknown";
let esg=document.getElementById("esg")?.innerText || "unknown";
let risk=document.getElementById("riskAlert")?.innerText || "No Alerts";

let reply="I am monitoring all systems.";

if(msg.includes("traffic"))
reply=`Current traffic load is ${traffic}%.`;

else if(msg.includes("energy")||msg.includes("solar"))
reply=`Solar output is ${solar} kW with ESG score ${esg}.`;

else if(msg.includes("risk"))
reply=risk;

chat.innerHTML+=`<div>🤖 ${reply}</div>`;

input.value="";
}