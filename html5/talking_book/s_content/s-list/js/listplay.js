var _this = $(this);

(function(){
	var urls = location.search;
	var s_titlts = urls.split("&");
	 s_titlt = decodeURI(s_titlts[1]);
	 urlID = s_titlts[2];
    XMLHttpData(urls);
})();
//---------------------------------------------------【AJAX载入歌曲信息】
function XMLHttpData(urls){
	//var song;
	$.ajax({
		type: "get",
		url: "/LoveBabyDDXX/AlbumChildServlet"+urls,
		cache:"true",
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
		},
		success: function(data, textStatus){
			//console.log(data)
			var listcontent = data;
        	var listcontents =listcontent.split("*");            	 
			song = eval(listcontents[0]);
			urlData = listcontents[1];
            //发送故事列表的信息
            formatPlayer(song);
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(){
			alert('服务器连接异常!');
		}
	});	
	
}

//---------------------------------------------------【播放器初始化 绑定事件】
function formatPlayer(song){
	//console.log(song)
    var mEngine = new MUSICENGINE(song),
        mPlay = document.getElementById("musicEngine"),
        mPlayerSwitch = document.getElementById("musicPlayerSwitch"),
        play = document.getElementById("play"),
        pause = document.getElementById("pause"),
        next = document.getElementById("next"),
        prev = document.getElementById("prev"),
        nowVolume = document.getElementById("nowVolume"),
        nowMute = document.getElementById("nowMute"),
        //volume = document.getElementById("volume"),
        mute = document.getElementById("mute"),
        volumeSizeBg = document.getElementById("volumeSizeBg"),
        progressRateBg = document.getElementById("progressRateBg"),
        lyrics = document.getElementById("lyrics"),
        albumLists = document.getElementById("albumLists");

    //打开关闭
    mPlayerSwitch.onclick = function(){
        musicPlayerSwitch();
    };
    //播放
    play.onclick = function(){
        mEngine.toPlay("play");
    };
    //暂停
    pause.onclick = function(){
        mEngine.toPlay("pause");
    };
    //下一曲
    next.onclick = function(){
        if(mPlay.src != ""){
            mEngine.next();
        }
    };
    //上一曲
    prev.onclick = function(){
        if(mPlay.src != ""){
            mEngine.prev();
        }
    };
    //歌曲进度调节
    progressRateBg.onclick = function(event){
        if(mPlay.src != ""){
            var activeProgress = getSongProgress(event);
            mEngine.songProgressAdjust(activeProgress);
        }else{
            return false;
        }
    };
    //专辑列表
    albumLists.onclick = function(){
        mEngine.albumLists();
    };
    //事件冒泡，处理临时加入的元素事件
    document.getElementsByTagName("body")[0].onclick = function(event){
        var o = event ? event : window.event;
       // console.log(o.target)
        //关闭列表
        if(o.target.id === "closeList"){
            closeList();
            return false;
        }
    	
    	
        //返回列表，全部歌曲列表
        if(o.target.id === "cutoverList"){
            if(o.target.title === "返回列表"){
                //先关闭列表 然后点击专辑列表按钮实现跳转
                document.getElementById("albumLists").onclick();
                //在专辑列表中，多点击一下，实现关闭再打开
                document.getElementById("albumLists").onclick();
                //mEngine.formatAlbumLists();
                return false;
            }
            if(o.target.title === "专辑列表"){
                //先关闭列表 然后点击专辑列表按钮实现跳转
                document.getElementById("albumLists").onclick();
                mEngine.formatAlbumLists();
                return false;
            }
            if(o.target.title === "返回简介"){
               // mEngine.formatAllSongLists();
            	var urls = location.search;
			   location.href = '../s_content.html'+urls
                return false;
            }
        }

        //点击播放歌曲并生成播放列表
        if(o.target.parentNode){
            if(o.target.parentNode.className === "s-l"){
				//musicPlayerSwitch();
                //计算点击的歌曲&专辑引索
                musicIndex = mEngine.muiscIndexAndAlbumIndex(o.target.parentNode);
                //console.log(musicIndex)
				//生成引索，根据引索值播放歌曲
                mEngine.playIndex(musicIndex.songIndex);
                //突出当前播放歌曲
                currentlyPlayingSong();				
                return false;
            }
            if(o.target.parentNode.className =="s-l playIng"){
            	musicPlayerSwitch();
            }
        }

    };

    //歌词打开关闭
    lyrics.onclick = function(){
        lrcBoxSwitch();
    };

///////////////////////////////////////
    //显示专辑列表
    albumLists.onclick();
    lyrics.onclick();
    mPlayerSwitch.onclick();
///////////////////////////////////////
}

