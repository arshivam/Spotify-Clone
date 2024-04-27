let currentSong = new Audio();
let songs;
let currFolder;
let folder;

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}`)[1]);
    }
  }

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      ` <li>
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
        
    </li> `;
  }

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  return songs;
}
const playMusic = (track, pause = false) => {
  currentSong.src = `${currFolder}/${track}`;
  if (!pause) {
    currentSong.play();
    play.src = "./assets/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songMin").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".card-container");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/")) {
      folder = e.href.split("/").slice(-1)[0];
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div data-folder="${folder}" class="card">
            <div class="play">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="#000">
                        <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
            </div>
 
            <img src="/songs/${folder}/cover.jpeg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`;
    }
  }
  //Load the folder when we click on any card
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}/`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  //Get the list of all available songs
  await getSongs("songs/hin/");
  playMusic(songs[0], true);

  //Display all the albums
  displayAlbums();

  //Play button listerner
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./assets/pause.svg";
    } else {
      currentSong.pause();
      play.src = "./assets/play.svg";
    }
  });

  //Added duration for the songs
  function secondsToMinutes(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return (
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (remainingSeconds < 10 ? "0" : "") +
      remainingSeconds
    );
  }

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songMin").innerHTML = `${secondsToMinutes(
      Math.floor(currentSong.currentTime)
    )} / ${secondsToMinutes(Math.floor(currentSong.duration))}`;
    //seeker movement
    document.querySelector(".circle").style.left =
      (Math.floor(currentSong.currentTime) / Math.floor(currentSong.duration)) *
        100 +
      "%";
  });

  document.querySelector(".seeker").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime =
      (Math.floor(currentSong.duration) * percent) / 100;
  });

  //Event listner for volume increase decrease

  document.getElementById("range").addEventListener("change", (e) => {
    let volume = e.target.value;
    currentSong.volume = parseInt(volume) / 100;
  });

  //event listener for hamburger menu
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.display = "block";
    document.querySelector(".left").style.left = "0";
  });

  document.querySelector(".closebtn").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  //Event listener previous and next btn
  previous.addEventListener("click", () => {
    currentSong.pause();
    let indexOfSong = songs.indexOf(
      currentSong.src.split(`songs/${folder}//`)[1]
    );
    if (indexOfSong - 1 >= 0) {
      playMusic(songs[indexOfSong - 1]);
    }
  });

  next.addEventListener("click", () => {
    currentSong.pause();
    let indexOfSong = songs.indexOf(
      currentSong.src.split(`songs/${folder}//`)[1]
    );
    if (indexOfSong + 1 < songs.length) {
      playMusic(songs[indexOfSong + 1]);
    }
  });

  //event listener for mute volume btn
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document.getElementById("range").value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 0.1;
      document.getElementById("range").value = 10;
    }
  });
}

main();
