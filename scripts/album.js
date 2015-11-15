//Example Album

var albumPicasso = {
    name: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { name: 'Blue', length: '4:26' },
        { name: 'Green', length: '3:14' },
        { name: 'Red', length: '5:01' },
        { name: 'Pink', length: '3:21' },
        { name: 'Magenta', length: '2:15' }
    ]
};

//Another Example Album

var albumMarconi = {
  name: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { name: 'Hello, Operator?', length: '1:01' },
        { name: 'Ring, ring, ring', lenght: '5:01' },
        { name: 'Fits in your pocket', length: '3:21' },
        { name: 'Can you hear me now?', lenght: '3:14' },
        { name: 'Wrong phone number', length: '2:15' }
    ]
};

//My Example Album

var albumDeathCab = {
  name: 'Kintsugi',
    artist: 'Death Cab for Cutie',
    label: 'Atlantic Records',
    year: '2015',
    albumArtUrl: 'assets/images/album_covers/03.png',
    songs: [
        { name: 'No Room in Frame', length: '4:05' },
        { name: 'Black Sun', lenght: '4:49' },
        { name: 'The Ghosts of Beverly Drive', length: '4:03' },
        { name: 'Little Wanderer', lenght: '4:18' },
        { name: 'You\'ve Haunted Me All Night', length: '4:07' }
    ]
};

var createSongRow = function(songNumber, songName, songLength) {
  var template = 
      '<tr class="album-view-song-item">'
            +' <td class="song-item-number">' + songNumber + '</td>'
            +' <td class="song-item-title">' + songName + '</td>'
            +' <td class="song-item-duration">' + songLength + '<td>'
            +'</tr>'
            ;
    
    return template;
};

    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {
    //2
    albumTitle.firstChild.nodeValue = album.name;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
    //3
    albumSongList.innerHTML = '';
    //4
    for(var i = 0; i < album.songs.length; i++){
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
    }
};

window.onload = function(){
    setCurrentAlbum(albumPicasso);
    
    var albumList = [albumPicasso, albumMarconi, albumDeathCab];
    var next = 1;
    
    albumImage.addEventListener("click", function(event){
       setCurrentAlbum(albumList[next]);
        next++;
        if(next == albumList.length){
            next = 0;
        }
    });
};













