//VARIABLE and OBJECTS decleration
var srcURL;
var cssCode=""
var Game={
  playing:false,
  moves:0,
  Time:{
    start:0,
    diff:0,
  },
  Len:4,
  src:"img.jpg",
  size:0,
  intervalId:"",
  pixel:610,
  imgpixel:610,
  imgSize:0,
  shuffled:false,
}
//mediaqueries
if(screen.width<770){
  Game.pixel=500
}
if(screen.width<550){
  Game.pixel=400
}
if(screen.width<440){
  Game.pixel=300
}
if(screen.width<340){
  Game.pixel=220
}


//code

function StartGame() {
  document.getElementById('content').innerHTML=""
  var img =new Image();
img.src = Game.src
Game.imgSize=img.height
Game.size=Game.pixel/Game.Len
Game.imgSize=Game.imgpixel/Game.Len
srcURL=[]
insertCss(`.content{
  display: grid;
  grid-template-columns: repeat(${Game.Len},auto);
  grid-template-rows: repeat(${Game.Len},auto);
  border: 5px solid rgb(124, 124, 124);
  margin: 1rem;
}`)
insertCss(`.puzzleContainer{
  height: ${Game.size*Game.Len+10}px;
  width: ${Game.pixel+10}px
}`)
img.onload =function (){
    for (let i = 0; i < Game.Len; i++) {
        for (let j = 0; j < Game.Len; j++) {
            let canvas =document.getElementById("canvas")
            let ctx = canvas.getContext("2d")
            canvas.height=Game.imgSize
            canvas.width=Game.imgSize
            canvas.clientHeight=Game.imgSize;
            canvas.clientWidth=Game.imgSize;
            ctx.drawImage(img,Game.imgSize*j,Game.imgSize*i,Game.imgSize,Game.imgSize,0,0,Game.size,Game.size)
            document.getElementById("myImageElementInTheDom").src= canvas.toDataURL()
            srcURL.push({"src":canvas.toDataURL(),'id':`IMG${i}${j}`,"row":`${j}`,"col":`${i}`})
        }
    }
    console.log('equal', srcURL[0]==srcURL[1])
   
    afteronload()
}
clearInterval(Game.intervalId)
Game.moves=0;
Game.Time.start=0;
Game.Time.diff=0;
Game.shuffled=false;
let timer= document.getElementById("time")
timer.innerHTML=`<strong>Time elapsed: 0 seconds</strong>`
let moves = document.getElementById("moves")
  moves.innerHTML=`<strong>Moves: 0 </strong>`
  document.getElementById("content").style.pointerEvents="auto"
setTimeout(shuffle,100)
window.addEventListener("keydown", keypress)
}
function afteronload() {
  for (let index = 0; index < srcURL.length-1; index++) {
    const element = srcURL[index];
    var img = document.createElement('img');
            img.setAttribute("id",element.id)
            img.setAttribute("class",`tile${index}`)
            img.classList.add("puzzle")
            img.height=Game.size
            img.width=Game.size
            document.getElementById('content').appendChild(img);
            document.getElementById('content').addEventListener("click",clickTile);
            cssCode=cssCode+`\n #IMG${element.col}${element.row}{
              grid-row: ${eval(parseInt(element.col)+1)};
            grid-column: ${eval(parseInt(element.row)+1)};
            }
            .tile${index}{
              background-image: url(${element.src});
            }`
    }
    var img = document.createElement('img');
            img.setAttribute("id","IMG"+eval(Game.Len-1)+eval(Game.Len-1))
            img.className="tile"+eval(srcURL.length-1)
            img.height=Game.size
            img.width=Game.size
            img.classList.add("puzzle")
            document.getElementById('content').appendChild(img)
            cssCode=cssCode+`\n .tile${eval(srcURL.length-1)}{
            background-image: none;
            }`
            insertCss(cssCode)
}
function swapTiles(IMG1,IMG2) {
  var temp = document.getElementById(IMG1).className;
  document.getElementById(IMG1).className = document.getElementById(IMG2).className;
  document.getElementById(IMG2).className = temp;
  if(Game.shuffled){
    Game.moves++
  if(Game.moves==1){
    Game.Time.start= new Date()
    Game.playing=true
    UpdateTime()
  }
  }
  let moves = document.getElementById("moves")
  moves.innerHTML=`<strong>Moves: ${Game.moves}</strong>`
  DOWIN()
}

