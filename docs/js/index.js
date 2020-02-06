var domain = 'https://www.livlog.xyz/webapi/';
//var domain = 'http://localhost:8080/';
var urls = {
  getHistory: domain + 'getHistory',
  getPlan: domain + 'getPlan',
  getTourspot: domain + 'getTourspot',
  getEkispertUrl: domain + 'getEkispertUrl'
}

var param = {};
window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page).then(menu.close.bind(menu));
};

document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'period') {
    page.querySelector('#push-period-0').onclick = function() {
      param.period = 0;
      param.periodText = '日帰り';
      document.querySelector('#myNavigator').pushPage('keyword.html');
    };
    page.querySelector('#push-period-1').onclick = function() {
      param.period = 1;
      param.periodText = '1泊2日';
      document.querySelector('#myNavigator').pushPage('keyword.html');
    };
    page.querySelector('#push-period-2').onclick = function() {
      param.period = 2;
      param.periodText = '2泊3日';
      document.querySelector('#myNavigator').pushPage('keyword.html');
    };
    page.querySelector('#push-period-3').onclick = function() {
      param.period = 3;
      param.periodText = '3泊4日';
      document.querySelector('#myNavigator').pushPage('keyword.html');
    };
    page.querySelector('#push-period-4').onclick = function() {
      param.period = 4;
      param.periodText = '4泊5日';
      document.querySelector('#myNavigator').pushPage('keyword.html');
    };
    page.querySelector('#push-period-9').onclick = function() {
      param.period = 9;
      param.periodText = '散歩';
      document.querySelector('#myNavigator').pushPage('keyword.html');
    };
  } else if (page.id === 'keyword') {
    page.querySelector('#push-keyword-all').onclick = function() {
      param.keyword = 'すべて';
      document.querySelector('#myNavigator').pushPage('siori.html');
    };
    page.querySelector('#push-keyword-gourmet').onclick = function() {
      param.keyword = 'グルメ';
      document.querySelector('#myNavigator').pushPage('siori.html');
    };
    page.querySelector('#push-keyword-photo').onclick = function() {
      param.keyword = '写真';
      document.querySelector('#myNavigator').pushPage('siori.html');
    };
    page.querySelector('#push-keyword-healing').onclick = function() {
      param.keyword = '癒し';
      document.querySelector('#myNavigator').pushPage('siori.html');
    };
    page.querySelector('#push-keyword-adventure').onclick = function() {
      param.keyword = '冒険';
      document.querySelector('#myNavigator').pushPage('siori.html');
    };
    page.querySelector('#push-keyword-season').onclick = function() {
      param.keyword = '季節';
      document.querySelector('#myNavigator').pushPage('siori.html');
    };
  } else if (page.id === 'siori') {
    var modal = document.querySelector('ons-modal');
    modal.show();
    clickMakeSiori();
  } else if (page.id === 'history') {
    clickMakeHistory();
  }
});

document.addEventListener('show', function(event) {
  var page = event.target;

  if (page.id === 'period') {
  } else if (page.id === 'keyword') {
  } else if (page.id === 'siori') {
    page.querySelector('ons-toolbar .center').innerHTML = param.periodText
    + "、" + param.keyword + "の旅";
    var toolbarHeight = $('ons-toolbar').height();
    var tabHeight = $('ons-tab').height();
    var sioriHeight = $('#siori').height();
    $('#canvas').height(sioriHeight - tabHeight - toolbarHeight);
  } else if (page.id === 'siori2') {
    page.querySelector('ons-toolbar .center').innerHTML = param.periodText
    + "、" + param.keyword + "の旅";
    var toolbarHeight = $('ons-toolbar').height();
    var tabHeight = $('ons-tab').height();
    var sioriHeight = $('#siori').height();
    $('#canvas').height(sioriHeight - tabHeight - toolbarHeight);
  }
});