/**
 * 基本播放功能（播放，暂停，上一曲，下一曲）
 */

//---------------------------------------------------【构造函数 MUSICENGINE】
function MUSICENGINE(song){
    //创建播放器
    var musicEngine = document.createElement("audio");
    musicEngine.id = "musicEngine";
    document.getElementById("musicPlayerWrap").appendChild(musicEngine);
    //获取歌曲
    this.song = song;
    //获取播放器
    this.musicPlayer = document.getElementById("musicEngine");
    //载入完成
    this.musicPlayer.addEventListener("canplaythrough",function(){
        //歌词
        hide(document.getElementById("loadLrc"));
    });
}
//---------------------------------------------------【功能：播放&暂停】
MUSICENGINE.prototype.toPlay = function(toPlay){
    var play = document.getElementById("play"),
        pause = document.getElementById("pause");

    //播放第一首
    if(this.musicPlayer.src === ""){
        this.playIndex(0,0);
    }
    //如果媒体文件被暂停，则返回true
    if(toPlay === "play"){
        this.musicPlayer.play();
        this.playbackProgress("play");
        hide(play);
        show(pause);
    }
    if(toPlay === "pause"){
        this.musicPlayer.pause();
        this.playbackProgress("pause");
        show(play);
        hide(pause);
    }
};
//---------------------------------------------------【功能：下一曲】
MUSICENGINE.prototype.next = function(){
    //发送给songPlayMode()方法，让它处理如何播放下一首
    this.songPlayMode("next");
};

//---------------------------------------------------【功能：上一曲】
MUSICENGINE.prototype.prev = function(){
    //发送给songPlayMode()方法，让它处理如何播放下一首
    this.songPlayMode("prev");
};
//---------------------------------------------------【功能：播放进度，播放时间】
MUSICENGINE.prototype.playbackProgress = function(playSwitch){
    var progressRateColor = document.getElementById("progressRateColor"),
        songSchedule = 0,
        timeall,
        currenttime,
        timer;
	var progressRateWidth = $('#musicPlayerWrap').width();

    if(playSwitch === "play"){
        timer = setInterval(function(){
            var mPlayer = document.getElementById("musicEngine");
            //获取歌曲总时间
            timeall = timeAll();
            //获取歌曲当前播放时间
            currenttime = currentTime();
            //计算歌词滚动
            lrcMove(timeall,currenttime);
            //计算歌曲播放时间
            songPlaybackTime(timeall,currenttime);
            //计算进度条宽度并赋值

            songSchedule = (currenttime / timeall) * progressRateWidth;
			//console.log(songSchedule);
            progressRateColor.style.width = songSchedule + "px";
            //当歌曲播放完毕后
            if(mPlayer.ended){
                //清除定时器，进度条归零，播放下一首
                clearInterval(timer);
                progressRateColor.style.width = 0;
                //如果是单曲循环
                if(document.getElementById("nowPlayManner").title === "单曲循环"){
                    mPlayer.currentTime = 0;
                    mPlayer.play();
                }else{
                    //否则点击下一曲
                    document.getElementById("next").onclick();
                }
            }
        },1000);
    }

    if(playSwitch === "pause"){
        clearInterval(timer);
    }
};

//---------------------------------------------------【功能：歌曲进度调节】
MUSICENGINE.prototype.songProgressAdjust = function(time){
    this.musicPlayer.currentTime = time;

    //调整歌曲播放进度后，歌词到位
    lrcAtuoMove(time);
};

//---------------------------------------------------【歌曲进度变化过程】
function getSongProgress(event){
    var progressRateBg = document.getElementById("progressRateBg"),
        mplayer = document.getElementById("musicEngine"),
        progressBP,
        SongProgress;
	var progressRateWidth = $('#musicPlayerWrap').width();

    //获得距相对元素距离的百分比
    var coord = coordinate(event),
        offsetCoord_X = coord.coord_X;
    //计算进度条的宽度
    songScheduleChange(offsetCoord_X);
    //计算进度条的宽度百分比
    progressBP = progressBarPercentage(progressRateWidth,offsetCoord_X) / 100;
    //真实的歌曲进度数值
    SongProgress = progressBP * mplayer.duration;
    return SongProgress;
}

