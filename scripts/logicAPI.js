test = 0;
//====================================initial function=================================
//return content, bookmarks, settings, chapters
var logic = new Object();
//server
function initial(userID,bookID,width,height,callback)
{
	//alert("initial check");
	//alert("width "+width);
	//alert("height" +height);
	logic.width = width;
	logic.height = height;
	logic.userID = userID;
	logic.bookID = bookID;
	logic.callback = callback;
	getSettings(userID,logicGetSettingsCallback);
}
function logicGetSettingsCallback(stgs)
{
	//alert("settings callback");
	//alert("settings font size "+stgs.font);
	//console.log("logic get settings callback");
	try{
		logic.settings = stgs;
		getHistory(logic.userID,logic.bookID,logicGetHistoryCallback);
	} catch (except){
		mode = 1;
		setCookie("mode",1);
	}
}
function logicGetHistoryCallback(htry)
{
	// alert("history callback");
	//alert("chapterID logic "+htry.chapterID);
	//console.log("logic get history callback");

	logic.history = htry;
	getBookmarkList(logic.userID,logic.bookID,logicGetBookmarkListCallback);
}
function logicGetBookmarkListCallback(bmkl)
{
	// alert("bookmark");
	//console.log("logic get bookmark list callback");
	logic.bookmarkList = bmkl;
	getChapterList(logic.userID, logic.bookID, logicGetChapterListCallback);
}
function logicGetChapterListCallback(chps)
{
	// alert("chapter list");
	//console.log("logic get chapter list callback");
	logic.chapterList = chps;
	getContent(logic.bookID,logic.history.chapterID,logic.history.lastPosition,logic.settings,logic.width,logic.height,logicGetChapterCallback);
}
function logicGetChapterCallback(cnt)
{
	//console.log("logic get chapter callback");
	logic.content = cnt;
	logic.callback(logic.settings,logic.bookmarkList,logic.chapterList,logic.content,logic.history);
}

//official
function checkExistenceOfLocalStorage()
{
	if(localStorage.getItem('userIDLocal')==null)
		return 0;
	else
		return 1;
}
function logicInitial(userID,bookID,width,height,mode,callback)
{
	if(test)
		mode = 0;

	if(mode==0) //offline
	{
		if(checkExistenceOfLocalStorage()==0)
		{
			alert("Nothing saved in localStorage");
			callbackDefaultValues(userID,bookID,callback);
		}
		else
		{
			if(userID != localStorage.getItem("userIDLocal"))
			{   
				alert("You are not the user we saved data for");
				callbackDefaultValues(userID,bookID,callback);
			}
			else
			{
				//console.log("logic init by local");
				initialByLocalStorage(userID,bookID,width,height,callback);
			}
		}
	}
	else
	{
	    try
		{
		    if(userID == localStorage.getItem("userIDLocal"))
		    {
		        syncWithServer();
			    initialByServer(userID,bookID,width,height,callback);
		    }
		    else
		    {
			//console.log("set up storage");
			
				setUpLocalStorage(userID,initialByServer(userID,bookID,width,height,callback));
			}
		}
			catch(e)
			{
				//alert("Please turn off private browsing");
			}
		}

}


function initialByLocalStorage(userID,bookID,width,height,callback)
{
	var settings = getSettingsForBookLocal();
	var history = getHistoryForBookLocal(bookID);
	//console.log(history);
	var bookmarkList = getBookmarkForBookLocal(bookID);
	var chapterID = history.chapterID;
	//console.log("get chapID in initial localStorage "+chapterID);
	var position = history.lastPosition;
	var content =  getContentForBookLocal(bookID,chapterID,position,width,height,settings);
	var chapterList = getChapterListForBookLocal(bookID);
	callback(settings,bookmarkList,chapterList,content,history);

}
function  initialByServer(userID,bookID,width,height,callback)
{
	initial(userID,bookID,width,height,callback);
}

function callbackDefaultValues(userID,bookID,callback)
{
	//console.log("logic callback default");
	//console.log("mode "+mode);

	var settings = new Object();
	settings.font = "Arial";
	settings.fontSize ="14";
	settings.textColor = "#000000";
	settings.backColor = "#f0f0f0";

	var hsty = new Object();
	hsty.lastTime = getCurrentTime();
	hsty.lastPosition = lastPosition;
	hsty.chapterID = chapterID;
	var bookmarkList = new Array();
	var chapterList = new Array();
	var content = new Object();
	content.pageNum = 0;
	content.chapNum = 1;
	content.title = "";
	content.pagesToDisplay = new Array();
	return content;
	callback(settings,bookmarkList,chapterList,content,hsty);
}
//==============================Settings API====================================================
function logicUpdateSettings(userID,font,fontSize,textColor,backColor,mode,callback)
{
	if(test)
		mode = 0;
	//console.log("logic update settings");
	//console.log("mode "+mode);

	if(mode==0) //offline
	{
		updateSettingsLocal(userID,font,fontSize,textColor,backColor);
		callback(1);
	}
	else
	{
		updateSettings(userID,font,fontSize,textColor,backColor,callback);
		try
		{
			updateSettingsLocal(userID,font,fontSize,textColor,backColor);
		}
		catch(e)
		{
		}
	}
}
//==============================Reading API====================================================
function logicGetContentForBook(bookID,chapterID,position,stgs,width,height,mode,callback)
{
	if(test)
		mode = 0;
	//console.log("logic get content for book "+bookID+" chapter "+chapterID);
	//console.log("mode "+mode);
	if(mode==0) //offline
	{
		var content = getContentForBookLocal(bookID,chapterID,position,width,height,stgs);
		callback(content);
	}
	else
	{
		//alert("Server get content");
		getContent(bookID,chapterID,position,stgs,width,height,callback);
	}
}
//==============================History API====================================================
function logicUpdateHistory(userID,bookID,chapterID,position,mode,callback)
{
   // console.log(callback);
	if(test)
		mode = 0;
	//console.log("mode "+mode);

	if(mode==0) //offline
	{
		console.log("logic update history");
		updateHistoryLocal(userID,bookID,position,chapterID);
		callback(1);
	}
	else
	{
		updateHistory(userID,bookID,chapterID,position,callback);
		try{
			updateHistoryLocal(userID,bookID,position,chapterID);
		}
		catch(e)
		{
		}
	}
}
//==============================Bookmark API==================================================
function logicCreateBookmark(userID,bookID,currentChapNum,position,comment,mode,callback)
{
	if(test)
		mode = 0;
	//console.log("mode "+mode);

	if(mode==0) //offline
	{
		addBookmarkLocal(userID,bookID,currentChapNum,position,comment,0);
		callback(1);
	}
	else
	{   
		createBookmark(userID,bookID,currentChapNum,position,comment,function(bkmkID){
		    try{
			    addBookmarkLocal(userID,bookID,currentChapNum,position,comment,bkmkID);
			    callback(1);
		    }
		    catch(e){}
		});
		
	}
}
function logicGetBookmarkListForBook(userID,bookID,mode,callback)
{
	if(test)
		mode = 0;
	//console.log("logic get bookmark list");
	//console.log("mode "+mode);

	if(mode==0)
	{
		var bookmarkList = getBookmarkForBookLocal(bookID);
		callback(bookmarkList);
	}
	else
	{
		getBookmarkList(userID,bookID,callback);
	}
}