//履歴作成クリック
function clickMakeHistory() {

  var modal = document.querySelector('ons-modal');
  modal.show();

  var uid = localStorage.getItem('uid');
  $.getJSON(urls.getHistory, {
    "uid" : uid,
  }, function(data, status) {

    var historyList = $('#historyList');
    historyList.empty();

    for (var i = 0; i < data.history.length; i++) {
      var history = data.history[i]
      var periodName = getPeriodName(history.period);

      var html = '';
      html += '<ons-list-item modifier="chevron" tappable onclick="clickReMakeSiori('
        + "'" + history.planId + "','" + history.period + "','" + history.keyword + "'" + ');">';
      html += '<div class="left" style="width: 40px;" align="center">';
      if ('すべて' == history.keyword) {
        html += '<i class="icon-0"></i>';
      } else if ('グルメ' == history.keyword) {
        html += '<i class="icon-1"></i>';
      } else if ('写真' == history.keyword) {
        html += '<i class="icon-2"></i>';
      } else if ('癒し' == history.keyword) {
        html += '<i class="icon-3"></i>';
      } else if ('冒険' == history.keyword) {
        html += '<i class="icon-4"></i>';
      } else if ('季節' == history.keyword) {
        html += '<i class="icon-5"></i>';
      }
      html += '</div>';
      html += '<div class="center">';
      html += '<span class="list-item__title">' + periodName + '、' + history.keyword +'の旅</span>';
      html += '<span class="list-item__subtitle">' + history.createDate + '</span>';
      html += '</div>';
      html += '</ons-list-item>';
      historyList.append(html);
    }

    var modal = document.querySelector('ons-modal');
    modal.hide();
  });
}

//しおり再作成クリック
function clickReMakeSiori(planId, period, keyword) {

  fn.load('siori2.html');
  var modal = document.querySelector('ons-modal');
  modal.show();

  param.period = period;
  param.periodText = getPeriodName(period);
  param.keyword = keyword;

  initMap();

  var uid = localStorage.getItem('uid');
  var vLat = startLat;
  var vLng = startLng;
  $.getJSON(urls.getPlan, {
    "planId" : planId,
    "uid" : uid,
  }, function(data, status) {
    console.log(data);
    var modal = document.querySelector('ons-modal');
    modal.hide();

    // 地図アニメーションスタート
    $('#canvas').css('opacity', 1);
    setTimeout(startMapAnimation(data.points), 1000);
  });
}

//document.addEventListener('prechange', function(event) {
//  var tab = event.index;
//  if (tab === 0) {
//    // > 地図の場合
//    console.log('地図');
//  } else if (tab === 1) {
//    // > しおりの場合
//    console.log('しおり');
//  }
//});
//
//document.addEventListener('postchange', function(event) {
//  var tab = event.index;
//  if (tab === 0) {
//    // > 地図の場合
//    console.log('地図');
//  } else if (tab === 1) {
//    // > しおりの場合
//    console.log('しおり');
//  }
//});

var mymap = null;
var startLat = 35.161089;
var startLng = 136.882396;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
  // 取得成功した場合
  function(position) {
    startLat = position.coords.latitude;
    startLng = position.coords.longitude;
  });
}

// MAP初期化
function initMap() {
  $('#canvas').html("");
  $('#canvas').css('opacity', 0);

  $('#list').html("");

}

// しおり作成クリック
function clickMakeSiori() {
  initMap();

  var uid = localStorage.getItem('uid');
  var vLat = startLat;
  var vLng = startLng;
  $.getJSON(urls.getTourspot, {
    "lat" : vLat,
    "lng" : vLng,
    "nights" : param.period,
    "keywords" : param.keyword,
    "uid" : uid,
  }, function(data, status) {
    console.log(data);
    var modal = document.querySelector('ons-modal');
    modal.hide();
    // ユーザーIDの保持
    localStorage.setItem('uid', data.userId);
    // 地図アニメーションスタート
    $('#canvas').css('opacity', 1);
    setTimeout(startMapAnimation(data.points), 1000);
  });
}

