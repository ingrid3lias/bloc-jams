var createSongRow = function(songNumber, songName, songLength) {
  var template = 
      '<tr class="album-view-song-item">'
            + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
            +' <td class="song-item-title">' + songName + '</td>'
            +' <td class="song-item-duration">' + songLength + '<td>'
            +'</tr>'
            ;
    
    var $row = $(template);
    
    var clickHandler = function() {
        var songItemNumber = parseInt($(this).attr('data-song-number'));
        
        if(currentlyPlayingSongNumber !== null) {
            var currentlyPlayingSongElement = $('.song-item-number[data-song-number ="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
        }
        
        if(currentlyPlayingSongNumber !== songItemNumber){
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songItemNumber;
            currentSongFromAlbum = currentAlbum.songs[songItemNumber - 1];
            updatePlayerBarSong();
            
        } else if (currentlyPlayingSong === songItemNumber){
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton)
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
          }
    };
    
    var onHover = function(event){
        var songItem = parseInt($(this).find('.song-item-number'));
        var songItemNumber = parseInt(songItem.attr('data-song-number'));
        
        if(songItemNumber !== currentlyPlayingSongNumber){
            songItem.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event){
        var songItem = parseInt($(this).find('.song-item-number'));
        var songItemNumber = parseInt(songItem.attr('data-song-number'));
        
        if(songItemNumber !== currentlyPlayingSongNumber){
            songItem.html(songItemNumber);
        }
        console.log("songNumber type is" + typeof songNumber + "\n and currentlyPlayingSongNumber Type is " + typeof currentlyPlayingSongNumber);
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    $albumTitle.text(album.name);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year = ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    $albumSongList.empty();
    
    for (var i = 0; i < album.songs.length; i++){
        var $newRow = createSongRow(i +1, album.songs[i].name, album.songs[i].length);
        $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song){
  return album.songs.indexOf(song);  
};

var updatePlayerBarSong = function(){
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentSongFromAlbum.artist);
    $('.currently-playing .artist-name').text(currentSongFromAlbum.artist);
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
};


var nextSong = function(){
    
    //Know what the previous song is
    
    var previousSongNumber = function(index) {
        if(index === currentAlbum.songs.length){
            index = 0;
        }
        return index;
    };
        
    //Use trackIndex() to get the index of the current song, and increment the value
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if(currentSongIndex >= currentAlbum.songs.length){
        currentSongIndex = 0;
    };
       
    //Set a new current song 
    
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
        
    //Update the player bar
        
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentSongFromAlbum.artist);
    $('.currently-playing .artist-name').text(currentSongFromAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    //Update the HTML
    var previousSong = ;
    var newSong = ;
    
};
    
var previousSong = function() {
    
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
    
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});













