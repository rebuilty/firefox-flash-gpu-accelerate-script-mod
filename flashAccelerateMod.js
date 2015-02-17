// ==UserScript==
// @name        Flash Accelerate Mod
// @namespace   nyanyh
// @description 开启FlashPlayer硬件渲染加速
// @include     *
// @version     1.05
// @grant       none
// ==/UserScript==
//Original post: http://bbs.kafan.cn/thread-1787542-1-1.html
//创意来自 gpu-accelerated-flash-player 扩展！
//只有当不存在 wmode 参数时才会开启加速
//关于wmode参数的解释：http://helpx.adobe.com/flash/kb/flash-object-embed-tag-attributes.html
//
var force_all = true;
var force_direct_gpu = true;
var wmodeValue = 'direct';
var delayTime = 0; //default = 1024 but no effect.Set to zero and problem solved.

setTimeout(function () {
  var objects = document.getElementsByTagName('object');
  var embeds = document.getElementsByTagName('embed');
  var has_wmode;
  //change css:display in order to refresh flash
  //CSS display attribute: http://www.w3school.com.cn/cssref/pr_class_display.asp
  var toggle = function (o) {
    if (o) {
      var display = o.style.display;
      o.style.display = 'none';
      setTimeout(function () {
        o.style.display = display;
      }, 0);
    }
  };
  //console.log(objects);
  if (objects.length > 0) {
    for (var i = 0; i < objects.length; i++) {
      has_wmode = false;
      for (var ii = 0; ii < objects[i].childNodes.length; ii++) {
        if (objects[i].childNodes[ii].name && objects[i].childNodes[ii].name.toLowerCase() == 'wmode') {
          has_wmode = true;
          if (force_all) {
            objects[i].childNodes[ii].value = wmodeValue;
            toggle(objects[i]);
          } 
          else if (force_direct_gpu && objects[i].childNodes[ii].value == 'direct') {
            objects[i].childNodes[ii].value = wmodeValue;
            toggle(objects[i]);
          }
          break;
        }
      }
      if (!has_wmode) {
        var param = document.createElement('param');
        param.name = 'wmode';
        param.value = wmodeValue;
        objects[i].appendChild(param);
        toggle(objects[i]);
      }
    }
  }
  if (embeds.length > 0) {
    for (var i = 0; i < embeds.length; i++) {
      if (force_all) {
        embeds[i].setAttribute('wmode', wmodeValue);
        toggle(embeds[i]);
      } 
      else if (force_direct_gpu && embeds[i].getAttribute('wmode') == 'direct') {
        embeds[i].setAttribute('wmode', wmodeValue);
        toggle(embeds[i]);
      } 
      else if (!embeds[i].getAttribute('wmode')) {
        embeds[i].setAttribute('wmode', wmodeValue);
        toggle(embeds[i]);
      }
    }
  }
}, delayTime);