//==============================Library API====================================================
function logicGetBooks(userID,mode,callback)
{
	if(test)
		mode = 0;
	//console.log("logic get books");
	//console.log("mode "+mode);
	if(mode==0)
	{
		var bookList = getBooksLocal();
		//console.log("get books local");
		callback(bookList);
	}
	else
	{
		getBooks(userID,callback);
	}
}
function logicSaveInLocalStorage(userID,bookID,callback)
{
	if(userID = localStorage.getItem("userIDLocal"))
	{
		//console.log("save book local");
		try{
		addNewBookLocal(bookID,callback);
		}
		catch(e)
			{
			    alert("Please turn off private browsing!");
			    callback(0);
			}
	}
	else
	{
		if(!localStorage.getItem("userIDLocal"))
		{
			//console.log("NO local storage when save new book");
			try{
				setUpLocalStorage(userID,addNewBookLocal(bookID,callback));
			}
			catch(e)
			{
			}
		}
	}
}
function logicAddNewBookLocal(userID,bookID,mode,callback)
{
	if(test)
		mode = 0;
	if(mode==0)
	{
		alert("Sorry you could only download the book to your device when are you online");
		callback(0);
	}
	else
	{
		//console.log("save book into local storage");
		try
		{
			logicSaveInLocalStorage(userID,bookID,callback);
		}
		catch(e)
		{
			
		}
	}
}
function logicDeleteBook(userID,bookID,mode,callback)
{
	if(test)
		mode = 0;
	if(userID==1)
	{
		console.log("Guest user can not delete book");
	}
	else
	{
		if(mode==0)
		{
			
				deleteBookLocal(bookID,callback);
			
		}
		else
		{
			
				deleteBook(userID,bookID,callback);
				try{
					deleteBookLocal(bookID,function(status){});
				}
				catch(e){}
			

		}
	}
}
function logicDeleteBookmark(userID,bookmarkID,mode,callback)
{
	if(test)
		mode = 0;
	if(userID==1)
	{
		//console.log("Guest user delete bookmark, disabled");
		callback(1);
	}
	else
	{
		if(mode==0)//offline mode
		{
			
				deleteBookmarkLocal(bookmarkID,callback);
		
		}
		else
		{
			deleteBookmark(bookmarkID,callback);
			try
			{
				deleteBookmarkLocal(bookmarkID,function(status){});
			}
			catch(e){}
		}
	}
}
function logicClearLocalStorage()
{
	localStorage.clear();
} 
function syncWithServer()
{   
		if(userID==1) return;   
        console.log("come in to sync~~~");
   		var settings = getSettingsForBookLocal();
        
	    $.ajax({
        url: "http://www.yunreading.com/sync/bookmark",
        type:"POST",
        dataType: "json",
        data:{ 
            u_id:userID,
            bm_list: getBookmarkListLocal(),
            delete_list:getDeleteBookmarkListLocal()
        },
        success: function(){
            console.log("Success");
            var bookIDList = JSON.parse(localStorage.getItem("bookIDList"));
            if(bookIDList!=null&&bookIDList.length!=0)
            getBookmarkLocal(userID,bookIDList[0],0,bookIDList.length);
            console.log(bookIDList.length);
        },
        error:function(){console.log("Error");}
        });

        $.ajax({
        url: "http://www.yunreading.com/sync/history",
        type:"POST",
        dataType: "json",
        data:{ 
        u_id:userID,
        history:getHistoryListLocal()
        },
        success: function(data){
        console.log("history sus");
        },
		error: function(){console.log("error");}
        });
        
        $.ajax({
        url: "http://www.yunreading.com/sync/settings",
        type:"POST",
        dataType: "json",
        data:{ 
        font:settings.font,
        font_size:settings.fontSize,
        text_color:settings.textColor,
        bg_color:settings.backColor,
        u_id:userID
        },
        
        success: function(data){
        console.log("success settings");  
        },
		error: function(){console.log("settings error");}
        });
        
     
   
}