//---------------------------------------------------【歌曲进度条变化】
function songScheduleChange(size){
    var progressRateColor = document.getElementById("progressRateColor");
    progressRateColor.style.width = size + "px";
}

//---------------------------------------------------【获取歌曲总时间】
function timeAll(){
    var mPlayer = document.getElementById("musicEngine");
    if(mPlayer.currentTime != 0){
        return mPlayer.duration;
    }else{
        return 0;
    }
}

//---------------------------------------------------【获取歌曲当前播放时间】
function currentTime(){
    var mPlayer = document.getElementById("musicEngine");
    return mPlayer.currentTime;
}

//---------------------------------------------------【计算歌曲播放时间】
function songPlaybackTime(timeall,currenttime){
    var playTime = document.getElementById("playTime"),
        surplusTime = document.getElementById("surplusTime"),
        leftTime,
        rightTime;

    if(currenttime < timeall){
        //左边时间
        leftTime = parseInt(currenttime);
        //右边时间
        rightTime = parseInt(timeall - currenttime);
        //输出时间
        playTime.innerHTML = conversionTime(leftTime);
        surplusTime.innerHTML = "-" + conversionTime(rightTime);
    }else{
        //播放完毕
        playTime.innerHTML = "0:00";
        surplusTime.innerHTML = "-0:00";
    }
}

//---------------------------------------------------【将剩余秒数转化为标准格式】
function conversionTime(time){
    var surplusMinite,
        surplusSecond,
        cTime;
    //将剩余秒数转化为分钟
    surplusMinite = Math.floor((time / 60) % 60);
    //将剩余秒数转化为秒钟
    surplusSecond = Math.floor(time % 60);
    if(surplusSecond < 10){
        surplusSecond = "0" + surplusSecond;
    }
    cTime = surplusMinite + ":" + surplusSecond;
    return cTime;
}
//---------------------------------------------------【功能：打开&关闭专辑列表】
MUSICENGINE.prototype.albumLists = function(){
    //是否创建歌曲列表的父元素
	innerMusicList();
    //列表显示&隐藏
    var musicList = document.getElementById("musicList"),
        albumLists = document.getElementById("albumLists"),
        listWrap = document.getElementById("listWrap"),
        listName = document.getElementById("listName"),
        cutoverList = document.getElementById("cutoverList");

    if(albumLists.title === "打开专辑列表"){
        //打开前先把列表都关闭
        closeList();
        //列表的父元素显示隐藏
        removeClass(musicList,"hidden");
        //歌曲列表分类 - album
        listWrap.className = "list-wrap album";
        listWrap.parentNode.id="iscrollList"
        //listWrap.parents.className = "List-height"
        $("#listWrap").parent().removeClass().addClass("List-height");
        //歌曲列表名称
        listName.innerHTML = s_titlt;
        //显示返回专辑列表
        //cutoverList.innerHTML = "查看全部歌曲";
		cutoverList.title = "返回简介"
		cutoverList.innerHTML = "返回"
        cutoverList.className = "cutover-list";
        //打开歌曲列表icon常亮
        addClass(albumLists,"album-lists-hover");
        //打开歌曲列表icon的title变化
        albumLists.title = "关闭专辑列表";
        //生成专辑列表
        this.formatAlbumLists();
         
    }else{
        //如果点击的图标是点亮状态，则关闭列表
        if(albumLists.title === "关闭专辑列表"){
            closeList();
        }
    }
};
//---------------------------------------------------【点击专辑生成歌曲列表】
function formatInAlbumLists(child_id){


    var listWrap = document.getElementById("listWrap"),
        cutoverList = document.getElementById("cutoverList"),
        //albumNum = song.length,
        albumSongNum,
        html = "";
    $.ajax({
		type: "get",
		url: "/LoveBabyDDXX/AlbumVoiceServlet?a_child_id="+child_id+"&"+urlID,
		cache:"cache",
		beforeSend: function(XMLHttpRequest){
			//ShowLoading();
		},
		success: function(data, textStatus){
			var musiclistData =data.split("*");
			musiclist = eval(musiclistData[0]);
			if(musiclist[0].result){
				if(musiclist[0].result == "5"){	
					var want_pay = "want_pay=1";
					 _this.msgBox({
						  'msgType' :'Confirm',
						  'msgText' : '是否确认购买？' ,
				          'buttonOk' : '是' ,
				          'buttonCancel' : '否'
				        },respuesta);				
				    function respuesta( respuesta )
				    {
				    	if(respuesta == "true"){
				    		wantPpay(want_pay);
				    	}				    	
				    }			
				}else if(musiclist[0].result == "4"){
					 _this.msgBox({
				          'msgType' :'Alerta',
						  'msgText' : '积分不足，请充值！' ,
				          'buttonOk' : '好' 
				        });
				}				
			}else{
				createMusicList(musiclist);
			}			
		},
		complete: function(XMLHttpRequest, textStatus){
			//HideLoading();
		},
		error: function(){
			alert('连接超时!');
		}
	});	
  function wantPpay(want_pay){
  	$.ajax({
			type: "get",
			url: "/LoveBabyDDXX/AlbumVoiceServlet?a_child_id="+child_id+"&"+urlID+"&"+want_pay,
			cache:"true",
			beforeSend: function(XMLHttpRequest){
				//ShowLoading();
			},
			success: function(data, textStatus){
				console.log(data)
				var musiclistData =data.split("*");
				musiclists = eval(musiclistData[0]);
				createMusicList(musiclists);
			},
			complete: function(XMLHttpRequest, textStatus){
				//HideLoading();
			},
			error: function(){
				alert('服务器连接异常!');
			}
		});	
  }  
    //创建播放列表
    function createMusicList(musiclist){
    	var albumNum = musiclist.length;
    	for (i=0;i<albumNum;i++){
    		html += "<li class=\"s-l\">";
             html += "<span class=\"s-name\" title=\"" + musiclist[i].voice_name + "\">" + musiclist[i].voice_name + "</span>";
             html += "</li>";
    	}
        //先关闭列表 然后点击播放列表按钮实现跳转
        listWrap.className = "list-wrap song";
        //标识是否在专辑列表内，用于更新播放列表
        listWrap.attributes["data-temp"].nodeValue = "1";
        listWrap.parentNode.id = "iscrollLists";
        
        //显示返回专辑列表
        $("#listWrap").parent().removeClass().addClass("List-heights");
    	cutoverList.title = "返回列表"
        cutoverList.innerHTML = "返回";
        cutoverList.className = "cutover-list";
        listWrap.innerHTML = html;
        var musicPlayer =$("#musicPlayer");
        musicPlayer.css("z-index",9999);
        myScroll.refresh();  
        myScroll.destroy();
        iscrolls();
        //突出当前播放歌曲
        currentlyPlayingSong();
    }
}

