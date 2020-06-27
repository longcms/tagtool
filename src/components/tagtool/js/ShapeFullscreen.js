export default {
  fullscreen(el){
    var rfs = el.requestFullScreen 
    || el.webkitRequestFullScreen 
    || el.mozRequestFullScreen 
    || el.msRequestFullscreen
    if(typeof rfs != "undefined" && rfs) {
        rfs.call(el);
        return;
    }
  },
  exitFullscreen(){
    var el= document,
      cfs = el.cancelFullScreen 
      || el.webkitCancelFullScreen 
      || el.mozCancelFullScreen 
      || el.msExitFullscreen 
      || el.exitFullScreen
      if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
        return;
      }
  },
  fullscreenChange(fun){
    let self = this
    document.addEventListener('fullscreenchange', function(){ 
      fun && fun()
    });
    document.addEventListener('webkitfullscreenchange', function(){ 
      fun && fun()
    });
    document.addEventListener('mozfullscreenchange', function(){ 
      fun && fun()
    });
    document.addEventListener('MSFullscreenChange', function(){ 
      fun && fun()
    });
  },
  isFullScreen () {
    return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen || document.msFullscreenElement
  }
}