/*
 * @param m_this当前对象
 * @param id展示图片id
 * @param wid压缩后宽度
 * @param quality压缩质量 
 * */
function cutImageBase64(m_this, id, wid, quality) {
  var file = m_this.files[0];
  var URL = window.URL || window.webkitURL;
  var blob = URL.createObjectURL(file);
  var base64;

  var img = new Image();
  img.src = blob;
  img.onload = function () {
    var that = this;

    //生成比例
    var w = that.width,
      h = that.height,
      scale = w / h;
    w = wid || w;
    h = w / scale;

    //生成canvas
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    $(canvas).attr({
      width: w,
      height: h
    });
    ctx.drawImage(that, 0, 0, w, h);

    // 生成base64            
    base64 = canvas.toDataURL('image/jpeg', quality || 0.8);

    $(id).attr('src', base64);
  };
}



//调用 
$(id).on('change', function () {
  var m_this = this;
  cutImageBase64(m_this, '#com_ImgPr03', 400, 0.8);
})
