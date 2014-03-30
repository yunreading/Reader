var IP = "http://www.yunreading.com";
var TOTALBOOKS = 10;
var downloadBookCallback = "";

function setUpLocalStorage(userID,callback)
{
	try 
	{
		localStorage.setItem("lastUsed", getCurrentTime); 
		localStorage.setItem("userIDLocal",userID);
		localStorage.setItem("bookmarkCount",0);
		var booklist = new Array();
		localStorage.setItem("bookIDList",JSON.stringify(booklist));
		if(userID==1)
		{
			var settings = new Object();
			settings.font = "Arial";
			settings.fontSize ="14";
			settings.textColor = "#000000";
			settings.backColor = "#f0f0f0";
		}
		else
		{
			getSettingsLocal(userID,callback);
		}

	} 
	catch (e) 
	{
		if (e == QUOTA_EXCEEDED_ERR) 
		{
			console.log('Quota exceeded!');
		}
		else
		{
			console.log('Fail in setUpLocalStorage');
		}

	}
}
//===================================Ajax call functions===============================

function getSettingsLocal(userID,callback)
{

	var url = IP+"/user/"+userID+"/setting";
	var jqxhr = $.getJSON(url, function(data) 
			{
			getSettingsLocalCallback(data,callback);
			})
	.error(function() { 
			var settings = new Object();
			settings.font = "Arial";
			settings.fontSize ="14";
			settings.textColor = "#000000";
			settings.backColor = "#f0f0f0";
			callback(settings);
			})
}
function getSingleBookmarkLocal(userID,bookID,callback)
{
	var url = IP+"/user/"+userID+"/book/"+bookID+"/bookmark/0";
	var jqxhr = $.getJSON(url, function(data) 
			{
			getSingleBookmarkLocalCallback(userID,bookID,data);
			})
	.error(function() { callback(0);})
}
function getSingleBookChapterLocal(bookID,chapterID,totalChapter)
{
	var url = IP+"/book/"+bookID+"/chapter/"+chapterID;
	var jqxhr = $.getJSON(url, function(data) 
			{
			getSingleBookChapterLocalCallback(bookID,chapterID,totalChapter,data);

			})
	.error(function() { console.log("Fail"); callback(0);})

}
function getSingleBookInfoLocal(userID,bookID)
{
	var url = IP+"/book/"+bookID;
	var jqxhr = $.getJSON(url, function(data) 
			{
			getSingleBookInfoLocalCallback(userID,bookID,data);
			})
	.error(function() { console.log("Error in get book info"); })
}

function getSingleBookHistoryLocal(userID,bookID)
{
	var url = IP+"/user/"+userID+"/book/"+bookID;
	var jqxhr = $.getJSON(url, function(data) 
			{
			getSingleBookHistoryLocalCallback(userID,bookID,data);
			})
	.error(function() { callback(0); })
}
//===================================Ajax Callback function============================
function getSettingsLocalCallback(data,callback)
{
	try{
		var settings = new Object();
		settings.font = data["font"];
		settings.fontSize = data["font_size"];
		settings.textColor = data["text_color"];
		settings.backColor = data["bg_color"];
		localStorage.setItem("settings",JSON.stringify(settings));
	}
	catch(e)
	{
		callback(0);
	}
}
function getSingleBookmarkLocalCallback(userID,bookID,data)
{
	bookmarkList  = new Array();
	for (var i=0;i<data.length;i++)
	{
		var bk = data[i];
		var temp = new Object();
		temp.chapterID = bk["c_id"];
		temp.markID = bk["bm_id"];
		temp.position = bk["position"];
		temp.name = bk["name"];
		bookmarkList[i] = temp;
	}
	localStorage.setItem("bookmark_"+bookID,JSON.stringify(bookmarkList));
	var book = JSON.parse(localStorage.getItem("book_"+bookID));
	var total = book.totalChapter;
	getSingleBookChapterLocal(bookID,1,total);
}
function getSingleBookInfoLocalCallback(userID,bookID,data)
{

	var bk = data;
	//console.log(data);
	var temp = new Object();
	temp.title = bk["title"];
	temp.bookID = bk["b_id"];
	temp.desp = bk["description"];
	temp.author = bk["author"];
	temp.cover = bk["image"];
	temp.type = bk["type"];
	temp.totalChapter = bk["totalChapter"];
	temp.popularity = bk["popularity"];
	localStorage.setItem("book_"+bookID,JSON.stringify(temp));
	getSingleBookHistoryLocal(userID,bookID);
}

