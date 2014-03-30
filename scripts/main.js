function displayStoreBooks(thebooks){
	console.log(thebooks);
	$.mobile.pageLoading(true);
	$('tbody').remove();
	if (thebooks == 0) {
		$('#error_msg').html("<h1>Oops, cannot find the books you want, please visit our public page to post your requests, thank you.</h1>");
		return;
	}
	else{
		$('#error_msg').html("");
		booklist = thebooks;
		
		var table_books = $('#table_books');
		if(window.innerWidth > window.innerHeight)
			numOfCol = 4;
		else numOfCol = 3;
		//alert(books.length/numOfCol);
		for(i = 0; i <=(thebooks.length-1)/numOfCol; i++){
			//alert((i+1)*numOfCol);
			var tr = $('<tr'+" col="+i+'/>');
			for(j = i*numOfCol; j<(i+1)*numOfCol;j++){
				if(j<thebooks.length){
					var book = thebooks[j];
					var str = "bookId="+book.bookID;
					var width = (100/numOfCol)+"%";
					var td = $("<td "+str+" width='"+width+"' style='vertical-align : bottom' ></td>");
					if(book.cover == null || book.cover == 0){
						var div = $("<div id='standard_cover' book_index="+book.bookID+"></div>");
						var div_info = $("<div class='book_info'></div>")
						var text = "<p>"+book.title+"</p>"+"<p>"+book.author+"</p>";
							div_info.html(text);
						//var btn = $('<button book_index = '+j+'>More</button>')
								// 				                		btn.bind('click',function(){
								// var bookIndex = $(this).attr("book_index");
								// 				                        	(bookIndex);
								// 				                        	});
								// 				                		div_info.append(btn);
							div.append(div_info);
							div.bind("click", function(){
								var bookIndex = $(this).attr("book_index");
								//alert(bookIndex);
								showBookDetail(bookIndex);
							});
							td.append(div);
					}
					else{

						var img = $("<img src= 'http://www.yunreading.com/book/" +book.bookID+"/cover' alt='Read' class='cover' book_index= "+book.bookID+"></img>");
						img.bind("click", function(){
							var bookIndex = $(this).attr("book_index");
							/*setCookie("bookID",bookID);
							setCookie("userID",userID);
							window.location = 'reading.html';
							*/
							window.location="detail.html?"+bookIndex;
						});
						td.append(img);
					}
					tr.append(td);
				}
				else{
					var td = $('<td/>');
					tr.append(td);
				}
			}
			table_books.append(tr);
		}
	}
	
}
//==================================download books==============================

function downloadBook(userID,bookID,callback)
{
    var IP="http://www.yunreading.com";
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

	
function getCategoryListCallback(catList){
	//alert(catList);
	$.mobile.pageLoading(true);
	//alert(catList);
	var lst = $("#cat_list");
		lst.html("");
	for(i=0; i < catList.length;i++){
		//class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-down-a ui-btn-up-a'
		var li = $("<li  style='text-align:center' class='ui-li ui-li-static ui-btn-up-a ui-btn-hover-a' cat_id= "+catList[i].categoryID+"></li>");
		var btn = $("<span class='ui-li-count' cat_id= "+catList[i].categoryID+" ></span>");
			btn.html(catList[i].categoryName);
			li.bind("click", function(){
				$.mobile.pageLoading();
				var catID = $(this).attr("cat_id");
				getCategoryBooks(catID,displayStoreBooks);
				$('#categories').dialog('close');
			});
			li.append(btn);
		lst.append(li);
	}
}

function showBookDetail(bk){
	$('#book_title').html("<h1><strong>"+bk.title+"</strong></h1>");
	$('#book_author').html("<h5>"+bk.author+"</h5>");
	$('#share').html('<img src="styles/images/fb_share.png" title="Share with " onclick="feeds('+bk.bookID+',\''+bk.title+'\',\''+bk.author+'\');" width="40"/></a>'+
	'<img src="styles/images/rr_share.png" title="?????" onclick="rrfeeds('+bk.bookID+',\''+bk.title+'\');" width="40"/>');
	var img = '<img src= "http://www.yunreading.com/book/'+bk.bookID+'/cover" alt="Read" width="35%" book_index= '+bk.bookID+'/>';
	$('.book_info_cover').html(img);
	$('#book_popularity').html("<h5>"+bk.popularity+" readers</h5>");
	var btn_add_to_lib=$("<button data-role = 'button' book_id= "+bk.bookID+" >Add to library</button>");
		btn_add_to_lib.bind("click",function() {
				var bookID = $(this).attr("book_id");
				addToLibrary(bookID,addToLibraryCallback);
			});
	var btn_read_now=$("<button data-role = 'button' book_id= "+bk.bookID+" >Read it now</button>");
		btn_read_now.bind("click",function(){
			var bookID = $(this).attr("book_id");
			setCookie("userID",userID);
			setCookie("bookID",bookID);
			//addToLibrary(bookID,beforeReadCallback);
			readItNow(bookID,beforeReadCallback);
		});
		$("#btns").html("");
		$("#btns").append(btn_add_to_lib);
		$("#btns").append(btn_read_now);
		//$("#book_detail").dialog("open");
}

function addToLibrary(bookID,callback){
	if(userID == 1){
		handleNonRegUser("index.html");
	}
	else{
		setCookie("userID",userID);
		downloadBook(userID,bookID,callback);
		//window.location = "reading.html";
	}
}

function readItNow(bookID, callback){
	if(userID == 1){
		handleNonRegUser("reading.html");
	}
	else{
		setCookie("userID",userID);
		setCookie("bookID",bookID);
		downloadBook(userID,bookID,callback);
	}
}

function beforeReadCallback(){
	window.location = "reading.html";
}

function addToLibraryCallback(status){
	if(status==0)
		alert("Fail to add into library");
	else
		alert("Added to library successfully");
};