function shuffle() {
for (var row=0;row<=Game.Len-1;row++) { 
   for (var column=0;column<=Game.Len-1;column++) { 
  
    var row2=Math.floor(Math.random()*(Game.Len-1) + 1); 
    var column2=Math.floor(Math.random()*(Game.Len-1) + 1); 
     console.log('"IMG"+row+column', "IMG"+row+column)
    swapTiles("IMG"+row+column,"IMG"+row2+column2); 
  } 
} 
Game.shuffled=true
}
function DOWIN() {
  const childr = document.getElementsByClassName("puzzle")
  for (let index = 0; index < srcURL.length; index++) {
    if(childr[index].classList[0]=="tile"+index){
      Game.playing=false;
    }else{
      return false
    }
    
  }
  if(Game.playing==false){
    clearInterval(Game.intervalId)
    Alert(`you completed the GAME in <strong> ${Game.moves} moves</strong> and in <strong>${Math.ceil( Game.Time.diff/1000)} seconds</strong>`,`Start New Game to play again`,"Congratulations!!","success")
    document.getElementById("content").style.pointerEvents="none"
    LeaderBoard(Game.moves,Math.ceil( Game.Time.diff/1000))
    let leaderBoard = localStorage.getItem("leaderBoard")
    if(leaderBoard){
      leaderBoard = JSON.parse(leaderBoard)
      leaderBoard.push({"Moves":Game.moves,"Time":Math.ceil( Game.Time.diff/1000)})
      localStorage.setItem("leaderBoard",JSON.stringify(leaderBoard))
    }else{
      leaderBoard=[]
      leaderBoard.push({"Moves":Game.moves,"Time":Math.ceil( Game.Time.diff/1000)})
      localStorage.setItem("leaderBoard",JSON.stringify(leaderBoard))

    }
    return true
  }
}
function clickTile(event) {//eventlistner
  var IMg = event.target
  var ID= event.target.id
  var row=ID.slice(3,4)
  row = parseInt(row)
  var column=ID.slice(4,5)
  column = parseInt(column)
  console.log('row', row)
  console.log('column', column)
  var tile = IMg.className;
  if (tile!=`tile${(Game.Len*Game.Len)-1}`) { 
       for (let i = 0; i < Game.Len; i++) {
        const element = document.getElementById(`IMG${row}${i}`);
        if(element.classList.contains(`tile${(Game.Len*Game.Len)-1}`)){
          if(column>i){
            for (let j = i; j < column; j++) {
              swapTiles(`IMG${row}${j}`,`IMG${row}${j+1}`)              
            }
          }
          if(column<i){
            for (let j = i; j > column; j--) {
              swapTiles(`IMG${row}${j}`,`IMG${row}${j-1}`)              
            }
          }
        } 
       }      
       for (let i = 0; i < Game.Len; i++) {
        const element = document.getElementById(`IMG${i}${column}`);
        if(element.classList.contains(`tile${(Game.Len*Game.Len)-1}`)){
          if(row>i){
            for (let j = i; j < row; j++) {
              swapTiles(`IMG${j}${column}`,`IMG${j+1}${column}`)              
            }
          }
          if(row<i){
            for (let j = i; j > row; j--) {
              swapTiles(`IMG${j}${column}`,`IMG${j-1}${column}`)              
            }
          }
        } 
       }
  }
  
}

function insertCss( code ) {//function for giving new css
  var style=document.createElement('style');
style.type='text/css';
if(style.styleSheet){
    style.styleSheet.cssText=code;
}else{
    style.appendChild(document.createTextNode(code));
}
console.log(style )
document.getElementsByTagName('head')[0].appendChild(style);
cssCode=""
}

