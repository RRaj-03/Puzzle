var cssCode=""
var Game={
  playing:false,
  moves:0,
  Time:{
    start:0,
    end:0,
  },
  Len:0,
  src:""
}
var img =new Image();
img.src = "img.jpg"

let srcURL=[]
const Len=3
const size=630/Len
insertCss(`.content{
  display: grid;
  grid-template-columns: repeat(${Len},auto);
  grid-template-rows: repeat(${Len},auto);
  border: 5px solid rgb(124, 124, 124);
  margin: 1rem;
}`)

img.onload =function (){
    for (let i = 0; i < Len; i++) {
        for (let j = 0; j < Len; j++) {
            let canvas =document.getElementById("canvas")
            let ctx = canvas.getContext("2d")
            canvas.height=size
            canvas.width=size
            canvas.clientHeight=size;
            canvas.clientWidth=size;
            ctx.drawImage(img,size*j,size*i,size,size,0,0,size,size)
            document.getElementById("myImageElementInTheDom").src= canvas.toDataURL()
            srcURL.push({"src":canvas.toDataURL(),'id':`IMG${i}${j}`,"row":`${j}`,"col":`${i}`})
        }
    }
    console.log('equal', srcURL[0]==srcURL[1])
   
    afteronload()
}
function afteronload() {
    for (let index = 0; index < srcURL.length-1; index++) {
        const element = srcURL[index];
        var img = document.createElement('img');
            img.setAttribute("id",element.id)
            img.setAttribute("class",`tile${index}`)
            img.classList.add("puzzle")
            img.height=size
            img.width=size
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
            img.setAttribute("id","IMG"+eval(Len-1)+eval(Len-1))
            img.className="tile"+eval(srcURL.length-1)
            img.height=size
            img.width=size
            img.classList.add("puzzle")
            document.getElementById('content').appendChild(img)
            cssCode=cssCode+`\n .tile${eval(srcURL.length-1)}{
              grid-row: ${eval(Len)};
            grid-column: ${eval(Len)};
            }`
            insertCss(cssCode)
}


//outside
function swapTiles(IMG1,IMG2) {
  var temp = document.getElementById(IMG1).className;
  document.getElementById(IMG1).className = document.getElementById(IMG2).className;
  document.getElementById(IMG2).className = temp;
  if(Game.moves==0){
    Game.Time.start= new Date()
    Game.playing=true
    UpdateTime()
  }
  Game.moves++
  let moves = document.getElementById("moves")
  moves.innerHTML=`<strong>Moves: ${Game.moves}</strong>`
  DOWIN()
}

function shuffle() {
//Use nested loops to access each IMG of the 3x3 grid
for (var row=0;row<=Len-1;row++) { //For each row of the 3x3 grid
   for (var column=0;column<=Len-1;column++) { //For each column in this row
  
    var row2=Math.floor(Math.random()*(Len-1) + 1); //Pick a random row from 1 to 3
    var column2=Math.floor(Math.random()*(Len-1) + 1); //Pick a random column from 1 to 3
     console.log('"IMG"+row+column', "IMG"+row+column)
    swapTiles("IMG"+row+column,"IMG"+row2+column2); //Swap the look & feel of both IMGs
  } 
} 
let moves = document.getElementById("moves")
  moves.innerHTML=`<strong>Moves: ${Game.moves}</strong>`
}
function DOWIN() {
  const childr = document.getElementsByClassName("puzzle")
  for (let index = 0; index < srcURL.length; index++) {
    if(childr[index].classList[0]=="tile"+index){
      Game.playing=false;
      Game.Time.end=new Date()
      var diff=(Game.Time.end)-(Game.Time.start)
    }else{
      return false
    }
    
  }
  if(Game.playing==false){
    alert(`you completed the GAME in ${Game.moves} moves and in ${Math.ceil( diff/1000)} seconds`)
    return true
  }
}
function clickTile(event) {
  var IMg = event.target
  var ID= event.target.id
  var row=ID.slice(3,4)
  row = parseInt(row)
  var column=ID.slice(4,5)
  column = parseInt(column)
  console.log('row', row)
  console.log('column', column)
  var tile = IMg.className;
  if (tile!=`tile${(Len*Len)-1}`) { 
       //Checking if white tile on the right
       if (column<Len-1) {
        if ( document.getElementById("IMG"+row+(column+1)).classList[0]==`tile${(Len*Len)-1}`) {
          console.log('hell')
          swapTiles("IMG"+row+column,"IMG"+row+(column+1));
          return;
        }
       }
       //Checking if white tile on the left
       if (column>0) {

         if ( document.getElementById("IMG"+row+(column-1)).classList[0]==`tile${(Len*Len)-1}`) {
          console.log('hell')
           
          swapTiles("IMG"+row+column,"IMG"+row+(column-1));
           return;
         }
       }
         //Checking if white tile is above
       if (row>0) {

         if ( document.getElementById("IMG"+(row-1)+column).classList[0]==`tile${(Len*Len)-1}`) {
          console.log('hell')
          
          swapTiles("IMG"+row+column,"IMG"+(row-1)+column);
           return;
         }
       }
       //Checking if white tile is below
       if (row<Len-1) {

         if ( document.getElementById("IMG"+(row+1)+column).classList[0]==`tile${(Len*Len)-1}`) {
          console.log('hell')
           swapTiles("IMG"+row+column,"IMG"+(row+1)+column);
           return;
         }
       } 
  }
  
}

function insertCss( code ) {
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
// setTimeout(() => {
//   shuffle()
// }, 1000);
function newTime() {
  let timer= document.getElementById("time")
  let newtime=new Date()
  var diff=(newtime)-(Game.Time.start)
  timer.innerHTML=`<strong>Time elapsed: ${Math.ceil( diff/1000)} seconds</strong>`

}
let sliderform= document.getElementById("customRange3")
sliderform.addEventListener("input",changerange)
function changerange(event) {
  let sliderform = document.getElementById("inputnumber")
  sliderform.innerHTML=event.target.value
}
function UpdateTime() {
  setInterval(() => {
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


}