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

var podcastContainer = document.querySelector("#container");
const storageRef = storage.ref();

function readEpisode(doc) {
    var podcastTitle = document.createElement('div');
    var titleLine = document.createElement('div');
    var main = document.createElement('div');
    var podcastThumbnail = document.createElement('img');
    var podcastDescription = document.createElement('div');
    var socials = document.createElement('div');

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
                    break;
                case "youtube":
                    socialAnchor.alt = 'youtube';
                    socialImg.src = "imgs/YouTube.svg"
                    socialAnchor.href = episodeUrls[episodeUrlKey];
                    socials.appendChild(socialAnchor);
                    socialAnchor.appendChild(socialImg);
                    break;
                case "googlepodcast":
                    socialAnchor.alt = 'google podcast';
                    socialImg.src = "imgs/googlePodcasts.svg"
                    socialAnchor.href = episodeUrls[episodeUrlKey];
                    socials.appendChild(socialAnchor);
                    socialAnchor.appendChild(socialImg);
                    break;
                case "radiopublic":
                    socialAnchor.alt = 'radio public';
                    socialImg.src = "imgs/radiopublic.svg"
                    socialAnchor.href = episodeUrls[episodeUrlKey];
                    socials.appendChild(socialAnchor);
                    socialAnchor.appendChild(socialImg);
                    break;
                case "pocketcasts":
                    socialAnchor.alt = 'pocket casts';
                    socialImg.src = "imgs/pocketcasts.svg"
                    socialAnchor.href = episodeUrls[episodeUrlKey];
                    socials.appendChild(socialAnchor);
                    socialAnchor.appendChild(socialImg);
                    break;
                case "beaker":
                    socialAnchor.alt = 'beaker';
                    socialImg.src = "imgs/beaker.svg"
                    socialAnchor.href = episodeUrls[episodeUrlKey];
                    socials.appendChild(socialAnchor);
                    socialAnchor.appendChild(socialImg);
                    break;
            }
        }
    }
    podcastContainer.appendChild(podcastTitle);
    podcastContainer.appendChild(titleLine);
    podcastContainer.appendChild(main);
    main.appendChild(podcastThumbnail);
    main.appendChild(podcastDescription)
    podcastDescription.appendChild(socials);

    var epNum = doc.data().episodeNumber;
    db.collection("episodes").doc(doc.id).collection('sections').orderBy("sectionNumber").get().then((snapshot) => {
        var sectionHeading = document.createElement('h3');
        sectionHeading.textContent = 'SECTIONS';
        podcastContainer.appendChild(sectionHeading);
        snapshot.docs.forEach(doc => {
            readSections(doc, epNum);
        });
    })
}

function readSections(doc, epNum) {

    var sections = document.createElement('div')
    var right = document.createElement('div')
    var left = document.createElement('div');
    var sectionThumbnail = document.createElement('img');
    var sectionTitle = document.createElement('div');
    var sectionDescription = document.createElement('div');
    var socials = document.createElement('div');
    var youtubeAnchor = document.createElement('a');
    var youtubeImg = document.createElement('img');
    var instaAnchor = document.createElement('a');
    var instaImg = document.createElement('img');

    sections.className = "sections"
    right.className = "rightside-section";
    left.className = "leftside-section"
    sectionThumbnail.className = 'section-thumbnail'
    sectionThumbnail.alt = 'thumbnail'
    sectionTitle.className = 'section-title';
    sectionDescription.className = 'section-description';
    socials.className = 'section-socials';
    youtubeImg.alt = 'youtube';
    instaImg.alt = 'instagram';

    const sectionImageName = 'sectionThumbnails/episode' + epNum + "/thumbnail" + doc.data().sectionNumber + '.png'
    storageRef.child(sectionImageName).getDownloadURL().then(function(url) {
        sectionThumbnail.src = url;
    });
    sectionTitle.textContent = doc.data().sectionTitle;
    sectionDescription.textContent = doc.data().sectionDescription;
    youtubeImg.src = "imgs/YouTube.svg"
    instaImg.src = "imgs/Instagram.svg"
    youtubeAnchor.href = doc.data().episodeUrl.youtube;
    instaAnchor.href = doc.data().episodeUrl.instagram;

    podcastContainer.appendChild(sections);
    sections.appendChild(right)
    sections.appendChild(left)
    left.appendChild(sectionThumbnail);
    right.appendChild(sectionTitle);
    right.appendChild(sectionDescription);
    if (window.matchMedia("(max-width:900px)").matches) {
        left.appendChild(socials);
    } else {
        right.appendChild(socials);
    }
    socials.appendChild(instaAnchor);
    instaAnchor.appendChild(instaImg);
    socials.appendChild(youtubeAnchor);
    youtubeAnchor.appendChild(youtubeImg);
}

var episode = parseInt(document.location.search.replace(/^.*?\=/, ''))

db.collection("episodes").where("episodeNumber", "==", episode).get().then((snapshot) => {
    readEpisode(snapshot.docs[0])
})