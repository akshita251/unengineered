function load() {
    document.getElementById("loading").style.display = 'none';
}

var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const cursor = document.querySelector('.cursor');
if (!isSafari) {

    document.addEventListener('mousemove', e => {
        if (window.matchMedia("(min-width:900px").matches) {
            cursor.setAttribute("style", "top: " + (e.pageY - 10) + "px; left: " + (e.pageX - 10) + "px;")
        }
    })
} else {
    cursor.style.display = "none";
}

const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 800
});

const latestEpisode = document.querySelector('.podcast-gray-container');
const storageRef = storage.ref();

function readLatestPodcast(doc) {

    var podcastTitle = document.createElement('div');
    var podcast = document.createElement('a');
    var podcastThumbnail = document.createElement('img');
    var podcastDescription = document.createElement('p');

    podcastTitle.className = 'podcast-title';
    podcast.href = "episode.html?episode=" + doc.data().episodeNumber;
    podcastThumbnail.alt = 'Thumbnail';
    podcastThumbnail.className = 'podcast-thumbnail';
    podcastDescription.className = 'podcast-description';

    podcastTitle.textContent = doc.data().episodeTitle;
    podcastDescription.textContent = doc.data().episodeDescription;
    const episodeImageName = 'episodeThumbnails/thumbnail' + doc.data().episodeNumber + '.png'
    storageRef.child(episodeImageName).getDownloadURL().then(function(url) {
        podcastThumbnail.src = url;
    });

    latestEpisode.appendChild(podcastTitle);
    latestEpisode.appendChild(podcast);
    podcast.appendChild(podcastThumbnail);
    latestEpisode.appendChild(podcastDescription);

}

function readPodcast(doc, count) {
    var list;
    if (window.matchMedia("(min-width: 900px)").matches) {
        if (count % 2 == 0) {
            list = document.getElementById('left');
        } else {
            list = document.getElementById('right');
        }
    } else {
        list = document.getElementById('left')
    }


    var listElement = document.createElement('li');
    var episodeContainer = document.createElement('div');
    var episodeNumber = document.createElement('p');
    var episodeTitle = document.createElement('p');
    var episode = document.createElement('a');
    var episodeThumbnail = document.createElement('img');

    episodeContainer.className = 'episode-container';
    episodeNumber.className = 'episode-number';
    episodeTitle.className = 'episode-podcast-title';
    episode.href = "episode.html?episode=" + doc.data().episodeNumber;
    episodeThumbnail.className = 'thumbnail';
    episodeThumbnail.alt = 'thumbnail';

    if (doc.data().episodeNumber < 10) {
        episodeNumber.textContent = "0" + doc.data().episodeNumber;
    } else {
        episodeNumber.textContent = doc.data().episodeNumber;
    }
    episodeTitle.textContent = doc.data().episodeTitle;
    const episodeImageName = 'episodeThumbnails/thumbnail' + doc.data().episodeNumber + '.png'
    storageRef.child(episodeImageName).getDownloadURL().then(function(url) {
        episodeThumbnail.src = url;
    });

    list.appendChild(listElement);
    listElement.appendChild(episodeContainer)
    episodeContainer.appendChild(episodeNumber);
    episodeContainer.appendChild(episodeTitle);
    episodeContainer.appendChild(episode);
    episode.appendChild(episodeThumbnail);

}

var next;
document.addEventListener("DOMContentLoaded", () => {

    let options = {
        root: null,
        rootMargins: "0px",
        threshold: 0.05
    };
    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(document.querySelector(".footer"));

    //initial load of data
    db.collection('episodes').orderBy('episodeNumber', 'desc').limit(20).get().then((snapshot) => {
        readLatestPodcast(snapshot.docs[0])
        var count = 0;
        for (i = 1; i < 20; i++) {
            count++;
            readPodcast(snapshot.docs[i], count);
        }
        var lastVisible = snapshot.docs[snapshot.docs.length - 1];
        // console.log(lastVisible);
        next = db.collection("episodes")
            .orderBy("episodeNumber", "desc")
            .startAfter(lastVisible)
            .limit(20);

    });
});

function handleIntersect(entries) {
    if (entries[0].isIntersecting) {
        // console.log("something is intersecting with the viewport");
        getData();
    }
}

function getData() {

    next.get().then((snapshot) => {
        // console.log("fetch some data");
        var count = 0;
        snapshot.docs.forEach(doc => {
            count++;
            if (doc.data().show) {
                readPodcast(doc, count);
            }
        });
        lastVisible = snapshot.docs[snapshot.docs.length - 1];
        next = db.collection("episodes")
            .orderBy("episodeNumber", "desc")
            .startAfter(lastVisible)
            .limit(20);
    });
}