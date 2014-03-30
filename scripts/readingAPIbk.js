var IP = "http://www.yunreading.com";
var SZZHCHAR = new Array(1,1,1,1,1,1,1,1,1,1,1);
var SZZHLINE = new Array(1.4,1.55,1,1.55,3,3,3,2,2.2,2.3,2.3);
var SZENCHAR = new Array(1,1,1,1,1,1,1,1,1,1,1);
var SZENLINE = new Array(0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9);

//============================ get chapter list====================================

function getChapterList(userID,bookID,callback)
{
  //  alert("chap list" + url);
    var url = IP+"/book/"+bookID+"/chapter/0";
	var jqxhr = $.getJSON(url, function(data) 
	{
		handleChapterListData(data,callback);
	})
	.error(function() { console.log("Fails to get chapter list");callback(0); })
}
function handleChapterListData(data,callback)
{
    var chapterList = new Array();
    for (var i=0;i<data.length;i++)
    {
        var temp = data[i];
        var chp = "Chapter"+temp["c_id"];
        chapterList[i+1] = chp;
    }
	callback(chapterList);
}



//=========================== get chapter =========================================


function getContent(bookID,chapNum,position,stgs,width,height,callback)
{
   
	  var url = IP+"/book/"+bookID+"/chapter/"+chapNum;
	 var jqxhr = $.getJSON(url, function(book) {
		handleDisplay(book,chapNum,position,width,height,stgs,function (content){
                    var url = IP+"/book/"+bookID+"/title/";
	                var jqxhr = $.getJSON(url, function(bookTitle) {
		                content.title = bookTitle;
		                callback(content);
	                })
	                .error(function() { 
	                alert("Fail in get book"); 
	                var content = new Object();
	                content.pageNum=0;
	                content.chapNum=0;
	                content.pagesToDisplay = new Array();
	                content.title ="";
	                callback(content);})
            });
	})
	.error(function() { 
	alert("Fail in get book"); 
	var content = new Object();
	content.pageNum=0;
	content.chapNum=0;
	content.title = "";
	content.pagesToDisplay = new Array();
	callback(content);
	})

}
function getBooktitle(content,callback)
{
     var url = IP+"/book/"+bookID+"/title/";
	 var jqxhr = $.getJSON(url, function(bookTitle) 
	{
		content.title = bookTitle;
		callback(content);
	})
	.error(function() { 
	alert("Fail in get book"); 
	var content = new Object();
	content.pageNum=0;
	content.chapNum=0;
	content.pagesToDisplay = new Array();
	content.title ="";
	callback(content);
	})
}
function handleDisplay(book,chapNum,position,width,height,stgs,callback)
{
   // alert("book" +book);
   var content = new Object();
    var pageNum = 1;
    var data = book.content;
    //alert("data "+data);
    var lang = book.language;
    var contentPos = data.indexOf("<p", 0);
    var imagePos = data.indexOf("<img",0);

    var handle = 0;//handle 0 means handle image, other wise handle text
    var pos = 0;
    var screenWidth = width;
    var screenHeight = height;
    //possible fontSize = 10,12,14,16,18,20,22,24,26,28,30
    var fontSize = stgs.fontSize;
    //alert(fontSize+" "+chapNum+" "+position+" "+width);
    var maxLine = 0;
    var maxChar = 0;
    var distgsh = " ";
    var index = (fontSize-10)/2;

    if(lang=="zh")
    {
         distgsh = "\\";
         distgsh = distgsh+"u";
         maxChar = Math.floor(screenWidth/(fontSize*SZZHCHAR[index]));
         maxLine = Math.floor(screenHeight/(fontSize*SZZHLINE[index]));
    }
    else
    {
         maxChar = Math.floor(screenWidth/(fontSize*SZENCHAR[index]));
         maxLine = Math.floor(screenHeight/(fontSize*SZENLINE[index]));
    }
    
 //   alert(maxLine);
    var maxTotal = maxChar*maxLine;

    var pagesToDisplay = new Array();
    var pageCount = 0;
    var pageContent = "";
    var currentLine = 0;
    var breakP = 0;
       

    
    if(contentPos>imagePos&&imagePos!=-1)
    {
		handle = 0;
		pos = imagePos;
    }
    else 
    {
		handle = 1;
		pos = contentPos;
    }
    var lastPos = 0;
    var endPos = 0;
    //alert(data.length);
    while(pos>0&&pos<data.length)
    {
        lastPos = pos;
        endPos = pos + 3;
		if(handle==1)
		{

			endPos = data.indexOf("/p>",pos);
			currentLine = currentLine +1;
			imagePos = data.indexOf("<img",endPos);
		
			if(currentLine<maxLine)
			{		
			   if(breakP==1)
				        pageContent = pageContent + "<p>"; 
				if(pos+maxChar<endPos)
				{
				    var lastspace = data.substring(pos,pos+maxChar).lastIndexOf(distgsh)+pos;
				    if(lastspace==pos-1)
				    { 
				        lastspace = endPos+3;
				        contentPos =  data.indexOf("<p",endPos); 
				        currentLine = currentLine +1;
				    }
				    else 		contentPos = lastspace;

					pageContent = pageContent + data.substring(pos,lastspace);
			//		if(pageCount==1&&currentLine>-1)
			//		alert("add 0 1 line "+currentLine +" " + data.substring(pos,lastspace));
				
				}
				else
				{
					pageContent = pageContent +data.substring(pos,endPos+3);
					contentPos =  data.indexOf("<p",endPos);
					currentLine = currentLine +1;
			//		if(pageCount==1&&currentLine>-1)
		    	//    alert("add 0 2 line "+currentLine +" " + data.substring(pos,endPos+3));

				}
				breakP = 0;
				//alert("content after add in " +pageContent);
			}
			else
			{
		
			    if(pos+maxChar<endPos)
				{
				    if(breakP==1)
				        pageContent = pageContent + "<p>";
				    var lastspace = data.substring(pos,pos+maxChar).lastIndexOf(distgsh)+pos;
				    if(lastspace==pos-1)
				    {
				        lastspace = endPos+3;
				        contentPos =  data.indexOf("<p",endPos);
				        currentLine = currentLine +1;
				        pageContent = pageContent + data.substring(pos,lastspace);
			//	        if(pageCount==1&&currentLine>-1)
			//           alert("add 1 1 1 line "+currentLine +" " + data.substring(pos,lastspace));
				      breakP = 0;
				    }
				    else 					
				    {
				        contentPos = lastspace;
					    pageContent = pageContent + data.substring(pos,lastspace)+"</p>";
		//		       if(pageCount==1&&currentLine>-1)
			//          alert("add 1 1 2 line "+currentLine +" " + data.substring(pos,lastspace)+"</p>");
					    breakP = 1;
				    }
				}
				else
				{
					pageContent = pageContent +data.substring(pos,endPos+3);
					contentPos =  data.indexOf("<p",endPos);
					currentLine = currentLine +1;
					breakP = 0;
		//		if(pageCount==1&&currentLine>-1)
		//		alert("add 1 2 0 line "+currentLine +" " +data.substring(pos,endPos+3));
				}
				//alert("content after add in " +pageContent);
				//set up new pages
	//			alert("current Line"+currentLine);
				pageCount = pageCount + 1;
	 //   		alert("page "+pageCount+" "+pageContent);
				var temp = new Object();
				temp.position = pos;
				temp.content = pageContent;
				pagesToDisplay[pageCount] = temp;
   //             alert("New Page "+pageCount);
                //restore variables
				pageContent = "";
				currentLine = 0;
			}

		}
		else if(handle==0)
		{
			contentPos = data.indexOf("<p",endPos);
			imagePos = data.indexOf("<img",endPos);
		}

		if(contentPos>imagePos&&imagePos!=-1)
		{
			handle = 0;
			pos = imagePos;
		}
		else 
		{
			handle = 1;
			pos = contentPos;
		}
		
		if(lastPos == pos)
		{
		    pos = endPos = data.indexOf("<p",pos+2);
		}

	
	}
    var lastP = data.lastIndexOf("/p>");

    if(breakP==1)
    {
        pageContent = "<p"+data.substring(endPos,lastP+3)+"</p>";
    }
    	pageCount = pageCount + 1;	 
   		var temp = new Object();
    	temp.position = endPos;
    	temp.content = pageContent;
    	pagesToDisplay[pageCount] = temp;
    
   
    content.pagesToDisplay = pagesToDisplay;
    //alert("page1 content 1 "+pagesToDisplay[1].content);

    if(position==-1)
        pageNum = pageCount;
    else if(position==0)
        pageNum = 1;
    else
    {

        lastPosition = pagesToDisplay[1].position;
        if(pagesToDisplay.length==2)
        {
            pageNum = 1;
        }
        else
        {
            nextPosition = pagesToDisplay[2].position;
        //alert("totalPages "+pageCount);
  //      alert("positionSeek "+position);
     //   	alert("page1 content 2 "+pagesToDisplay[1].content);

        for(var i=1;i<pagesToDisplay.length;i++)
        {
		    var temp = pagesToDisplay[i];
		//    alert("var i "+i);
		 //   alert("last "+lastPosition);
		   // alert("next "+nextPosition);
             if(position>=lastPosition&&position<nextPosition)
		     {
	        //create a new page
	            if(position==lastPosition)
		        {
		            if(i==1)
		                pageNum = 1;
		            else
		                pageNum = i-1;
		            break;
		        }
		        else
		        {
		 //           alert("come in");
		            var newPage = new Object();
		            var oldPage = new Object();
		            var currentContent = temp.content;
		            var oldContent = currentContent.substring(0,position-temp.position-1);
		 //       alert("old content "+oldContent);
		            var newContent = currentContent.substring(position-temp.position-1);
		//	        alert("new content "+newContent);

		            oldPage.conent = oldContent;
		            oldPage.position = temp.position;
		            newPage.content = newContent;
		            newPage.position = position;
		            var newPagesToDisplay = new Array();
		            for(var j=1;j<i;j++)
		                newPagesToDisplay[i] = pagesToDisplay[i];
		            newPagesToDisplay[i] = oldPage;
		            newPagesToDisplay[i+1] = newPage;
		            pageNum = i+1;
		           // alert("pageNum "+pageNum);
                    for(var j=i+2;j<pagesToDisplay.length+1;j++)
                        newPagesToDisplay[j] = pagesToDisplay[j-1];
                    content.pagesToDisplay = newPagesToDisplay;
		            break;
		        }
		    }
		    else
		    {
		        lastPosition = nextPosition;
		        if(i<pagesToDisplay.length-1)
		        {
		            var temp =  pagesToDisplay[i+1];
		            nextPosition = temp.position;
		        }
		        else
		            nextPosition = data.length;
		            //	alert("page1 content 3"+pagesToDisplay[1].content);

		    }
   	    }
   	    }
   	 }
   	 
   	
    content.pageNum = pageNum;
    content.chapNum = chapNum;
//	alert("page1 content 4"+pagesToDisplay[1].content);
//alert(pageNum);
    if(callback==0)
    return content;
    else
    callback(content);
}

