function load() {
    document.getElementById("loading").style.display = 'none';
}

const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', e => {
    if (window.matchMedia("(min-width:900px").matches) {
        cursor.setAttribute("style", "top: " + (e.pageY - 10) + "px; left: " + (e.pageX - 10) + "px;")
    }
})

var podcastContainer = document.querySelector("#container");
const storageRef = storage.ref();

function readEpisode(doc) {
    var podcastTitle = document.createElement('div');
    var titleLine = document.createElement('div');
    var main = document.createElement('div');
    var podcastThumbnail = document.createElement('img');
    var podcastDescription = document.createElement('div');
    var socials = document.createElement('div');
    var sectionHeading = document.createElement('h3');

    podcastTitle.className = 'podcast-page-title';
    titleLine.className = 'title-line';
    main.className = 'main';
    podcastThumbnail.className = 'podcast-page-thumbnail'
    podcastThumbnail.alt = 'thumbnail'
    podcastDescription.className = 'podcast-page-description';
    socials.className = 'socials';

    podcastTitle.textContent = doc.data().episodeTitle;
    podcastDescription.textContent = doc.data().episodeDescription;
    const episodeImageName = 'episodeThumbnails/thumbnail' + doc.data().episodeNumber + '.png'
    storageRef.child(episodeImageName).getDownloadURL().then(function(url) {
        podcastThumbnail.src = url;
    });
    sectionHeading.textContent = 'SECTIONS';

    var episodeUrls = doc.data().episodeUrl;
    if (episodeUrls != null) {
        for (var episodeUrlKey of Object.keys(episodeUrls)) {
            console.log(episodeUrlKey);
            console.log(episodeUrls[episodeUrlKey])
            var socialAnchor = document.createElement('a');
            var socialImg = document.createElement('img');
            switch (episodeUrlKey) {
                case "spotify":
                    socialAnchor.alt = 'spotify';
                    socialImg.src = "imgs/Spotify.svg"
                    socialAnchor.href = episodeUrls[episodeUrlKey];
                    socials.appendChild(socialAnchor);
                    socialAnchor.appendChild(socialImg);
                    break;
                case "instagram":
                    socialAnchor.alt = 'instagram';
                    socialImg.src = "imgs/Instagram.svg"
                    socialAnchor.href = episodeUrls[episodeUrlKey];
                    socials.appendChild(socialAnchor);
                    socialAnchor.appendChild(socialImg);
            }
        }
    }
    podcastContainer.appendChild(podcastTitle);
    podcastContainer.appendChild(titleLine);
    podcastContainer.appendChild(main);
    main.appendChild(podcastThumbnail);
    main.appendChild(podcastDescription)
    podcastDescription.appendChild(socials);
    podcastContainer.appendChild(sectionHeading);

    var epNum = doc.data().episodeNumber;
    db.collection("episodes").doc(doc.id).collection('sections').orderBy("sectionNumber").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            readSections(doc, epNum)
            console.log(doc.data())
        });
    })
}

function readSections(doc, epNum) {

    var sections = document.createElement('div')
    var sectionThumbnail = document.createElement('img');
    var sectionTitle = document.createElement('div');
    var sectionDescription = document.createElement('div');
    var socials = document.createElement('div');

    sections.className = "sections"
    sectionThumbnail.className = 'section-thumbnail'
    sectionThumbnail.alt = 'thumbnail'
    sectionTitle.className = 'section-title';
    sectionDescription.className = 'section-description';
    socials.className = 'socials';


    const sectionImageName = 'sectionThumbnails/episode' + epNum + "/thumbnail" + doc.data().sectionNumber + '.png'
    storageRef.child(sectionImageName).getDownloadURL().then(function(url) {
        sectionThumbnail.src = url;
    });
    sectionTitle.textContent = doc.data().sectionTitle;
    sectionDescription.textContent = doc.data().sectionDescription;


    podcastContainer.appendChild(sections);
    sections.appendChild(sectionThumbnail);
    sections.appendChild(sectionTitle);
    sections.appendChild(sectionDescription);
    sections.appendChild(socials)
}

var episode = document.location.search.replace(/^.*?\=/, '')

db.collection("episodes").orderBy("episodeNumber", "desc").get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        if (doc.data().episodeNumber == episode) {
            readEpisode(doc);
        }
    });
});