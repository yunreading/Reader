var IP = "http://www.yunreading.com";
//============================ get books list ====================================
function getBooks(userID,callback)
{   
     if(userID==1) 
    {
        console.log ("guest user, get booksList"); 
        booksList  = new Array();
        callback(booksList);
    }
    else
    {
        var url = IP+"/user/"+userID;
        //alert("URL of Get Book List "+ url);
        var jqxhr = $.getJSON(url, function(data) 
         {
            handleBooksListData(data,callback);
        })
  
        .error(function() {
			alert("Trying offline mode");
			var tmpBookList = getBooksLocal();
			callback(tmpBookList);
			if(tmpBookList.length>0){
				mode = 0;
				setCookie("mode",0);
			}
			/*
            var booksList  = new Array();
            callback(booksList);
			*/
         })
    }
   
}
function handleBooksListData(data,callback)
{
    booksList  = new Array();
    bookListArray = data.isreading;
    //console.log(data);
    for (var i=0;i<bookListArray.length;i++)
    {
        var bk = bookListArray[i];
        var temp = new Object();
        temp.title = bk["title"];
        temp.bookID = bk["b_id"];
        temp.desp = bk["description"];
        temp.author = bk["author"];
        temp.cover = bk["image"];
        temp.type = bk["type"];
        temp.popularity = bk["popularity"];
        booksList[i] = temp;
    }
    callback(booksList);
}
function deleteBook(userID,bookID,callback)
{
    if(userID==1) 
    {
        console.log ("guest user,delete book"); 
	    callback(1);
    }
    else
    {
	    var url = IP+"/user/"+userID;
        $.ajax({
		    type: 'DELETE',
		    url: url,
			data: {b_id:bookID},
		    success: function()
		    {
		        console.log("Sever delete book success");
		        callback(1);
		    },
		    error:function()
		    {
		        console.log("Sever delete book fail");
		        callback(0);
		    },
		    dataType: "json"
	    });
	}
}




