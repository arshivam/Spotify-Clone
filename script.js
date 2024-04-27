let currentSong = new Audio()
let songs;

async function getSongs (){
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text()
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    
    let songs =  []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
}
 const playMusic = (track, pause=false) =>{
    currentSong.src = `/songs/${track}`
    if(!pause){
        currentSong.play();
        play.src = "./assets/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML =  decodeURI(track);
    document.querySelector(".songMin").innerHTML =  "00:00 / 00:00";  

 }

async function main(){
    
    //Get the list of all available songs
     songs = await getSongs();
   playMusic(songs[0], true)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li>
        <div class="sglg">
        <img class="invert" src="assets/music.svg" alt="music">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Shivam</div>
        </div>
        </div>
        <div class="playNow">
            <span>Play Now</span>
            <img  class="invert" src="assets/play.svg" alt="playnow">
        </div>
        
    </li> `
        
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e =>{
         e.addEventListener("click", element =>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
    })

    //Play button listerner
    play.addEventListener("click",() => {
    if(currentSong.paused){
        currentSong.play()
        play.src = "./assets/pause.svg"
    }else{
        currentSong.pause()
        play.src = "./assets/play.svg"
    }
    })

    //Added duration for the songs
    function secondsToMinutes(seconds) {
        var minutes = Math.floor(seconds / 60);
        var remainingSeconds = seconds % 60;
        return (minutes < 10 ? '0' : '') + minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
    }

    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songMin").innerHTML =  `${secondsToMinutes(Math.floor(currentSong.currentTime))} / ${secondsToMinutes(Math.floor(currentSong.duration))}`
         //seeker movement
        document.querySelector(".circle").style.left = (Math.floor(currentSong.currentTime)/Math.floor(currentSong.duration) * 100 + "%")
    })

    document.querySelector(".seeker").addEventListener("click" ,(e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100 
        document.querySelector(".circle").style.left =  percent + "%"
        currentSong.currentTime = ((Math.floor(currentSong.duration))* percent)/100
    })

    //Event listner for volume increase decrease

   document.getElementById("range").addEventListener("change",(e)=>{
    let volume = e.target.value;
    currentSong.volume = parseInt(volume)/100
   })

   //event listener for hamburger menu
   document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.display = "block";
    document.querySelector(".left").style.left= "0";
   })

   document.querySelector(".closebtn").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-100%";
   })

   //Event listener previous and next btn
   previous.addEventListener("click",()=>{
    currentSong.pause()
    let indexOfSong = songs.indexOf(currentSong.src.split("songs/")[1]);
    if (indexOfSong - 1 >= 0) {
        console.log("ss");
        playMusic(songs[indexOfSong - 1])
    }
   })

   next.addEventListener("click",()=>{
    currentSong.pause()
    let indexOfSong = songs.indexOf(currentSong.src.split("songs/")[1]);
    if (indexOfSong + 1 < songs.length) {
        playMusic(songs[indexOfSong + 1])
    }
   })



}

main()
