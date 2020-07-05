function load() {
    document.getElementById("loading").style.display = 'none';
}

const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', e => {
    if (window.matchMedia("(min-width:900px").matches) {
        cursor.setAttribute("style", "top: " + (e.pageY - 10) + "px; left: " + (e.pageX - 10) + "px;")
    }
})


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

    localStorage.setItem("episodeNumber", doc.data().episodeNumber);
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
    var first = db.collection('episodes').orderBy('episodeNumber', 'desc').limit(1);

    first.get().then((snapshot) => {
        var lastVisible = snapshot.docs[snapshot.docs.length - 1];
        snapshot.docs.forEach(doc => {
            readLatestPodcast(doc)
        });

        next = db.collection("episodes")
            .orderBy("episodeNumber", "desc")
            .startAfter(lastVisible)
            .limit(15);


        next.get().then((snapshot) => {
            var count = 0;
            snapshot.docs.forEach(doc => {
                count++;
                readPodcast(doc, count);
            });
            lastVisible = snapshot.docs[snapshot.docs.length - 1];
            next = db.collection("episodes")
                .orderBy("episodeNumber", "desc")
                .startAfter(lastVisible)
                .limit(15);
        });
    });
});

function handleIntersect(entries) {
    if (entries[0].isIntersecting) {
        console.warn("something is intersecting with the viewport");
        getData();
    }
}

function getData() {
    console.log("fetch some data");

    next.get().then((snapshot) => {
        var count = 0;
        snapshot.docs.forEach(doc => {
            count++;
            readPodcast(doc, count);
        });
        lastVisible = snapshot.docs[snapshot.docs.length - 1];
        next = db.collection("episodes")
            .orderBy("episodeNumber", "desc")
            .startAfter(lastVisible)
            .limit(2);
    });
}




// for links later

// var linksBtn = document.createElement('div');
// var linkAnchor = document.createElement('a');
// var linksImg = document.createElement('img')
// var line = document.createElement('div');
// linksBtn.className = 'links-btn';
// linkAnchor.href = '#';
// linksImg.src = 'imgs/Links.svg';
// linksImg.alt = 'links';
// linksImg.className = 'link-img';
// line.className = 'line hide-desktop';
// latestEpisode.appendChild(linksBtn);
// linksBtn.appendChild(linkAnchor);
// linkAnchor.appendChild(linksImg);
// latestEpisode.appendChild(line);