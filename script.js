
console.log("Let's write javascript");
let currentSong = new Audio() ; // global variable
let songs ;
let currFolder;
async function getSongs(folder){
    currFolder = folder
    let a = await fetch(`http://192.168.1.112:5501/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response ;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }
    
     //show all the songs in the playlists yeh
     let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
     songUl.innerHTML = ""
     for (const song of songs) {
         songUl.innerHTML = songUl.innerHTML + `<li class="invert">
                   <img src="music.svg" alt="">
                   <div class="info invert">
                     <div>${song.replaceAll("%20" ," ")}</div>
                     <div>Harry</div>
                   </div>
                   <div class="playNow ">
                     <span class="invert">Play now</span>
                     <img  src="play.svg" alt="">
                   </div> </li>`;
     }
 
      // attach an event listener to each song yeh
      Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e =>{
         e.addEventListener("click" , element => {
             console.log(e.querySelector(".info").firstElementChild.innerHTML)
             playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
         })
     })
 
     // attach an event listener to next and previous yeh
     play.addEventListener("click" , () => {
         if(currentSong.paused){
             currentSong.play()
             play.src = "pause.svg"
         }
         else{
             currentSong.pause()
             play.src = "play.svg"
         }
     })
 
     // add an event listener to previous yeh
     previous.addEventListener("click" , () =>{
         console.log("previous clicked")
         console.log(currentSong)
         let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
         if([index-1] >= 0){
             playMusic(songs[index-1])
         }
     })
  
     // add an event listener to next yeh
     next.addEventListener("click" , () => {
         currentSong.pause()
         console.log("Next clicked")
         let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
         console.log(songs , index)
         if([index+1] < songs.length){
             playMusic(songs[index+1])
         }
        
     })
 
    
}
function convertSecondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(2);

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return `${formattedMinutes}:${formattedSeconds}`;
}

const playMusic = (track , pause = false) =>{
    // let audio = new Audio("/songs/" + track) 
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
    }
    play.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}


async function main(){
   
    // get thelist of all the songs
    await getSongs("songs/hindi")
    playMusic(songs[0], true)
        
    //listen for timeupdate event
    currentSong.addEventListener("timeupdate" , () => {
        
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)}/${convertSecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%" ;

    })
      
    // add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click" , e => {
        let percent = ( e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%" ;
        currentSong.currentTime = ((currentSong.duration )*percent) / 100 ;
    })

    // add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click" , () => {
        document.querySelector(".left").style.left = "0"
    })

    // add event listener for close of hamburger
    document.querySelector(".close").addEventListener("click" , () => {
        document.querySelector(".left").style.left = "-120%"
    })

    

    // add an event to volume range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e) => {
        console.log("setting value to" , e.target.value , "/100")
        currentSong.volume = parseInt(e.target.value) / 100

    })

    // load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click" , async item => {
            console.log(item.target , item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            item.dataset.folder
        })
    })


}

main()



