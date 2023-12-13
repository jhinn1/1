let track_art = document.querySelector('#track-art');
let track_name = document.querySelector('#track-name');
let track_artist = document.querySelector('#track-artist');

let playpause_btn = document.querySelector('#playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const music_list = [
	{
		img: 'assets/image/zackTabudlo.jpg',
		name: 'Ako Nalang Kasi',
		artist: 'Zack Tabudlo',
		music: 'assets/music/akonalangkasi.mp3',
	},
	{
		img: 'assets/image/twice.jpg',
		name: 'Set Me Free',
		artist: 'Twice',
		music: 'assets/music/setmefree.mp3',
	},
	{
		img: 'assets/image/twice.jpg',
		name: 'Talk That Talk',
		artist: 'Twice',
		music: 'assets/music/talkthattalk.mp3',
	},
	{
		img: 'assets/image/ratherbe.jpg',
		name: 'Rather Be',
		artist: 'Clean Bandit',
		music: 'assets/music/Rather Be.mp3',
	},
];
function showMusicList() {
	const playlist = document.getElementById('playlist');
	let template = '';
	music_list.forEach((music, index) => {
		template += `
        <li class="item">
			<div class="item-detail">
				<span class="play-number">${index + 1}</span>
				<a href="#" class="text music-title">${music['name']}</a>
				<div class="subtitle">${music['artist']}</div>
			</div>
            <button class="play-music">
				<i class="material-icons" data-song-title="${music['name']}">play_circle</i>
			</button>
        </li>
        `;
	});
	playlist.innerHTML = template;
	document.querySelectorAll('.play-music').forEach((btn, index) => {
		btn.addEventListener('click', () => {
			track_index = index;
			loadTrack(track_index);
			playTrack();
		});
	});
}
function loadTrack(track_index) {
	clearInterval(updateTimer);
	reset();

	curr_track.src = music_list[track_index].music;
	curr_track.load();

	track_art.innerHTML = `<img src="${music_list[track_index].img}">`;
	track_name.textContent = music_list[track_index].name;
	track_artist.textContent = music_list[track_index].artist;

	updateTimer = setInterval(setUpdate, 1000);
	curr_track.addEventListener('ended', nextTrack);
	random_bg_color();
}
function random_bg_color() {
	function populate(a) {
		for (let i = 0; i < 6; i++) {
			let x = Math.round(Math.random() * 9);
			a += x;
		}
		return a;
	}
	let Color1 = populate('#');
	let Color2 = populate('#');

	let gradient = 'linear-gradient(to right,' + Color1 + ', ' + Color2 + ')';
	document.body.style.background = gradient;
}
function reset() {
	curr_time.textContent = '00:00';
	total_duration.textContent = '00:00';
	seek_slider.value = 0;
}
function toggleRandom() {
	isRandom = !isRandom;
	if (isRandom) {
		document.getElementById('randomized').classList.add('enabled');
	} else {
		document.getElementById('randomized').classList.remove('enabled');
	}
}
function repeatTrack() {
	let current_index = track_index;
	loadTrack(current_index);
	playTrack();
}
function playpauseTrack() {
	isPlaying ? pauseTrack() : playTrack();
}
function playTrack() {
	curr_track.play();
	isPlaying = true;
	track_art.classList.add('rotate');
	document.querySelectorAll(`[data-song-title]`).forEach(songbtn => {
		music_name = songbtn.getAttribute('data-song-title');
		console.log(music_name);
		console.log(music_list[track_index]['name']);
		if (music_name === music_list[track_index]['name']) {
			songbtn.textContent = 'pause_circle';
		} else {
			songbtn.textContent = 'play_circle';
		}
	});
	playpause_btn.textContent = 'pause';
}
function pauseTrack() {
	curr_track.pause();
	isPlaying = false;
	track_art.classList.remove('rotate');
	playpause_btn.textContent = 'play_arrow';
}
function nextTrack() {
	if (isRandom) {
		let randomIndex = Math.floor(Math.random() * music_list.length);
		if (track_index === randomIndex) {
			track_index += 1;
		} else {
			track_index = randomIndex;
		}
	} else {
		track_index += 1;
	}
	track_index = track_index % music_list.length;
	loadTrack(track_index);
	playTrack();
}
function prevTrack() {
	if (track_index > 0) {
		track_index -= 1;
	} else {
		track_index = music_list.length - 1;
	}
	loadTrack(track_index);
	playTrack();
}
function seekTo() {
	curr_track.currentTime = curr_track.duration * (seek_slider.value / 100);
}
function setVolume() {
	curr_track.volume = volume_slider.value / 100;
}
function setUpdate() {
	let seekPosition = 0;
	if (!isNaN(curr_track.duration)) {
		seekPosition = curr_track.currentTime * (100 / curr_track.duration);
		seek_slider.value = seekPosition;

		let currentMinutes = Math.floor(curr_track.currentTime / 60);
		let currentSeconds = Math.floor(
			curr_track.currentTime - currentMinutes * 60
		);
		let durationMinutes = Math.floor(curr_track.duration / 60);
		let durationSeconds = Math.floor(
			curr_track.duration - durationMinutes * 60
		);

		if (currentSeconds < 10) {
			currentSeconds = '0' + currentSeconds;
		}
		if (durationSeconds < 10) {
			durationSeconds = '0' + durationSeconds;
		}
		if (currentMinutes < 10) {
			currentMinutes = '0' + currentMinutes;
		}
		if (durationMinutes < 10) {
			durationMinutes = '0' + durationMinutes;
		}

		curr_time.textContent = currentMinutes + ':' + currentSeconds;
		total_duration.textContent = durationMinutes + ':' + durationSeconds;
	}
}
document.querySelector('aside').addEventListener('click', function () {
	this.classList.toggle('slide');
});
showMusicList();
loadTrack(track_index);
