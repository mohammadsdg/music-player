'use strict';

const searchBtn = document.getElementById('sub-btn');
const spUrl = document.getElementById('url');
const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');


const songsUrls = [];
const thumbnailUrls = [];
const songsName = [];



function getPlaylistId(url) {
    // Match the playlist ID in the URL
    const regex = /playlist\/([a-zA-Z0-9]+)/;
    const match = url.match(regex);

    (async function () {
        console.log(match[1]);
        const url = `https://spotify23.p.rapidapi.com/playlist_tracks/?id=${match[1]}&offset=0&limit=100`;
        console.log(url);
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '31e93b1f61msh7bd28c75228efaep1e840ajsnd019f89795b7',
                'x-rapidapi-host': 'spotify23.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            result.items.forEach(song => {
                const trackPreviewUrl = song.track.preview_url;
                songsUrls.push(trackPreviewUrl);

                const trackThumbnail = song.track.album.images[1].url;
                thumbnailUrls.push(trackThumbnail);

                const trackName = song.track.name;
                songsName.push(trackName);
            });


            console.log(songsName);

            let songIndex = 0;


            // console.log(songsUrls[songIndex]);
            loadSong(songsUrls[songIndex], thumbnailUrls[songIndex], songsName[songIndex]);


            // Update song details
            function loadSong(song, thumbnail, name) {
                title.innerHTML = name;

                audio.src = song;
                cover.src = thumbnail;
            }

            // Play song
            function playSong() {
                musicContainer.classList.add('play');
                playBtn.querySelector('i.fas').classList.remove('fa-play');
                playBtn.querySelector('i.fas').classList.add('fa-pause');

                audio.play();
            }

            function pauseSong() {
                musicContainer.classList.remove('play');
                playBtn.querySelector('i.fas').classList.add('fa-play');
                playBtn.querySelector('i.fas').classList.remove('fa-pause');

                audio.pause();
            }

            // Previous song
            function prevSong() {
                songIndex--;

                if (songIndex < 0) {
                    songIndex = songsUrls.length - 1;
                }

                loadSong(songsUrls[songIndex], thumbnailUrls[songIndex], songsName[songIndex]);

                playSong();
            }

            // Next song

            function nextSong() {
                songIndex++;

                if (songIndex > songsUrls.length - 1) {
                    songIndex = 0;
                }

                loadSong(songsUrls[songIndex], thumbnailUrls[songIndex], songsName[songIndex]);

                playSong()
            }

            // Update progress bar
            function updateProgress(e) {
                const { duration, currentTime } = e.srcElement;
                // console.log(duration, currentTime);
                const progressPercent = (currentTime / duration) * 100;
                progress.style.width = `${progressPercent}%`;
            }

            // Set progress bar
            function setProgress(e) {
                const width = this.clientWidth;
                const clickX = e.offsetX;
                const duration = audio.duration;

                audio.currentTime = (clickX / width) * duration;
                console.log(`clickX: ${clickX} width: ${width} duration: ${duration}`);
            }

            // Event Listener

            playBtn.addEventListener('click', () => {
                const isPlaying = musicContainer.classList.contains('play');

                if (isPlaying) {
                    pauseSong();
                } else {
                    playSong();
                }
            });

            // Change song
            prevBtn.addEventListener('click', prevSong);
            nextBtn.addEventListener('click', nextSong);

            // Time/song update

            audio.addEventListener('timeupdate', updateProgress);

            // Click on progress bar
            progressContainer.addEventListener('click', setProgress);

            // Song ends
            audio.addEventListener('ended', nextSong);

            console.log(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    })();

}

searchBtn.addEventListener('click', function () {
    getPlaylistId(spUrl.value);
})


// keep track of song