//---------------------------------------------------【功能：生成专辑列表】
MUSICENGINE.prototype.formatAlbumLists = function(){
	var musicPlayer =$("#musicPlayer");
      	musicPlayer.css("z-index",1)
    var song = this.song,
        listWrap = document.getElementById("listWrap"),
        List_hg = listWrap.parentNode.className,
        albumNum = song.length,
        html = "";
      	//console.log(List_hg)
    //循环数据并插入
    for(var i=0;i<albumNum;i++){
        html += "<li class=\"s-l s-2\" id="+song[i].a_child_id+">";
        html += "<img src=\"" + urlData+""+song[i].a_child_pic + "\" class=\"album-cover\">";
        if(song[i].pay_count == 0){
        	html += "<span class=\"album-name\" title=\"" + song[i].a_child_name + "\"><span class=\"s-a\">" + song[i].a_child_name +"</span></span>";

        }else{
        	html += "<span class=\"album-name\" title=\"" + song[i].a_child_name + "\"><span class=\"speaker\">"+song[i].pay_count+"积分"+"</span><span class=\"s-a\">" + song[i].a_child_name +"</span></span>";
        }
        html += "<div class=\"album-cover-hover hidden\">";
        html += "<div class=\"mask\" title=\"\"></div>";
        html += "</div>";
        html += "</li>";
    }
    listWrap.innerHTML = html;
    if(window.myScrolls){
    	myScrolls.refresh();  
        myScrolls.destroy();
    }
    iscroll(List_hg);

    //给li元素绑定事件 双击事件 鼠标划上事件
    for(var m=0;m<listWrap.getElementsByTagName("li").length;m++){
        var dom = listWrap.getElementsByTagName("li")[m];
        //鼠标双击
        dom.onclick = function(){
        	var child_id = this.id;
            //生成专辑内歌曲列表
            formatInAlbumLists(child_id);
        };
    }
    	
    
   
    //突出当前播放歌曲
    currentlyPlayingSong();
};
//---------------------------------------------------【功能：根据歌曲的播放方式分配下首歌曲的引索】
MUSICENGINE.prototype.songPlayMode = function(direction){
    //获取歌曲引索(加一为了和歌曲数量保持一致)
	
    var //albumIndex = this.albumIndex + 1,
        songIndex = this.songIndex + 1,
        song,
        album;
        //获取歌曲总数
        musicNum = musiclist.length,
    //【列表循环】
    console.log(songIndex)
     console.log(musicNum)
        //下一曲
    
        if(direction === "next"){
        	console.log(direction);
        	if(songIndex === musicNum){
        		song = 1;
        	}else{        		
        		song = songIndex + 1;
        	}
        }
        //上一曲
        else if(direction === "prev"){
        	console.log(direction);
        	if(songIndex === 1){
        		song = musicNum;
        	}else{        		
        		song = songIndex - 1;
        	}
        }

    //发送新的引索值,减一为了发送真实引索值
    this.playIndex(song - 1);
    
};
//---------------------------------------------------【功能：计算点击的歌曲&专辑引索】
MUSICENGINE.prototype.muiscIndexAndAlbumIndex = function(activeSong){
	//console.log(musiclist)
	var _musiclist = musiclist,
        albumNum = musiclist.length,
        //点击歌曲的名称
        indexSongName = activeSong.childNodes[0].innerHTML,
        index = {};
	 //歌曲引索
	for (var i=0;i<albumNum;i++){
		if(indexSongName === _musiclist[i].voice_name){
            index.songIndex = i;
            break;
        }	
	}
    //返回引索
    return index;
};
//---------------------------------------------------【功能：根据系统返回的歌曲&专辑引索，准备播放器】
MUSICENGINE.prototype.playIndex = function(songIndex){
    var musicName = document.getElementById("musicName"),
        loadLrc = document.getElementById("loadLrc"),
        playTime = document.getElementById("playTime"),
        surplusTime = document.getElementById("surplusTime"),
        progressRateColor = document.getElementById("progressRateColor"),
        _musiclist = musiclist;
    //记录引索
    this.songIndex = songIndex;

    //显示正在载入中...并初始化进度条
   show(loadLrc);
    playTime.innerHTML = "0:00";
    surplusTime.innerHTML = "-0:00";
    progressRateColor.style.width = "0";
    //歌曲地址
    this.musicPlayer.src = urlData+""+_musiclist[songIndex].voice_file;
    //歌曲名称
    musicName.innerHTML = _musiclist[songIndex].voice_name;
    musicName.title = musicName.innerHTML;

    //播放
    this.toPlay("play");

    //歌词
   this.processingLyrics(_musiclist[songIndex].voice_lyric);
    //this.processingLyrics(urlData+"img/talking/lrc/世上只有妈妈好.lrc");
    //更新播放列表
   // this.updatePlaylist();

    //突出显示当前播放歌曲
    currentlyPlayingSong();
};

