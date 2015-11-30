var setSong = function(songNumber) {
        if(currentSoundFile) {
            currentSoundFile.stop();
        }
        
        currentlyPlayingSongNumber = parseInt(songNumber);
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
            formats: [ 'mp3' ],
            preload: true
        });
    
        setVolume(currentVolume);
    };

var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 }

var setVolume = function(volume) {
  if(currentSoundFile) {
      currentSoundFile.setVolume(volume);
  }  
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number ="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
  var template = 
      '<tr class="album-view-song-item">'
            + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
            +' <td class="song-item-title">' + songName + '</td>'
            +' <td class="song-item-duration">' + filterTimeCode(songLength) + '<td>'
            +'</tr>'
            ;
    
    var $row = $(template);
    
    var clickHandler = function() {
        var songItemNumber = parseInt($(this).attr('data-song-number'), 10);
        
        if(currentlyPlayingSongNumber !== null) {
            var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
        }
        
        if(currentlyPlayingSongNumber !== songItemNumber){
            $(this).html(pauseButtonTemplate);
            setSong(songItemNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
            
            var volumeBar = $('.volume .fill');
            var volumeThumb = $('.volume .thumb');
            
            volumeBar.width(currentVolume + '%');
            volumeThumb.css({left: currentVolume + '%'});
            
        } else if (currentlyPlayingSongNumber === songItemNumber){
            if(currentSoundFile.isPaused()){
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
                
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
                
            }
          }
    };
    
    var onHover = function(event){
        var songItem = $(this).find('.song-item-number');
        var songItemNumber = parseInt(songItem.attr('data-song-number'), 10);
        
        
        if(songItemNumber !== currentlyPlayingSongNumber){
            songItem.html(playButtonTemplate);
        }
    };
    
    var offHover = function(event){
        var songItem = $(this).find('.song-item-number');
        var songItemNumber = parseInt(songItem.attr('data-song-number'), 10);
        
        if(songItemNumber !== currentlyPlayingSongNumber){
            songItem.html(songItemNumber);
        }
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


// sets the text of the element with the .current-time class 
// to the current time in the song

var setCurrentTimeInPlayerBar = function(currentTime) {
    var currentTimeItem = $('.seek-control .current-time');
    currentTimeItem.text(filterTimeCode(currentTime));
};


// sets the text of the element with the .total-time class
// to the length of the song

var setTotalTimeInPlayerBar = function(totalTime) {
    var totalTimeItem = $('.seek-control .total-time');
    totalTimeItem.text(filterTimeCode(totalTime));
};

// use the parseFloat() method to get the seconds in number form
// store the var for whole sec and whole min using Math.floor()
// return the time in the format X:XX

var filterTimeCode = function(timeInSeconds) {
    var songInSeconds = Number.parseFloat(timeInSeconds);
    
    var wholeMinutes = Math.floor(songInSeconds/60);
    var wholeSeconds = Math.floor(songInSeconds) - (60 * wholeMinutes);
    
    return wholeMinutes + ':' + wholeSeconds;
};


var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         currentSoundFile.bind('timeupdate', function(event) {
             var currentTime = this.getTime();
             var totalTime = this.getDuration();
             var seekBarFillRatio = currentTime / totalTime;
             var $seekBar = $('.seek-control .seek-bar');
             updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar(currentTime);
         });
         
     }
 };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {
         
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         
         var seekBarFillRatio = offsetX / barWidth;
 
         if($(this).parent().attr('class') == 'seek-control') {
             seek(seekBarFillRatio * currentSoundFile.getDuration());
         } else {
             setVolume(seekBarFillRatio * 100);
         }
         
         
         updateSeekPercentage($(this), seekBarFillRatio);
     });
    
    $seekBars.find('.thumb').mousedown(function(event) {
         
         var $seekBar = $(this).parent();
 
         
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;
             
             if($seekBar.parent().attr('class') == 'seek-control') {
                 seek(seekBarFillRatio * currentSoundFile.getDuration());
             } else {
                 setVolume(seekBarFillRatio);
             }
             
             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
 
         
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
 };


var trackIndex = function(album, song){
  return album.songs.indexOf(song);  
};

var nextSong = function(){        
    //Use trackIndex() to get the index of the current song, and increment the value
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var previousSongIndex = currentSongIndex + 1;
    currentSongIndex++;
    
    if(currentSongIndex >= currentAlbum.songs.length){
        currentSongIndex = 0;
    }
       
    //Set a new current song 

    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    //Update the player bar
        
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    //Update the HTML
    var currentSong = getSongNumberCell(currentlyPlayingSongNumber);
    var previousSong = getSongNumberCell(previousSongIndex);
    
    currentSong.html(pauseButtonTemplate);
    previousSong.html(previousSongIndex);
    
};

var previousSong = function() {
  
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    var previousSongIndex = currentSongIndex + 1;
    currentSongIndex--;
    
    if(currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    //Update the player bar
        
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
    //Update the HTML
    var currentSong = getSongNumberCell(currentlyPlayingSongNumber);
    var previousSong = getSongNumberCell(previousSongIndex);
    
    currentSong.html(pauseButtonTemplate);
    previousSong.html(previousSongIndex);
    
};



var updatePlayerBarSong = function(){
  
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentSongFromAlbum.length);
};



var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>'
var playerBarPauseButton = '<span class="ion-pause"></span>'

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;



$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    
    var $nextButton = $('.main-controls .next');
    var $previousButton = $('.main-controls .previous');
    
    $nextButton.click(nextSong);
    $previousButton.click(previousSong);
});










