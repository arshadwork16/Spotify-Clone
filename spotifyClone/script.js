console.log("Let's Write Javascript");
let song;
let currentSong = new Audio();
let left = document.querySelector(".left");

function secondsToMinutes(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(secs).padStart(2, "0")
    );
}


async function getSongs() {
    let a = await fetch(`/Songs/`);
    let response = await a.text()
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    song = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            song.push(element.href.replace("http://127.0.0.1:5500/WEB%20DEVELOPMENT/Project/spotifyClone/%5CSongs%5C",""))
        }
    }
    return song
}

// Function to play Music
async function playMusic(trackname, pause = false) {
    currentSong.src = `/Songs/` + trackname;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songInfo").innerHTML = `<img src="phonkLogo.avif" alt="" width="40rem" height="40rem" style="border-radius: 3rem;"> ${decodeURI(trackname)}`
    document.querySelector(".songTime").innerHTML = "00:00/00:00"
}

(async function main() {
    let song = await getSongs();
    playMusic(song[0], true)


    // Adding an list of songs in left Bar
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const s of song) {
        songUL.innerHTML += `<li> <img src="phonkLogo.avif" alt="" width="40rem" height="40rem" style="border-radius: 3rem;">
                                <div class="separator">
                                    <div class="info">
                                        <div>${s.replaceAll("%20", " ")}</div>
                                        <div>artist Name</div>
                                    </div>
                                    <div class="playT">
                                        <div>Play Now</div>
                                    </div>
                                    <div class="play"><img src="play.svg" alt=""></div>
                                </div>
                            </li>`
    }

    // Attaching the Event listener to all the song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        })
    })

    // Duration and Movable Circle
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML =
            `${secondsToMinutes(currentSong.currentTime)}/${secondsToMinutes(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Making SeekBar clickable
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    // Play and Paused Button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg"
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    })


    // Add an event listener for Hamburger
    let humburger = document.querySelector(".hamburger");

    humburger.addEventListener("click", () => {
        let widthLeft = left.getBoundingClientRect().width;
        if (left.style.left === "0px" || left.style.left === "0%") {
            left.style.left = "-100%";
            humburger.style.transform = "translateX(0px)";
            document.querySelectorAll(".navRight, .right").forEach(el => {
                el.style.filter = "blur(0)";
            })
        } else {
            left.style.left = "0";
            humburger.style.transform = `translateX(${widthLeft}px)`;
            document.querySelectorAll(".navRight, .right").forEach(el => {
                el.style.filter = "blur(8px)";
            })
            if (window.innerWidth <= 650) {
                humburger.style.backgroundColor = "black";
                humburger.style.borderRadius = "50%";
            }
        }
    })

    // Click anywhere in Document to slide the Left bar Inside
    document.addEventListener("click", (e) => {
        if (left.style.left === "0px" || left.style.left === "0%") {
            if (!left.contains(e.target) && !humburger.contains(e.target)) {
                left.style.left = "-100%";
                humburger.style.transform = "translateX(0px)";
                document.querySelectorAll(".navRight, .right").forEach(el => {
                    el.style.filter = "blur(0)";
                })
            }
        }
    })

    // Adding eventlistener to previous 
    previous.addEventListener("click", () => {
        let i = song.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((i - 1) >= 0) {
            playMusic(song[i - 1]);
        }
    })

    // Adding eventlistener to next 
    forward.addEventListener("click", () => {
        let i = song.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((i + 1) < song.length) {
            playMusic(song[i + 1]);
        }
    })

    // Adding Eventlistener to Volume 
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("click", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    // Adding eventListener to Mute
    document.querySelector(".volume > img").addEventListener("click", (e) => {
        console.log(e.target);
        if (e.target.src.includes("volumehigh.svg")) {
            e.target.src = e.target.src.replace("volumehigh.svg", "mute.svg");
            currentSong.volume = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volumehigh.svg");
            currentSong.volume = .1;
        }
    })

})()