function getSingleBookHistoryLocalCallback(userID,bookID,data)
{
	var bk = data;
	var hsty = new Object();
	hsty.lastTime = bk["lastTime"];
	hsty.lastPosition = bk["lastPosition"];
	hsty.chapterID = bk["c_id"];
	localStorage.setItem("history_"+bookID,JSON.stringify(hsty));
	//console.log("history saved for bookID"+bookID);
	//console.log(hsty);
	getSingleBookmarkLocal(userID,bookID);
}

function getSingleBookChapterLocalCallback(bookID,chapterID,totalChapter,data)
{
    try
    {
	    localStorage.setItem("book_"+bookID+"chapter_"+chapterID,JSON.stringify(data));
	    if(chapterID<totalChapter)
		    getSingleBookChapterLocal(bookID,chapterID+1,totalChapter);
	    else
	    {
		    localStorage.setItem("book_done_"+bookID,1);
		    downloadBookCallback(1);
	    }
	}
	catch(e)
	{
	    downloadBookCallback(0);
	}
}
//===================================Update function==================================
function addNewBookLocal(bookID,callback)
{
	downloadBookCallback = callback;
	localStorage.setItem("lastUsed", getCurrentTime); 
	var bookIDList = JSON.parse(localStorage.getItem("bookIDList"));
	var count = 0;
	for(var i=0;i<bookIDList.length;i++)
	{
		if(bookIDList[i] == bookID)
		{
			//console.log("repeated books");
			callback(1);
			return;
		}
	}
	if(bookIDList.length==TOTALBOOKS)
	{
		count = TOTALBOOKS;
		var oldBookID = bookIDList[TOTALBOOKS-1];
		localStorage.removeItem("book_"+oldBookID);
		localStorage.removeItem("history_"+oldBookID);
		localStorage.removeItem("bookmark_"+oldBookID);
	}

	else count = bookIDList.length+1;
	//console.log("Create new list of books");
	var newBookIDList = new Array();
	newBookIDList[0] = bookID;
	for(var i=1;i<count;i++)
		newBookIDList[i] = bookIDList[i-1];
	try{
		localStorage.setItem("bookIDList",JSON.stringify(newBookIDList));  
		//console.log("after adding new ID length "+newBookIDList.length);
		getSingleBookInfoLocal(localStorage.getItem("userIDLocal"),bookID);
	}
	catch(e)
	{
		alert("Not enough space, please try to delete some books");
		downloadBookCallback(0);
	}
}
function deleteBookLocal(bookID,callback)
{
	localStorage.setItem("lastUsed", getCurrentTime); 
	var bookIDList = JSON.parse(localStorage.getItem('bookIDList'));
	var newBookIDList = new Array();
	var count = 0;
	var deleteSuccess = 0;
	if(bookIDList == null)
		bookIDList = new Array();
	for(i=0; i<bookIDList.length; i++)
	{
		if(bookIDList[i]==bookID)
		{
			localStorage.removeItem("bookmark_"+bookID);
			localStorage.removeItem("history_"+bookID);
			var bk = JSON.parse(localStorage.getItem("book_"+bookID));
			console.log(bk);
			var total = bk.totalChapter;
			for(var j = 1;j<=total;j++)
				localStorage.removeItem("book_"+bookID+"chapter_"+j);
			localStorage.removeItem("book_"+bookID);
			console.log("delete success");
			deleteSuccess = 1;
			callback(1);
		}
		else
		{
			newBookIDList[count] = bookIDList[i];
			count = count + 1;
		}
	}
	if(deleteSuccess==0)
	{
	    console.log("No such book in local storage");
	    callback(0);
	}
	else
	{
	    localStorage.setItem("bookIDList",JSON.stringify(newBookIDList));
	    console.log(newBookIDList);
	}
}
function updateHistoryLocal(userID,bookID,lastPosition,chapterID)
{
	localStorage.setItem("lastUsed", getCurrentTime); 
	if(userID!=1&&localStorage.getItem("history_"+bookID)!=null)
	{
		var hsty = new Object();
		hsty.lastTime = getCurrentTime();
		hsty.lastPosition = lastPosition;
		hsty.chapterID = chapterID;
		localStorage.setItem("history_"+bookID,JSON.stringify(hsty));
	}

}
function updateSettingsLocal(userID,font,fontSize,textColor,backColor)
{
	localStorage.setItem("lastUsed", getCurrentTime); 
	if(userID!=1)
	{
		var settings = new Object();
		settings.font = font;
		settings.fontSize = fontSize;
		settings.textColor = textColor;
		settings.backColor = backColor;
		localStorage.setItem("settings",JSON.stringify(settings));
	}
}
function addBookmarkLocal(userID,bookID,chapterID,lastPosition,comment,bkmkID)
{
	localStorage.setItem("lastUsed", getCurrentTime); 
	if(userID!=1)
	{
		//  alert("pass in "+bookID);
		var bookmarkList = JSON.parse(localStorage.getItem("bookmark_"+bookID));
		if(bookmarkList == null) bookmarkList = new Array();
		var newbookMark = new Object();
		newbookMark.lastTime = getCurrentTime();
		newbookMark.lastPosition =lastPosition;
		newbookMark.chapterID = chapterID;
		bookmarkCount = localStorage.getItem("bookmarkCount");
		if(bkmkID==0)
		{
		    bookmarkCount = bookmarkCount -1;
		    newbookMark.markID = bookmarkCount-1;
		}
		else
		{
		    newbookMark.markID = bkmkID;
		}
		localStorage.setItem("bookmarkCount",bookmarkCount);
		newbookMark.name = comment;
		bookmarkList[bookmarkList.length] = newbookMark;
		try{
			localStorage.setItem("bookmark_"+bookID,JSON.stringify(bookmarkList));}
		catch(e)
		{
			alert("Not enough space, please delete some books");
		}
	}
}
function deleteBookmarkLocal(bookmarkID,callback)
{
	localStorage.setItem("lastUsed", getCurrentTime); 
	var bookIDList = JSON.parse(localStorage.getItem('bookIDList'));
	var deleteList = JSON.parse(localStorage.getItem("deleteBookmarks"));
	if(deleteList ==null)
	    deleteList  = new Array();
	deleteList[deleteList.length] = bookmarkID;
	localStorage.setItem("deleteBookmarks",JSON.stringify(deleteList));
	if(bookIDList == null)
		bookIDList = new Array();
	var bookmarkList = new Array();
	var cnt=0;
	for(i=0; i<bookIDList.length; i++)
	{
		var bookID = bookIDList[i];
		var bookmarks = JSON.parse(localStorage.getItem('bookmark_'+bookID));
		for(j=0; j<bookmarks.length; j++)
		{
			if(bookmarks[j].markID==bookmarkID) 
			{
				for(var k=j;k<bookmarks.length-1;k++)
					bookmarks[k] = bookmarks[k+1];
				localStorage.setItem("bookmark_"+bookID,JSON.stringify(bookmarks));
				callback(1);
			}
		}
	}
	callback(0);
}


