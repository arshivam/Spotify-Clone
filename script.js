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

async function main(){
    //Get the list of all available songs
    let songs = await getSongs();
    // console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    console.log(songUL);
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + ` <li>
        <img class="invert" src="assets/music.svg" alt="music">
        <div>
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Shivam</div>
        </div>
        <div class="playNow">
            <span>Play Now</span>
            <img class="invert" src="assets/play.svg" alt="playnow">
        </div>
        
    </li> `
        
    }
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