//---------------------------------------------------【关闭歌曲列表】
function closeList(){
    var musicList = document.getElementById("musicList"),
        albumLists = document.getElementById("albumLists"),
        listWrap = document.getElementById("listWrap");

    addClass(musicList,"hidden");
    //图标变暗
    removeClass(albumLists,"album-lists-hover");
    //图标的title
    albumLists.title = "打开专辑列表";
    //歌曲列表分类
    listWrap.className = "list-wrap";
}

//---------------------------------------------------【是否创建歌曲列表的父元素】
function innerMusicList(){

    if(!document.getElementById("musicList")){
        var musicListDom = document.createElement("div");
        musicListDom.id = "musicList";
        musicListDom.className = "music-list hidden";
        document.getElementsByTagName("body")[0].appendChild(musicListDom);
        //是否插入歌曲列表结构
        var html = "";
            html += "<div class=\"list-title\" id=\"header\">";
            html += "<h1 id=\"listName\"></h1>";
            html += "<span id=\"cutoverList\" class=\"cutover-list hidden\"></span>";
            html += "</div>";
            html += "<div id=\"iscrollList\"><ul id=\"listWrap\" class=\"list-wrap\" data-temp=\"\"></ul></div>";
        document.getElementById("musicList").innerHTML = "";
        document.getElementById("musicList").innerHTML = html;
    }
}
//---------------------------------------------------【显示当前播放歌曲】
function currentlyPlayingSong(){
    var list = document.getElementById("listWrap"),
        indexMusicName = document.getElementById("musicName").innerHTML,
        indexAlbumName = document.getElementById("albumName").innerHTML;

    for(var i=0;i<list.childNodes.length;i++){
        for(var j=0;j<list.childNodes.length;j++){
            removeClass(list.childNodes[j],"playIng");
        }
        //显示当前播放歌曲
        if(hasClass(list,"song")){
            if(list.childNodes[i].childNodes[0].innerHTML === indexMusicName){
                addClass(list.childNodes[i],"playIng");
                break;
            }
        }
    }
}