//===================================Utility function===================================
function getCurrentTime()
{
	var current = new Date();
	var currentTime = "";
	currentTime = currentTime+current.getFullYear()+"-";
	currentTime = currentTime + adjustmentToTime(current.getMonth()+1)+"-";
	currentTime = currentTime + adjustmentToTime(current.getDate())+" ";
	currentTime = currentTime + adjustmentToTime(current.getHours())+":";
	currentTime = currentTime + adjustmentToTime(current.getMinutes())+":";
	currentTime = currentTime + adjustmentToTime(current.getSeconds());
	return currentTime;
}
function adjustmentToTime(time)
{
	if(time <10)
		return "0"+time;
	else
		return time;
}
function getSettingsForBookLocal()
{
	return JSON.parse(localStorage.getItem("settings"));
}
function getHistoryForBookLocal(bookID)
{
	var hsty =  JSON.parse(localStorage.getItem("history_"+bookID));
	//console.log(hsty);
	if(hsty == null)
	{
		hsty = new Object();
		hsty.lastPosition = 0;
		hsty.chapterID = 1;
		hsty.lastTime = 0;
	}
	console.log("history get from local storage");
	console.log(hsty);
	return hsty;
}
function getBookmarkForBookLocal(bookID)
{
	var bkmk = JSON.parse(localStorage.getItem("bookmark_"+bookID));
	if(bkmk==null)
		bkmk = new Array();
	return bkmk;
}
function getContentForBookLocal(bookID,chapterID,position,width,height,stgs)
{
	//console.log("bookID"+bookID+"chapterID "+chapterID);
	var data =JSON.parse( localStorage.getItem("book_"+bookID+"chapter_"+chapterID));
	if(data==null||localStorage.getItem("book_done_"+bookID)==null) 
	{   
		var content = new Object();
		content.pageNum = 0;
		content.chapNum = 1;
		content.title = "";
		var pagesToDisplay = new Array();
		var page = new Object();
		page.content = "Sorry this book does not exist or not download completely";
		content.pagesToDisplay = new Array();
		return content;
	}

	var content = handleDisplay(data,chapterID,position,width,height,stgs,0);
	var data = JSON.parse( localStorage.getItem("book_"+bookID));
	content.title = data.title;
	//console.log("local storage"+content);
	return content;
}
function getChapterListForBookLocal(bookID)
{
	var book = JSON.parse(localStorage.getItem("book_"+bookID));
	if(book == null)
	{
		book = new Object();
		book.totalChapter = 1;
	}
	var totalChapter = book.totalChapter;
	var chapterList = new Array();
	for (var i=1;i<=totalChapter;i++)
	{
		var chp = "Chapter "+i;
		chapterList[i] = chp;
	}
	return chapterList;
}
function getBooksLocal()
{

	var bookIDList = JSON.parse(localStorage.getItem("bookIDList"));
	//console.log(localStorage.getItem("bookIDList"));
	if(bookIDList==null)
	{
		bookIDList = new Array();
		//console.log("book list does not exist");
	}
	var bookList = new Array();
	for(var i=0;i<bookIDList.length;i++)
	{
		var bookID = bookIDList[i];
		//console.log(bookID);
		var book = JSON.parse(localStorage.getItem("book_"+bookID));
		if(book!=null)
		bookList[i] = book;
		else
		console.log("null book"+bookID);
	}
	console.log("local storage get books total "+bookList.length);
	console.log(bookList);
	return bookList;
}
function getHistoryListLocal()
{
	var bookIDList = JSON.parse(localStorage.getItem('bookIDList'));
	if(bookIDList==null)
		bookIDList = new Array();
	var historyList = new Array();
	for(i=0; i<bookIDList.length; i++){
		var bookID = bookIDList[i];
		var bookHistory = JSON.parse(localStorage.getItem("history_"+bookID));
		bookHistory.b_id = bookID;
		historyList[i] = bookHistory;
	}
	return historyList;
}
function getBookmarkListLocal()
{
	var bookIDList = JSON.parse(localStorage.getItem('bookIDList'));
	if(bookIDList == null)
		bookIDList = new Array();
	var bookmarkList = new Array();
	var cnt=0;
	for(i=0; i<bookIDList.length; i++){
		var bookID = bookIDList[i];
		var bookmarks = JSON.parse(localStorage.getItem('bookmark_'+bookID));
		for(j=0; j<bookmarks.length; j++){
		//	if(!bookmarks[j].markID) bookmarks[j].markID = 0;
			bookmarks[j].bookID = bookID;
			bookmarkList[cnt]=bookmarks[j];
			cnt++;
		}
	}
	console.log(bookmarkList);
	return bookmarkList;
}
function setBookmarkCount()
{
	var bookmarkList = getBookmarkListLocal();
	bookmarkCount = 0;
	for(var i=0;i<bookmarkList.length;i++)
	{
		var bm = bookmarkList[i];
		if(bm.markID<bookmarkCount)
			bookmarkCount = bm.markID-1;
	}

}
function getBookmarkLocal(userID,bookID,index,totalBooks)
{
	var url = IP+"/user/"+userID+"/book/"+bookID+"/bookmark/0";
	var jqxhr = $.getJSON(url, function(data) 
			{
			getBookmarkLocalCallback(userID,bookID,index,totalBooks,data);
			})
	.error(function() {})
}

