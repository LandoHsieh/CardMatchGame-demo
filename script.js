//getElementsByClassName 回傳的是一個陣列
//let cards = Array.from(document.getElementsByClassName("card"));

let cardsGet = Array.from(document.getElementsByClassName("card"));

let time_remaining = document.getElementById("time-remaining");
let gameLevelText = document.getElementById("gameLevel");
let start_btn = document.getElementsByClassName("start-btn");
let victoryTitle = document.getElementsByClassName("victoryTitle");
let gameOverTitle = document.getElementsByClassName("gameOverTitle");
let turnoffbgm = document.getElementById("turnoffbgm");
let turnonbgm = document.getElementById("turnonbgm");

//進階
let j = 0;
//包含level2
let cardsIncludeLevel = [];
for(let i = 0; i < 36; i++){
  if(cardsGet[i].classList.contains('level2')){
    cardsIncludeLevel.push(cardsGet[i]);
  }
}

//不包含level2
let cards = [];
for(let i = 0; i < 36; i++){
  if(!cardsGet[i].classList.contains('level2')){
    cards.push(cardsGet[i]);
  }
}

//塞入卡片
/*
let card1 = cardsIncludeLevel.shift();
let card2 = cardsIncludeLevel.shift();
cards.push(card1);
cards.push(card2);
*/


//card.getElementsByClassName('card-value')[0].src;
/*
let count = 0;
for(let i = 0; i < 20; i+=2){
  for(let j = i + 1; j < 20; j++){
    if(cardsIncludeLevel[i].getElementsByClassName('card-value')[0].src == cardsIncludeLevel[j].getElementsByClassName('card-value')[0].src){
      console.log("i:",i,",j:",j,"matched");
      count++;
      
      break;
    }
    else{
      console.log("i:",i,",j:",j,"not-matched");
    }
  }
}
console.log("count:",count);
*/





class AudioController{
  constructor(){
    this.bgm = new Audio('SoundEffect/Thomas.mp3');
    this.clickSound = new Audio('SoundEffect/mouse-click.mp3')
    this.wrongSound = new Audio('SoundEffect/wrong.mp3')
    this.matchSound = new Audio('SoundEffect/match.mp3')
    this.victorySound = new Audio('SoundEffect/victory.mp3')
    this.gameOverSound = new Audio('SoundEffect/GameOver.mp3')
  }
  startMusic(){
    //this.bgm.playbackRate = 2; //音樂加速兩倍
    this.bgm.play();
  }
  stopMusic(){
    this.bgm.pause();
  }
  canFlipSound(){
    this.clickSound.play();
  }
  match(){
    this.matchSound.play();
  }
  wrong(){
    this.wrongSound.play();
  }
  victory(){
    this.victorySound.play();
  }
  gameOver(){
    this.gameOverSound.play();
  }
  
}
//整個遊戲包含 設定開始遊戲初始值 翻牌動作 檢查是否能翻牌
class MemoryBlocks{
  constructor(checktime, totaltime){
    this.audio = new AudioController();
    this.cardsArray = cards;
    this.checktimeRemaining = checktime;
    this.timeRemaining = totaltime;
    this.gameLevel = 0;
  }

  startGame(){
    

    //let card1 = cardsIncludeLevel.shift();
    //let card2 = cardsIncludeLevel.shift();
    //this.cardsArray.push(card1);
    //this.cardsArray.push(card2);
    this.waitForCardClose = true;
    this.cardLength = this.cardsArray.length;
    //console.log("this.cardLength:", this.cardLength)
    this.gameLevel += 1;
    this.resetCards();
    this.showAllCardFirst();
    this.checktimeRemaining = 2 * this.gameLevel;
    this.timeRemaining = 50;
    this.working = false;
    this.matched = [];
    this.checkCard = null;
    
    gameLevelText.innerText = this.gameLevel;
    
    //this.checkTime()
    setTimeout(()=>{
      this.countDown = this.checkTime();
      //this.countDown2 = this.totalTime();
    }, 0);//按開始後多久才開始倒數
    setTimeout(()=>{
      this.countDown2 = this.totalTime();
    }, this.checktimeRemaining*1000);//500ms + 設定的checkTime ＝ 銜接totalTime
    
    
    
  }

  resetCards(){
    for(let i = this.cardsArray.length - 1; i > 0; i--){
      let randIndex = Math.floor(Math.random() * (i+1));
      this.cardsArray[randIndex].style.order = i;
      this.cardsArray[i].style.order = randIndex;
    }

    /*
    for(let i = cards.length - 1; i > 0; i--){
      let j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
*/
/*
    for(let i = this.cardsArray.length - 1; i > 0; i--){
      let j = Math.floor(Math.random() * (i + 1));
      [this.cardsArray[i], this.cardsArray[j]] = [this.cardsArray[j], this.cardsArray[i]];
    }
 */   

  }

  showAllCardFirst(){
    for(let i = 0; i < this.cardLength; i++){
      this.cardsArray[i].classList.remove('level2');
    }
    for(let i = 0; i < this.cardLength; i++){
      this.cardsArray[i].classList.add('show');
    }
    
  }

