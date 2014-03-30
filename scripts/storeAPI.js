var IP = "http://www.yunreading.com";
//============================ get popular books list ====================================
function getPopularBooks(callback)
{
    
    var url = IP+"/popular/book";
    var jqxhr = $.getJSON(url, function(data) 
    {
        handleBooksListData(data,callback);
    })
  
    .error(function() { 
        console.log("Fails in popular"); 
        booksList  = new Array();
        callback(booksList); 
    })
   
}
function getPopular()
{
    
    var url = IP+"/popular/book";
    var jqxhr = $.getJSON(url, function(data) 
    {
        booksList  = new Array();
		bookListArray = data;
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
		return(booksList);
    })
  
    .error(function() { 
        console.log("Fails in popular"); 
        booksList  = new Array();
        callback(booksList); 
    })
   
}
function getNewBooks(callback)
{
    var url = IP+"/popular/newest";
    var jqxhr = $.getJSON(url, function(data) 
    {
        handleBooksListData(data,callback);
    })
  
        .error(function() { 
        console.log("Fails in newest"); 
        booksList  = new Array();
        callback(booksList); 
    })
   
}

//===========================get books according to tag/category =========================
function getCategoryBooks(category,callback)
{
    var url = IP+"/category/"+category;
    var jqxhr = $.getJSON(url, function(data) 
    {
        handleBooksListData(data,callback);
    })
  
        .error(function() { 
        console.log("Fails in category"); 
        booksList  = new Array();
        callback(booksList); 
    })
}

//============================get books according to search ============================
function getSearchBooks(content,callback)
{
    var url = IP+"/search/"+content;
    var jqxhr = $.getJSON(url, function(data) 
    {
        handleBooksListData(data,callback);
    })
  
    .error(function() { 
        console.log("Fails in search"); 
        booksList  = new Array();
        callback(booksList); 
    })
}
    

function handleBooksListData(data,callback)
{
    booksList  = new Array();
    bookListArray = data;
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



//==================================download books==============================

function downloadBook(userID,bookID,callback)
{
	var url = IP+"/user/"+userID;
	//alert(url);
	var data = {"b_id":bookID,"lastPosition":0};
	//console.log(data);
    $.ajax({
		type: 'POST',
		url: url,
		data:data,
		success: function(data){
		callback(1);},
		error:function(error){
		//console.log(error);
		callback(0);
		},
		dataType: "json"
	});
}


//===============================get category list================================

function getCategoryList(callback)
{
    var url = IP+"/category/0";
    var jqxhr = $.getJSON(url, function(data) 
    {
        handleCategoryListData(data,callback);
    })
  
    .error(function() {alert("Fails in get Category"); callback(0); })
}

function handleCategoryListData(data,callback)
{
    categoryList  = new Array();
    categoryData = data;
    for (var i=0;i<categoryData.length;i++)
    {
        var c = categoryData[i];
        var temp = new Object();
        temp.categoryID = c["t_id"];
        temp.categoryName = c["t_name"];
        categoryList[i] = temp;
    }
    callback(categoryList);
}