function getBookmarkLocalCallback(userID,bookID,index,totalBooks,data)
{
   bookmarkList  = new Array();
   for (var i=0;i<data.length;i++)
   {
   var bk = data[i];
   var temp = new Object();
   temp.chapterID = bk["c_id"];
   temp.markID = bk["bm_id"];
   temp.position = bk["position"];
   temp.name = bk["name"];
   bookmarkList[i] = temp;
   console.log(temp);
   }
   localStorage.removeItem("bookmark_"+bookID);
   localStorage.setItem("bookmark_"+bookID,JSON.stringify(bookmarkList));
   var bookIDList = JSON.parse(localStorage.getItem("bookIDList"));
   if(index<totalBooks-1)
   {
        var newBookID = bookIDList[index+1];
        getBookmarkLocal(userID,newBookID,index+1,totalBooks);
   }
   

}
function getBookListLocalCallback(data)
{
	var booksList = new Array();
	bookListArray = data.isreading;
	if(bookListArray.length<TOTALBOOKS)
		localStorage.setItem("totalNumBooks",bookListArray.length);
	else
		localStorage.setItem("totalNumBooks",TOTALBOOKS);
	for(var i=0;i<localStorage.getItem("totalNumBooks");i++)
	{
		var bk = bookListArray[i];
		var temp = new Object();
		var hsty = new Object();
		temp.title = bk["title"];
		temp.bookID = bk["b_id"];
		temp.desp = bk["description"];
		temp.author = bk["author"];
		temp.cover = bk["image"];
		temp.type = bk["type"];
		temp.totalChapter = bk["totalChapter"];
		hsty.lastTime = bk["lastTime"];
		hsty.lastPosition = bk["lastPosition"];
		hsty.chapterID = bk["c_id"];
		localStorage.setItem("book_"+temp.bookID,JSON.stringify(temp));
		localStorage.setItem("history_"+temp.bookID,JSON.stringify(hsty));
		booksList[i] = temp.bookID;
	}
	localStorage.setItem("bookIDList",JSON.stringify(booksList));
	getSettingsLocal(localStorage.getItem("userIDLocal"));
}
function getDeleteBookmarkListLocal()
{
	var deletelist = JSON.parse(localStorage.getItem("deleteBookmarks"));
	if(deletelist ==null)
		deletelist = new Array();
    return deletelist;
}