// 地図アニメーション開始
function startMapAnimation(data) {
 
  // マップオブジェクト作成
  mymap = L.map('canvas',{
    center: [startLat,startLng],
    zoom: 11
  });
  
  // 地図タイルデータ指定
  L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '<a href="https://osm.org/copyright">OpenStreetMap</a>'
  }).addTo(mymap);
  // スケール表示
  L.control.scale({imperial:false}).addTo(mymap);

  // スタート地点のマーカーセット
  L.marker([startLat,startLng]).addTo(mymap);

  // 全体の範囲初期化
  rect = {
    min: [startLat,startLng],
    max: [startLat,startLng],
  };

  // 次のポイントのアニメーションセット
  setTimeout(nextMapAnimation(0, data), 1000);
}
// 地図アニメーション次のポイント
function nextMapAnimation(count, data) {
  console.log("count:" + count);
  if (data == null) {
    alert('もう一度、プランを選択してください。');
    return;
  }

  setTimeout(function() {
    var p = [startLat,startLng];
    var name = "GOAL"
    var oldLatLng = [startLat,startLng];

    // まだゴールでなければポイントデータ取得
    if (count < data.length) {
      p = [data[count].lat, data[count].lng];
      name = data[count].name1;
    }
    // 前回のポイント取得
    if (count > 0) {
      oldLatLng = [data[count-1].lat, data[count-1].lng]
    }

    // 全体の範囲更新
    if (p[0] < rect.min[0])
      rect.min[0] = p[0];
    else if (p[0] > rect.max[0])
      rect.max[0] = p[0];
    if (p[1] < rect.min[1])
      rect.min[1] = p[1];
    else if (p[1] > rect.max[1])
      rect.max[1] = p[1];

    // 地図の位置更新（Zoom値は2点間が収まるズーム+1）
    var zoom = mymap.getBoundsZoom([oldLatLng, p ]);
    mymap.flyTo(p, zoom+1);

    // マーカーセット
    L.marker(p)
      .bindTooltip(name,{permanent:true})
      .addTo(mymap)
    ;

    // 2点間を結ぶ線を描画
    L.polyline([oldLatLng, p ], {
      color: "#ffa500",
      weight: 8,
      opacity: 0.5,
    }).addTo(mymap);

    // 次のアニメーションをセット
    if (count + 1 <= data.length) {
      nextMapAnimation(count + 1, data);
    } else {
      zoomMapRect(); // ズームを全体に設定
      makeSioriAll(data);
    }
  }, 2000);
}

// マップを全体表示できるズームに
function zoomMapRect() {
  mymap.flyToBounds([rect.min, rect.max]);
}