  checkTime(){
    //console.log(this.checktimeRemaining);
    this.working = false;
    time_remaining.innerText = this.checktimeRemaining;
    return setInterval(()=>{
      this.checktimeRemaining--;
      time_remaining.innerText = this.checktimeRemaining;
      if(this.checktimeRemaining === 0){
        this.checkTimeOut();
      }
    },1000)
  }
  totalTime(){
    time_remaining.innerText = this.timeRemaining;
    return setInterval(()=>{
      this.timeRemaining--;
      time_remaining.innerText = this.timeRemaining;
      if(this.timeRemaining === 0){
        this.checkTimeOut2();
      }
    },1000)

  }

  checkTimeOut(){
    clearInterval(this.countDown);
    if(this.gameLevel > 1){
      this.closeAllCardLevel2();
    }
    else{
      this.closeAllCard();
    }
  }
  checkTimeOut2(){
    clearInterval(this.countDown2);
    this.audio.gameOver();
    gameOverTitle[0].classList.remove('hide');

    this.showAllCardFirst();
    this.working = false;
  }
  
  closeAllCard(){
    for(let i = 0; i < this.cardLength; i++){
      this.cardsArray[i].classList.remove('show');
    }
    this.working = true;
  }
  closeAllCardLevel2(){
    for(let i = 0; i < this.cardLength; i++){
      this.cardsArray[i].classList.remove('show');
    }
    this.working = true;
  }


  hideCards(){
    this.cardsArray.forEach(card => {
      card.classList.remove('show');
      card.classList.remove('matched');
    })
  }

  gameOver(){
    clearInterval(this.countDown);
  }
    
  canFlip(card){
    if(this.working==true && !this.matched.includes(card) && card !== this.checkCard && this.waitForCardClose){
      return true;
    }
  }
  
      
  flipCard(card){
    if(this.canFlip(card)){
      this.audio.canFlipSound();
      card.classList.add('show');
      console.log("checkCard:", this.checkCard);
      if(this.checkCard == null){
        this.checkCard = card;
      }
      else{
        this.checkIfMatch(card);
      }
    }
    
  }
  
  checkIfMatch(card){
    //console.log("working status:",this.working)
    this.audio = new AudioController();
    let cardType = card.getElementsByClassName('card-value')[0].src;
    let checkCardType = this.checkCard.getElementsByClassName('card-value')[0].src;
    //如果兩張牌一樣
    if(cardType==checkCardType){
      //播放match音效
      this.audio.match();
      this.matched.push(card);
      this.matched.push(this.checkCard);
    }
    //否則
    else{
      //console.log("checkCard2: ",this.checkCard);
      this.waitForCardClose = false;
      this.audio.wrong();
      this.checkCard.classList.remove('show');
      setTimeout(() => this.waitForCardClose = true, 500)

      //在500毫秒內把checkCard跟card蓋起來(remove('show');)
      setTimeout(()=>
        card.classList.remove('show')
      , 500);
    }
    this.checkCard = null;
    if(this.matched.length == this.cardLength){
      //console.log("win!");
      this.gameVictory();
      victoryTitle[0].classList.remove('hide');
      //點擊victory後
      victoryTitle[0].addEventListener("click", () => {
        
        victoryTitle[0].classList.add('hide');
        this.levelup();
        //console.log("cardLength:",this.cardLength);
        gameLevelText.innerText = this.gameLevel;
        start_btn[0].classList.add("visible");
        
      })
    }
  }

  levelup(){
    if(cardsIncludeLevel.length !== 0){
      let card1 = cardsIncludeLevel.shift();
      let card2 = cardsIncludeLevel.shift();
      this.cardsArray.push(card1);
      this.cardsArray.push(card2);
    }
    this.cardLength = this.cardsArray.length;
    for(let i = 0; i < this.cardLength; i++){
      this.cardsArray[i].classList.remove('level2');
    }
    for(let i = 0; i < this.cardLength; i++){
      //this.cardsArray[i].classList.remove('level2');
      this.cardsArray[i].classList.remove('show');
    }
    
    


  }
  

  gameVictory(){
    this.working = false;
    clearInterval(this.countDown);
    clearInterval(this.countDown2);
    this.audio.victory();
  }
}
/*
let game = new MemoryBlocks(2,100);
game.showAllCardFirst();
*/
function goStartGame(){
  let game = new MemoryBlocks(5,100);
  let audio = new AudioController();
  let audiooff = false;
  //點擊按鈕作動 法一：onclick
  /*function start() {
    document.getElementById("start_btn").classList.remove("visible");
  }*/
  //點擊按鈕作動 法二：不用onclick
  
  start_btn[0].addEventListener("click", () => {
      start_btn[0].classList.remove("visible");
      //console.log("cards length=", cards.length);
      game.startGame();
      if(!audiooff){audio.startMusic();}
      turnoffbgm.onclick = function(){
        audio.stopMusic()
        audiooff = true;
      };
      turnonbgm.onclick = function(){
        audio.startMusic();
        audiooff = false;
      };

      
      //console.log("gamelevel:",game.gameLevel);
      game.working = true;
      //console.log(cards);
      game.cardsArray.forEach((card) => {
        card.addEventListener("click", () => {
          //flipcard
          game.flipCard(card);
          //
        });
      
      });
      
  });
  
  
}
goStartGame();