//=================================Not Useful===========================
/*

   function getBookChapterCallback(bookID,chapterID,bookIndex,totalChapter,totalBooks,data)
   {
   localStorage.setItem("book_"+bookID+"chapter_"+chapterID,data);
   if(chapterID<totalChapter)
   getBookChapter(bookID,chapterID+1,bookIndex,totalChapter);
   else
   {
   localStorage.setItem("book_done_"+bookID,1);
   var bookIDList = JSON.parse(localStorage.getItem("bookIDList"));
   if(bookIndex<totalBooks-1)
   {
   var newBookID = bookIDList[bookIndex+1];
   var book = JSON.parse(localStorage.getItem("book_"+newBookID));
   var total = book.totalChapter;
   getBookChapter(newBookID,1,bookIndex+1,total,totalBooks)   
   }
   else
   {
   localStorage.setItem("setup",1); 
   }
   }
   }
   function getBookmarkLocalCallback(userID,bookID,index,totalBooks,data)
   {
   bookmarkList  = new Array();
   for (var i=0;i<data.length;i++)
   {
   var bk = data[i];
   var temp = new Object();
   temp.chapterID = bk["c_id"];
   temp.markID = bk["bm_id"];
   temp.position = bk["position"];
   temp.name = bk["name"];
   bookmarkList[i] = temp;
   }
   localStorage.setItem("bookmark_"+bookID,JSON.stringify(bookmarkList));
   var bookIDList = JSON.parse(localStorage.getItem("bookIDList"));
   if(index<totalBooks-1)
   {
   var newBookID = bookIDList[index+1];
   getBookmarkLocal(userID,newBookID,index+1,totalBooks);
   }
   else
   {
   var newBookID = bookIDList[0];
   var book = JSON.parse(localStorage.getItem("book_"+newBookID));
   var total = book.totalChapter;
   getBookChapterLocal(newBookID,1,0,total,bookIDList.length);
   }

   }
 */