function newTime() {//time function
  let timer= document.getElementById("time")
  let newtime=new Date()
  var diff=(newtime)-(Game.Time.start)
  Game.Time.diff=diff
  timer.innerHTML=`<strong>Time elapsed: ${Math.ceil( diff/1000)} seconds</strong>`

}
function Alert(msg,msg2,msgHead,type) {//alertting the user
  let text =` <div class="m-1 alert alert-${type} alert-dismissible fade show position-absolute start-0 end-0 mx-1" style="z-index: 2;" role="alert">
  <h4 class="alert-heading">${msgHead}</h4>
<p>${msg}</p>
<hr>
<p class="mb-0">${msg2}</p>
<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>

  
</div>`
let alerElement = document.getElementById("alert")
alerElement.innerHTML=text
}
let sliderform= document.getElementById("customRange3")
sliderform.addEventListener("input",changerange)
function changerange(event) {
  let sliderform = document.getElementById("inputnumber")
  sliderform.innerHTML=event.target.value
}
function UpdateTime() {//for updating time every second
  Game.intervalId=setInterval(() => {
    newTime()
  }, 1000);
}
function submit(event) {
  event.preventDefault()
  let slider= document.getElementById("customRange3")
  const sliderValue = slider.value;
  Game.Len=sliderValue
  let imageForm = document.getElementsByName("imgselection")
  for (let index = 0; index < imageForm.length; index++) {
    const element = imageForm[index];
    if(element.checked){
    Game.src =element.nextElementSibling.childNodes[0].getAttribute("src")
    }
  }
StartGame()

}
function keypress(event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  let blank = document.getElementsByClassName(`tile${(Game.Len*Game.Len)-1}`)
      const  id  = blank[0].id
      let column = id.slice(4,5)
      column=parseInt(column)
      let row =id.slice(3,4)
      row=parseInt(row)
  switch (event.key) {//decleraing function in each case
    case "ArrowDown":
      if (row-1>-1) {
        swapTiles(id,"IMG"+(row-1)+column)
      }
      break;
    case "ArrowUp":
      if(row+1<Game.Len){
        swapTiles(id,"IMG"+(row+1)+column)
      }
      break;
    case "ArrowLeft":
      if(column+1<Game.Len){
        swapTiles(id,"IMG"+(row)+(column+1))
      }
      break;
    case "ArrowRight":
      if(column-1>-1){
        swapTiles(id,"IMG"+(row)+(column-1))
      }
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }
  event.preventDefault()
};
function closeLeaderBoard() {
  document.getElementById("startmenu").remove()
}
function LeaderBoard(Moves, time) {//generating the table
  document.getElementById("leaderBoard").innerHTML+=`<div class="startmenu" id="startmenu">
  <div class="container alert alert-success alert-dismissible fade show" id="formelement1" style="padding: 2rem;">
          <h1 class="text-center">Start Menu</h1>
          <hr>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"
            onclick="closeLeaderBoard()"></button>
          <table class="table table-bordered table-hover">
            <thead class="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Moves</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody id="leaderbody">
            <tr class="table-primary">
            <th scope="col">${0}</th>
            <th scope="col">${Moves}</th>
            <th scope="col">${time}</th>
          </tr>
            </tbody>
          </table>
        </div>
// </div>`
let list =localStorage.getItem("leaderBoard")
list=JSON.parse(list)
if(list){//generating rows for data
  for (let index = 0; index < (Math.min(8,list.length)); index++) {
    let element = list[index];
    console.log('element', element)
    var x=document.getElementById('leaderbody').insertRow(1);
  var y = x.insertCell(0);
  var z = x.insertCell(1);
  var a = x.insertCell(1);
  y.innerHTML=`${Math.min(list.length,8)-index}`;
  z.innerHTML=`${element.Moves}`;
  a.innerHTML=`${element.Time}`
  };
}
}
StartGame()//starting the game on opening the site
