let currentMusic = new Audio(" ")

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
 const playMusic = (track) =>{
    currentMusic.src = `/songs/${track}`
    currentMusic.play()

 }

async function main(){
    //Get the list of all available songs
    let songs = await getSongs();
    // console.log(songs);

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
    //Play the song
    // var audio = new Audio(songs[0])
    // audio.play()
    // audio.addEventListener("loadeddata", () => {
    //     // let duration = audio.duration;
    //     console.log(audio.duration, audio.currentSrc);
    //     // The duration variable now holds the duration (in seconds) of the audio clip
    //   });
}

main()