/*

//============================Create new Database================================
var DB;
function initDatabase() {  
try {  
if (!window.openDatabase) {  
alert('Databases are not supported in this browser.');  
} 
else 
{  
var shortName = 'EBooks';  
var version = '1.0';  
var displayName = 'EBooks Database';  
var maxSize = 10000000; //  bytes  
DB = openDatabase(shortName, version, displayName, maxSize);  
//createTables();  
prePopulate();
console.log("Done");
} 
} 
catch(e) { 
console.log(e);
return;  
}  
}  

function createTables(){  
DB.transaction(function (transaction) {  
transaction.executeSql('CREATE TABLE IF NOT EXISTS books(b_id INTEGER NOT NULL PRIMARY KEY, c_id INTEGER NOT NULL,content TEXT NOT NULL);', [], nullDataHandler, errorHandler);
transaction.executeSql('CREATE TABLE IF NOT EXISTS settings(id INTEGER NOT NULL PRIMARY KEY, font_size INTEGER NOT NULL ,font TEXT NOT NULL,text_color TEXT NOT NULL, bg_color TEXT NOT NULL );', [], nullDataHandler, errorHandler);
transaction.executeSql('CREATE TABLE IF NOT EXISTS bookmarks(bm_id INTEGER NOT NULL PRIMARY KEY,b_id INTEGER NOT NULL , c_id INTEGER NOT NULL  , position INTEGER NOT NULL,name TEXT NOT NULL );', [], nullDataHandler, errorHandler);
transaction.executeSql('CREATE TABLE IF NOT EXISTS history( b_id INTEGER NOT NULL PRIMARY KEY , c_id INTEGER NOT NULL  , lastPosition INTEGER NOT NULL, lastTime TIMESTAMP NOT NULL);', [], nullDataHandler, errorHandler);
});
prePopulate();
}

function nullDataHandler(transaction,results){
console.log(results);
}

function errorHandler(transaction,error){
console.log(error.message);
}

function prePopulate(){
DB.transaction(function (transaction) {
//Optional Starter Data when page is initialized
var data = ['1','12','Helvetica','black','white'];
transaction.executeSql("INSERT INTO settings(id, font_size, font, font_color, bg_color) VALUES (?, ?, ?, ?, ?)", [data[0], data[1], data[2], data[3],data[4]],nullDataHandler,errorHandler);
console.log("Called");
});
}

function dataHandler(transaction,results){
console.log(results);
}


//==================================Settings related API calls====================================
function getSettingsFromLocalDatabase(callback)
{
DB.transaction(  
function(transaction,callback) {
transaction.executeSql("SELECT * FROM settings WHERE id=1 ", [],
function(transaction,results)
{
var settings = new Object();
settings.font = results.rows.item(0)['font'];
settings.fontSize = results.row.item(0)['font_size'];
settings.textColor = results.row.item(0)['text_color'];
settings.backColor = results.row.item(0)['bg_color'];
callback(settings);

}, 
	function(transaction,error)
{
	callback(0);
});
});

}

function updateSettingsFromLocalDatabase(stgs,callback)
{

	DB.transaction(  
			function(transaction,callback) {
			transaction.executeSql("UPDATE settings SET font=?, bg_color=?, font_size=?, text_color=? WHERE id = 1", 
				[stgs.font, stgs.backColor, stgs.font_size, stgs.textColor],
				function(transaction,results)
				{
				callback(0);
				},
				function(transaction,error)
				{
				callback(0);
				});

			});
}

//========================================History Related API calls===================================
function getHistoryFromLocalDatabase(bookID,callback)
{
	DB.transaction(  
			function(transaction,callback) {
			transaction.executeSql("SELECT * FROM history WHERE b_id=? ", [bookID],
				function(transcation,results)
				{
				var history = new Object();
				history.lastPosition = results.rows.item(0)['lastPosition'];
				history.chapterID = results.row.item(0)['c_id'];
				history.bookID = bookID;
				callback(history);

				},
				function(transaction,error)
				{
				callback(0);
				}); 
			});
}

function updateHistoryFromLocalDatabase(bookID,chapterID,position,callback)
{

	DB.transaction(  
			function(transaction,callback) {
			//get current time stamp
			var time = 0;
			transaction.executeSql("UPDATE history SET c_id=?, lastPosition=?, lastTime=? WHERE b_id = ?", 
				[chapterID,lastPosition,time,bookID],
				function(transaction,results)
				{
				callback(1);
				},
				function(transaction,error)
				{
				callback(0);
				});
			});
}

function createHistoryFromLocalDatabase(bookID,chapterID,poistion,callback)
{
	DB.transaction(  
			function(transaction,callback) {
			//get current time stamp
			var time = 0;
			transaction.executeSql("INSERT INTO history(c_id, lastPosition, lastTime,b_id) VALUES(?,?,?,?)", 
				[chapterID,lastPosition,time,bookID],
				function(transaction,results)
				{
				callback(1);
				},
				function(transaction,error)
				{
				callback(0);
				});
			});
}

//=================================Bookmark related API calls=========================================
function getHistoryFromLocalDatabase(bookID,callback)
{
	DB.transaction(  
			function(transaction,callback) {
			transaction.executeSql("SELECT * FROM bookmarks WHERE b_id=? ", [bookID],
				function(transcation,results)
				{
				var bookmarkList = new Array();
				for (var i = 0; i < results.rows.length; i++) 
				{
				var bk = new Object();
				bk.lastPosition = results.rows.item(i)['lastPosition'];
				bk.chapterID = results.row.item(i)['c_id'];
				bk.bookmarkID = results.row.item(i)['bm_id'];
				bk.comment = results.row.item(i)['name'];
				bk.bookID = bookID;
				bookmarkList[i] = bk;
				}
				callback(bookmarkList);

				},
				function(transaction,error)
				{
				callback(0);
				}); 
			});
}

function updateBookmarkFromLocalDatabase(bookmarkID,bookID,chapterID,position,comment,callback)
{

	DB.transaction(  
			function(transaction,callback) {
			//get current time stamp
			var time = 0;
			transaction.executeSql("UPDATE bookmarks SET b_id=?, c_id=?, lastPosition=?, lastTime=?,name=? WHERE bm_id = ?", 
				[bookID,chapterID,lastPosition,time,comment,bookmarkID],
				function(transaction,results)
				{
				callback(1);
				},
				function(transaction,error)
				{
				callback(0);
				});
			});
}

function createBookmarkFromLocalDatabase(bookID,chapterID,poistion,comment,callback)
{
	DB.transaction(  
			function(transaction,callback) {
			//get current time stamp
			var time = 0;
			//?how to handle bm_id?
			transaction.executeSql("INSERT INTO bookmarks(c_id, lastPosition, lastTime,b_id,name) VALUES(?,?,?,?,?)", 
				[chapterID,lastPosition,time,bookID,comment],
				function(transaction,results)
				{
				callback(1);
				},
				function(transaction,error)
				{
				callback(0);
				});
			});
}


//==================================Reading related API calls======================================
function  getContentFromLocalDatabase(bookID,chapNum,position,stgs,width,height,callback)
{

	DB.transaction(  
			function(transaction,callback) {
			transaction.executeSql("SELECT content FROM books WHERE b_id=? AND c_id=?", [bookID,chapNum],
				function(transcation,results)
				{
				var book =  results.rows.item(0)['content'];
				handleDisplay(book,chapNum,position,width,height,stgs,callback);
				},
				function(transaction,error)
				{
				callback(0);
				}); 
			});

}
*/