function makeSioriAll(data) {

  var timeline = $('.main-timeline');
  timeline.empty();

  var html = '';
  html += '<div class="timeline">';
  html += '<div class="timeline-icon"></div>';
  html += '<div class="timeline-content right">';
  html += '<span class="date">スタート</span>';
  html += '<h4 class="title"></h4>';
  html += '</div>';
  html += '</div>';
  timeline.append(html);

  var oldDay = 0;
  var lat1 = 0;
  var lng1 = 0;
  var lat2 = 0;
  var lng2 = 0;
  for (var i = 0; i < data.length; i++) {

    var day = 0;
    var half = '';
    if (param.period <= 1) {
      day = Math.floor((i / 2) + 1);
      if (oldDay == day) {
        half = '後半';
      } else {
        half = '前半';
      }
    } else {
      day = i + 1;
    }

    var searchUrl = 'https://www.google.co.jp/search?q=';
    if (data[i].pref) {
      searchUrl += data[i].pref;
    }
    if (data[i].city) {
      searchUrl += data[i].city;
    }
    if (data[i].street) {
      searchUrl += data[i].street;
    }
    searchUrl += ' ';
    if (data[i].name1) {
      searchUrl += data[i].name1;
    }

    var mapUrl = 'https://www.google.com/maps/search/';
    if (data[i].pref) {
      mapUrl += data[i].pref;
    }
    if (data[i].city) {
      mapUrl += data[i].city;
    }
    if (data[i].street) {
      mapUrl += data[i].street;
    }
    mapUrl += ' ';
    if (data[i].name1) {
      mapUrl += data[i].name1;
    }

    if (i == 0) {
      // > 最初の場合
      lat1 = startLat;
      lng1 = startLng;
      lat2 = data[i].lat;
      lng2 = data[i].lng;
    } else {
      lat1 = data[i-1].lat;
      lng1 = data[i-1].lng;
      lat2 = data[i].lat;
      lng2 = data[i].lng;
    }

    html = '';
    html += '<div class="timeline">';
    html += '<div class="timeline-icon"></div>';
    if (i % 2 == 0) {
      html += '<div class="timeline-content">';
    } else {
      html += '<div class="timeline-content right">';
    }
    if (param.period == 9) {
      html += '<span class="date">' + day + 'ヶ所目 </span>';
    } else {
      html += '<span class="date">' + day + '日目 ' + half + ' </span>';
    }
    html += '<h4 class="title">' + data[i].name1 + '</h4>';
    html += '<p class="description">';
    if (data[i].descs.length > 0) {
      html += data[i].descs[0];
    }
    html += '</p>';
    html += '<a onclick="clickMakeEkispertUrl(' + lat1 + ',' + lng1 + ',' + lat2 + ',' + lng2 + ',this)" '
    html += 'class="fab eki-button" target="_blank"><img src="images/ekispert-logo.png" width="30" style="margin: 12px;"></a>';
    html += '&nbsp;&nbsp;';
    html += '<a href="' + searchUrl + '" '
    html += 'class="fab search-button" target="_blank"><img src="images/icons8-google-50.png" width="30" style="margin: 12px;"></a>';
    html += '&nbsp;&nbsp;';
    html += '<a href="' + mapUrl + '" '
    html += 'class="fab map-button" target="_blank"><img src="images/icons8-google-maps-50.png" width="30" style="margin: 12px;"></a>';
    html += '</div>';
    html += '</div>';
    timeline.append(html);

    if (i == (data.length - 1)) {
      lat1 = data[i].lat;
      lng1 = data[i].lng;
      lat2 = startLat;
      lng2 = startLng;

      i++;
      html = '';
      html += '<div class="timeline">';
      html += '<div class="timeline-icon"></div>';
      if (i % 2 == 0) {
        html += '<div class="timeline-content">';
      } else {
        html += '<div class="timeline-content right">';
      }
      html += '<span class="date">ゴール</span>';
      html += '<h4 class="title"></h4>';
      html += '<a href="#" onclick="clickMakeEkispertUrl(' + lat1 + ',' + lng1 + ',' + lat2 + ',' + lng2 + ',this)" '
      html += 'class="fab eki-button" target="_blank"><img src="images/ekispert-logo.png" width="30" style="margin: 12px;"></a>';
      html += '</div>';
      html += '</div>';
      timeline.append(html);
    }


    oldDay = day;
  }

  timeline.append('<div style="height: 5em;"></div>');
}

function clickName(id) {
  console.log($(id).css("max-height"));

  if ($(id).css("max-height") != "0px") {
    $(id).css("max-height", 0);
  } else {
    $(id).css("max-height", 10000);
  }
}

//URL作成クリック
function clickMakeEkispertUrl(lat1, lng1, lat2, lng2, my) {

  var formdata = {
      'from' : lat1 + ',' + lng1,
      'to' : lat2 + ',' + lng2,
  }
  var json = $.ajax({
    url: urls.getEkispertUrl,
    type: 'GET',
    data: formdata,
    dataType: 'json',
    async: false
  }).responseText;
  var data = JSON.parse(json);

  console.log(data);
  if (data.url) {
//    window.open(data.url, '_blank');
    my.href = data.url;
  } else {
    alert('ルートが見つかりませんでした。');
  }
}

// 宿泊日数を文字に置き換える
function getPeriodName(period) {

  var periodName = '';

  if (period == 0) {
    periodName = '日帰り';
  } else if (period == 1) {
    periodName = '1泊2日';
  } else if (period == 2) {
    periodName = '2泊3日';
  } else if (period == 3) {
    periodName = '3泊4日';
  } else if (period == 4) {
    periodName = '4泊5日';
  } else if (period == 9) {
    periodName = '散歩';
  }

  return periodName;
}

/**
 * オブジェクトの中身を表示
 * @param obj
 */
function printProperties(obj) {
    var properties = '';
    for (var prop in obj){
        properties += prop + '=' + obj[prop] + '\n';
    }
    console.log(properties);
}
