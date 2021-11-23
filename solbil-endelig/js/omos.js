// Image transition
function handler(entries){
 for (const entry of entries){
     if (entry.isIntersecting){
    entry.target.classList.add("transition");
    }else{
    entry.target.classList.remove("transition");
    }
 }
}

const observer = new IntersectionObserver (handler,{
    threshold: 0.1,
});

const img = document.getElementById("image-1")
console.log(img)
observer.observe(img);

// Video transition
function videoHandler(entries) {
    for (const entry of entries){
        if (entry.isIntersecting){
            entry.target.play();
        } else{
            entry.target.pause();
        }      
    }
}

const videoObserver = new IntersectionObserver(videoHandler, {threshold: 0.3,
})
const video1 = document.getElementById("video-1")
videoObserver.observe(video1);

pannellum.viewer('panorama', {
    "type": "equirectangular",
    "panorama": "images/panorama.JPG"
});