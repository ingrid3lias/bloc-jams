function forEach(array, callback){
    for(var i = 0; i < array.length; i++){
      callback.apply(null, [array[i]]);  
    }  
}