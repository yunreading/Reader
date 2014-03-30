var IP = "http://www.yunreading.com";
//============================ get bookmark list ====================================
function getBookmarkList(userID,bookID,callback)
{
    if(userID==1) 
    {
        console.log ("guest user"); 
        bookmarkList  = new Array();
        callback(bookmarkList);
    }
    else
    {
        var url = IP+"/user/"+userID+"/book/"+bookID+"/bookmark/0";
        var jqxhr = $.getJSON(url, function(data) 
        {
            handleBookmarkListData(data,callback);
        })
  
        .error(function() { 
            console.log ("fails in bookmarklist"); 
            bookmarkList  = new Array();
            callback(bookmarkList);
        })
    }
   
}

function handleBookmarkListData(data,callback)
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
    callback(bookmarkList);
}

//============================ create new bookmark ====================================
function createBookmark(userID,bookID,currentChapNum,position,comment,callback)
{
     if(userID==1) 
    {
        console.log ("guest user"); 
        callback(1);
    }
    else
    {
        var url = IP+"/user/"+userID+"/book/"+bookID+"/bookmark";
        data = {"u_id":userID,"b_id":bookID,"c_id":currentChapNum,"name":comment,"position":position};
        $.ajax({
		    type: 'POST',
		    url: url,
		    data:data,
		    success: function(data){callback(data);},
		    error:function(){callback(0);},
		    dataType: "json"
	    });
	}
    
}



//==========================delete bookmark===========================================
function deleteBookmark(bookmarkID,callback)
{
        var url = IP+"/bookmark/"+bookmarkID;
        $.ajax({
		    type: 'DELETE',
		    url: url,
		    success: function(data){callback(1);},
		    error:function(error){console.log(error); callback(0);},
		    dataType: "json"
	    });
}

//=========================update bookmark============================================
function updateBookmark(bookmarkID,comment,callback)
{
    
        var url = IP+"/bookmark/"+bookmarkID;
        data = {"name":comment};
        $.ajax({
		    type: 'PUT',
		    url: url,
		    data:data,
		    success: function(data){callback(1);},
		    error:function(){callback(0);},
		    dataType: "json"
	    });
	
    
}
