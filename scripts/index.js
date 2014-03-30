var userId;// = getCookie('userID');
var numOfCol;
//var Books;
var booklist;

function displayStoreBooks(thebooks){
	//alert(books);
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
						var div = $("<div id='standard_cover' book_index="+j+"></div>");
						var div_info = $("<div class='book_info'></div>")
	                	var text = "<p>"+book.title+"</p>"+"<p>"+book.author+"</p>";
							div_info.html(text);
	                	//var btn = $('<button book_index = '+j+'>More</button>')
								// 				                		btn.bind('click',function(){
								// var bookIndex = $(this).attr("book_index");
								// 				                        	showBookDetail(bookIndex);
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

						var img = $("<img src= 'data:image/" +book.type+";base64,"+book.cover+"' alt='Read' class='cover' book_index= "+j+"></img>");
						img.bind("click", function(){
							var bookIndex = $(this).attr("book_index");
	                    	/*setCookie("bookID",bookID);
	                    	setCookie("userID",userID);
	                    	window.location = 'reading.html';
							*/
							showBookDetail(bookIndex);
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

function showBookDetail(bookIndex){
	var bk = booklist[bookIndex];
	//$('.book_info_cover) = 
	$.mobile.changePage("#book_detail", "slideup");
	//$('#book_detail').dialog("open");
	$('#book_title').html("<h3><strong>"+bk.title+"</strong></h3>");
	$('#book_author').html("<h5>"+bk.author+"</h5>");
	$('#share').html(
	'<img src="styles/images/fb_share.png" title="Share with " onclick="feeds('+bk.bookID+',\''+bk.title+'\',\''+bk.author+'\');" width="40"/></a>'+
/*	 '<xn:share-button type="button_count" confirm="alert("分享成功");" cancel="alert("用户取消了");">'+
	 '<input type="hidden" name="medium"       value="book"/>'+
	 '<input type="hidden" name="title"        value="'+bk.title+'"/>'+
	  ' <input type="hidden" name="link"   value="http://www.yunreading.com"/>'+  
	  ' <input type="hidden" name="image_src"    value="http://www.yunreading.com/book/'+bk.bookID+'cover"/>'+
	  '<input type="hidden" name="message"      value="一起来云读吧！"/>'+
	 '</xn:share-button>'+*/
	'<img src="styles/images/rr_share.png" title="分享到人人" onclick="rrfeeds('+bk.bookID+',\''+bk.title+'\');" width="40"/>');
	if(!(bk.cover == null || bk.cover == 0)){
		var img = $("<img src= 'data:image/" +bk.type+";base64,"+bk.cover+"' alt='Read' width='35%' book_index= "+j+"></img>");
		$('.book_info_cover').html("");
		$('.book_info_cover').append(img);
	} else {
        $('.book_info_cover').html("");
    }
	$('#book_popularity').html("<h5>"+bk.popularity+" readers</h5>");
	var btn_add_to_lib=$("<button href='#' data-role = 'button' book_id= "+bk.bookID+" >Add to library</button>");
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

// function handleNonRegUser(willRead){
//                 if(willRead){
//                     $("#fb_login_onfly").click(function(){fbauthen("reading.html")});
//                     $("#rr_login_onfly").click(function(){authen("reading.html")});
//                 } else {
//                     $("#fb_login_onfly").click(function(){fbauthen("library.html")});
//                     $("#rr_login_onfly").click(function(){authen("library.html")});
//                 }
// 			$.mobile.changePage("#login_dialog", "slideup");
// 		}


$('document').ready(function(){
	//initially only the btn_login will show, the btn_social and btn_out will hide;
	$.mobile.pageLoading();
	registerOnlineOfflineEvent(onlineCallback, offlineCallback);
	var mode=getCookie('mode');
	if ((getCookie("userID"))&&(getCookie("userID") != "undefined") && (getCookie("userID")!=1))
	{  
	    userID = getCookie("userID");
		$('#btn_login').hide();
		$('#btn_out').show();
		$('#btn_library').show();
		$('#btn_lan').hide();
	}
	else
	{
	    userID=1;
		$('#btn_login').show();
		$('#btn_out').hide();
		$('#btn_library').hide();
		$('#btn_lan').show();
	}			
	console.log(getCookie("userID"));
	//getBooks(userID,displayBooks);				
	$("#div_search").hide();
	var url = IP+"/popular/book";
	var jqxhr = $.getJSON(url, function(data) 
	{
		booklist  = new Array();
		for (var i=0;i<data.length;i++)
		{
			var bk = data[i];
			var temp = new Object();
			temp.title = bk["title"];
			temp.bookID = bk["b_id"];
			temp.desp = bk["description"];
			temp.author = bk["author"];
			temp.cover = bk["image"];
			temp.type = bk["type"];
			temp.popularity = bk["popularity"];
			booklist[i] = temp;
		}		
		displayStoreBooks(booklist);
	});					
	// $("#btn_search").live('click',function(){
	// 					if(isShowSearchbox){
	// 					$("#div_search").hide("slow");
	// 					isShowSearchbox = false;	
	// 					}
	// 					else{
	// 						$("#div_search").show("slow",function(){
	// 							$('#search')[0].focus();
	// 							isShowSearchbox = true;
	// 						});
	// 						
	// 					}
	// 				});
	
	$("#btn_search").live('click', function(){
		$("#div_search").toggle("slow", function(){
			$('#search')[0].focus();
		});
	});
	$(window).resize(function(){
		$('tr').remove();
		displayStoreBooks(booklist);
    });	
	$('#btn_library').live('click',function(){
		if (userID == 1){
			handleNonRegUser('library.html');
		}
		else{
			window.location = 'library.html';
		}
	});	
	
	/*$('#btn_reading').live('click',function(){
		window.location = 'reading.html';
	});	*/
	
	$('#btn_close_cat').live('click',function(){
		$('#categories').dialog('close');	
	});
	
	
	$('#btn_cat').live('click',function(){
		$.mobile.pageLoading();
		getCategoryList(getCategoryListCallback);
	});
	$('#search').live("change", function(){
		//alert($(this).val());
		$.mobile.pageLoading();
		getSearchBooks($(this).val(), displayStoreBooks);
	});
	
	$('#btn_newBooks').live('click',function(){
		$.mobile.pageLoading();
		getNewBooks(displayStoreBooks);
	});
	
	$('#btn_topBooks').live('click',function(){
		$.mobile.pageLoading();
		getPopularBooks(displayStoreBooks);
	});
	
	$('#btn_not_to_login').live('click', function(){
		setCookie("userID",1);
		//window.location = "reading.html";
	});
	$('#btn_lan').live('click',function(){window.location="/cn";});
});