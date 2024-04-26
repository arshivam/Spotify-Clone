let currentSong = new Audio()

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
    let songs = await getSongs();
   playMusic(songs[0], true)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li>
        <img class="invert" src="assets/music.svg" alt="music">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Shivam</div>
        </div>
        <div class="playNow">
            <span>Play Now</span>
            <img  src="assets/play.svg" alt="playnow">
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
    })

}

main()