//---------------------------------------------------【播放器初始化】
function playerInitialization(){
    var  musicName = document.getElementById("musicName"),
        playTime = document.getElementById("playTime"),
        surplusTime = document.getElementById("surplusTime"),
        progressRateColor = document.getElementById("progressRateColor"),
        musicEngine = document.getElementById("musicEngine");

    musicName.innerHTML = "FeelPlayer";
    musicName.title = "FeelPlayer";
    albumName.innerHTML = "";
    albumName.title = "";
    musicEngine.src = "";
    playTime.innerHTML = "0:00";
    surplusTime.innerHTML = "-0:00";
    progressRateColor.style.width = "0";
    currentlyPlayingSong();
}
//---------------------------------------------------【功能：同步歌词】
MUSICENGINE.prototype.processingLyrics = function(lrc){
console.log(lrc)
    var lrcBox = document.getElementById("lrcBox");
    lrcBox.style.marginTop = 0; //初始化

    var xmlhttp,
        lrcVal,
        lrcArray = [],
        lrcTimeArray = [],
        html = "",
        musicName,
        singer;

    //ajax获取歌词lrc文件
    loadLrc(lrc);

    function loadLrc(url){
    	
        if(lrc === ""){
            //没有歌词
            lrcBox.innerHTML = "<div class=\"no-lrc\"><img src="+urlData+""+song[0].a_child_pic+"></div>";
        }else{
            xmlhttp = null;
            if(window.XMLHttpRequest){
                xmlhttp = new XMLHttpRequest();
            }
            //IE5,6
            else if(window.ActiveXObject){
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            if(xmlhttp != null){
                xmlhttp.onreadystatechange = getXMLHttpData;
                xmlhttp.open("get", url , true);
                xmlhttp.send(null);
            }else{
               // alert("您的浏览器不支持 XMLHTTP");
            }
        }

    }

    function getXMLHttpData(){
        if(xmlhttp.readyState === 4){
            if(xmlhttp.status === 0 || xmlhttp.status === 200){

                //获取歌词内容
                lrcVal = xmlhttp.responseText.replace(/\[\d\d:\d\d.\d\d]/g,"");
                lrcArray = lrcVal.split("\n");

                //歌曲名
                lrcArray[0].replace(/\[\w\w\:(.*?)\]/g,function(){
                    musicName = arguments[1] || "暂无";
                });

                //歌手
                lrcArray[1].replace(/\[\w\w\:(.*?)\]/g,function(){
                    singer = arguments[1] || "暂无";
                });

                //只保留歌词部分
                lrcArray.splice(0,4);

                //获取歌词时间轴
                xmlhttp.responseText.replace(/\[(\d*):(\d*)([\.|\:]\d*)\]/g,function(){

                    var min = arguments[1] | 0, //分
                        sec = arguments[2] | 0, //秒
                        realMin = min * 60 + sec; //计算总秒数

                    lrcTimeArray.push(realMin);
                });

                //将歌词装入容器
                for(var i=0;i<lrcTimeArray.length;i++){
                    html += "<p class=\"lrc-line\" data-timeLine=\"" + lrcTimeArray[i] + "\">" + lrcArray[i] + "</p>";
                }

                lrcBox.innerHTML = html;

            }else{
                alert("连接超时!");
            }
        }
    }
};
//---------------------------------------------------【计算歌词滚动】
function lrcMove(timeall,currenttime){
    //歌曲总时间 timeall
    //当前时间 currenttime
    var lrcBox = document.getElementById("lrcBox"),
        domList = lrcBox.getElementsByTagName("p"),
        timer,
        index,
        s,
        m = parseInt(lrcBox.style.marginTop.split("-")[1]) || 0;

    for(var i=0;i<domList.length;i++){
        //如果当前时间等于遍历的歌词的时间
        var dataTimeLine = parseInt(domList[i].attributes["data-timeLine"].nodeValue);

        //等到唱第一句歌词的时候再滚动
        if(dataTimeLine > 0 && dataTimeLine === parseInt(currenttime)){

            //当前歌词的下标
            index = i;

            //当前下标值和上次记录的下标值不同才滚动，一个下标值只滚动一次
            if(s != i){
                //记录下标值
                s = i;

                //歌词颜色变化
                for(var j=0;j<domList.length;j++){
                    removeClass(domList[j],"color");
                }
                if(index > 0){
                    addClass(domList[index],"color");
                }

                //歌词滚动
                clearInterval(timer);
                timer = setInterval(function(){
                    m += 1;
                    if(m >= index * 30){
                        clearInterval(timer);
                    }else{
                        lrcBox.style.marginTop = "-" + m + "px";
                    }
                },10);
            }
        }
    }
}

//---------------------------------------------------【调整歌曲播放进度后，歌词自动到位】
function lrcAtuoMove(time){
    var lrcBox = document.getElementById("lrcBox"),
        domList = lrcBox.getElementsByTagName("p"),
        songTime = parseInt(time),
        dataArr = [],
        MoveTime,
        e;

    //获取歌词时间数组
    for(var i=0;i<domList.length;i++){
        dataArr.push(domList[i].attributes["data-timeLine"].nodeValue);
    }

    //找到应该跳转的时间
    for(var j=0;j<dataArr.length;j++){
        //时间为数组里最后一个小于或等于它的数
        if(dataArr[j] > songTime){
            MoveTime = dataArr[j - 1];
            break;
        }
    }

    //找到下标index,跳转
    e = MoveTime ? dataArr.indexOf(MoveTime) : domList.length - 1;
    lrcBox.style.marginTop = "-" + parseInt(e) * 30 + "px";

    //歌曲颜色
    for(var k=0;k<domList.length;k++){
        removeClass(domList[k],"color");
    }
    if(e > 0){
        addClass(domList[e],"color");
    }
}
//---------------------------------------------------【计算进度条的百分比】
function progressBarPercentage(totalLength,actLage){
    //传入总长度totalLength和当前点击的坐标actLage
    var Result = (parseInt(actLage) / parseInt(totalLength)) * 100;
    return Math.ceil(Result);
}

//---------------------------------------------------【控制播放器打开隐藏】
function musicPlayerSwitch(){
	//alert(1111);
    var musicPlayer = document.getElementById("musicPlayerWrap"),
        playerSwitch = document.getElementById("musicPlayerSwitch"),
        musicList = document.getElementById("musicList"),
        timer = 0,
        n = -50,
        m = 0;
	var nw =$('#musicPlayerWrap').width();
    //打开播放器
    if(hasClass(playerSwitch,"on")){
        //替换类，用于判断播放器是否打开或隐藏
        replaceClass(playerSwitch,"on","off");
        clearInterval(timer);
        //播放器打开动画
        timer = setInterval(function(){
            n += 50;
            if(musicList){
                musicList.style.left = n + "px";
            }
            if(n >= 0){
                clearInterval(timer);
                //替换类，用于显示播放器打开或隐藏的三角按钮
                replaceClass(document.getElementById("playerSwitchBtn"),"switch-on","switch-off");
                playerSwitch.title = "隐藏播放器";
            }
        },10);
    }

    //隐藏播放器
    else if(hasClass(playerSwitch,"off")){
        replaceClass(playerSwitch,"off","on");
        clearInterval(timer);
        timer = setInterval(function(){
            m += 50;
            if(musicList){
                musicList.style.left = "-" + m + "px";
            }
            if(m >= nw){
                clearInterval(timer);
                replaceClass(document.getElementById("playerSwitchBtn"),"switch-off","switch-on");
                playerSwitch.title = "打开播放器";
            }
        },10);
    }
}

//---------------------------------------------------【控制歌词打开隐藏】
function lrcBoxSwitch(){
    var lyrics = document.getElementById("lyrics"),
        lrcWrap = document.getElementById("lrcWrap");

    //打开
    if(!hasClass(lyrics,"lyrics-hover")){
        lyrics.title = "关闭歌词";
        addClass(lyrics,"lyrics-hover");
        removeClass(lrcWrap,"hidden");
    }else{
        //隐藏
        lyrics.title = "打开歌词";
        removeClass(lyrics,"lyrics-hover");
        addClass(lrcWrap,"hidden");
    }
}

/**
 * 一些基础功能
 */

//---------------------------------------------------【检查元素是否含有某个特定的类，如果有，则返回true】
function hasClass(element,className){
    var classNum = element.className.split(" "),
        result;
    for(var i=0;i<classNum.length;i++){
        if(classNum[i] === className){
            result = true;
            break;
        }else{
            result = false;
        }
    }
    return result;
}

//---------------------------------------------------【为匹配的元素添加指定的类名】
function addClass(element,className){
    if(!hasClass(element,className)){
        element.className += " " + className;
    }
}

//---------------------------------------------------【为匹配的元素删除指定的类名】
function removeClass(element,className){
    if(hasClass(element,className)){
        var classNum = element.className.split(" ");
        for(var i=0;i<classNum.length;i++){
            if(classNum[i] === className){
                classNum.splice(i,1);
                element.className = classNum.join(" ");
                break;
            }
        }
    }
}

//---------------------------------------------------【为匹配的元素添加替换指定的类名】
function replaceClass(element,hasClassName,replaceClassName){
    if(hasClass(element,hasClassName)){
        var classNum = element.className.split(" ");
        for(var i=0;i<classNum.length;i++){
            if(classNum[i] === hasClassName){
                classNum[i] = replaceClassName;
                element.className = classNum.join(" ");
                break;
            }
        }
    }
}

//---------------------------------------------------【控制匹配的元素显示隐藏】
function show(element){
    element.style.display = "block";
}
function hide(element){
    element.style.display = "none";
}

//---------------------------------------------------【控制匹配的元素渐入渐出】
function fadeIn(element){
    var timer,
        opacity = 0;
    element.style.opacity = opacity;
    show(element);
    timer = setInterval(function(){
        opacity += 0.1;
        element.style.opacity = opacity;
        if(opacity === 10){
            clearInterval(timer);
        }
    },30);
}
function fadeOut(element){
    var timer,
        opacity = 1;
    element.style.opacity = opacity;
    timer = setInterval(function(){
        opacity -= 0.1;
        element.style.opacity = opacity;
        if(opacity === 0){
            clearInterval(timer);
        }
    },30);
    hide(element);
}

//---------------------------------------------------【让Firefox支持offsetX、offsetY】
//计算光标相对于第一个定位的父元素的坐标
function coordinate(e){
  var o = window.event || e,
      coord,
      coord_X,
      coord_Y;

  coord_X = (o.offsetX === undefined) ? getOffset(o).X : o.offsetX;
  coord_Y = (o.offsetY === undefined) ? getOffset(o).Y : o.offsetY;
  coord = { "coord_X" : coord_X , "coord_Y" : coord_Y };
  return coord;
}
function getOffset(e){
  var target = e.target, // 当前触发的目标对象
      eventCoord,
      pageCoord,
      offsetCoord;

  // 计算当前触发元素到文档的距离
  pageCoord = getPageCoord(target);

  // 计算光标到文档的距离
  eventCoord = {
    X : window.pageXOffset + e.clientX,
    Y : window.pageYOffset + e.clientY
  };

  // 相减获取光标到第一个定位的父元素的坐标
  offsetCoord = {
    X : eventCoord.X - pageCoord.X,
    Y : eventCoord.Y - pageCoord.Y
  };
  return offsetCoord;
}
function getPageCoord(element){
  var coord = { X : 0, Y : 0 };
  // 计算从当前触发元素到根节点为止，
  // 各级 offsetParent 元素的 offsetLeft 或 offsetTop 值之和
  while (element){
    coord.X += element.offsetLeft;
    coord.Y += element.offsetTop;
    element = element.offsetParent;
  }
  return coord;
}

function iscroll(){
	myScroll = new IScroll("#iscrollList",{mouseWheel:true,click:true,checkDOMChanges:true});
}
function iscrolls(){
	myScrolls = new IScroll("#iscrollLists",{mouseWheel:true,click:true});
	//
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
