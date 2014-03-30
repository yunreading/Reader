var IP = "http://www.yunreading.com";
var SZZHCHAR = new Array(1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3,1.3);
var SZZHLINE = new Array(1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2);
var SZZHCHAR2 = new Array(1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5);
var SZZHLINE2 = new Array(1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2,1.2);

var SZENCHAR = new Array(1,1,1,1,1,1,1,1,1,1,1);
var SZENLINE = new Array(0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7,0.7);
var DEFAULT_SCREEN_WIDTH = 600;
var DEFAULT_SCREEN_HEIGHT = 400;
var DEFAULT_FONT_SIZE = 22;

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
	try{
		var url = IP+"/book/"+bookID+"/chapter/"+chapNum;
		var jqxhr = $.getJSON(url, function(book) {
				//alert(book.content);
				mode = 1;
				setCookie("mode",1);
				handleDisplay(book,chapNum,position,width,height,stgs,function (content){
					//alert(content.pageNum);
					var url = IP+"/book/"+bookID+"/title/";
					//alert(url);
					var jqxhr = $.getJSON(url, function(bookTitle) {
						content.title = bookTitle;
						callback(content);
						})
					.error(function() { 
						alert("Fail in get book3"); 
						var content = new Object();
						content.pageNum=0;
						content.chapNum=0;
						content.pagesToDisplay = new Array();
						content.title ="";
						callback(content);})
					});
		})
		.error(function() { 
				alert("Trying offline mode");
				logicGetContentForBook(bookID,chapNum,position,stgs,width,height,0,
					function(status){
					callback(status);
					if(!isNaN(status.pageNum) && status.pageNum>0){
					mode = 0;
					setCookie("mode",0);
					}
					});
				/*
				   var content = new Object();
				   content.pageNum=0;
				   content.chapNum=0;
				   content.title = "";
				   content.pagesToDisplay = new Array();
				   callback(content);
				 */
				})
	} catch (except){
		window.location = "library.html";
		mode = 1;
		setCookie("mode",1);
	}
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
			alert("Fail in get book1"); 
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

	//initialize all variables
	//returning variables
	try{
		var content = new Object(); //return
		var pagesToDisplay = new Array(); //inside content
		var pageContent = ""; //for each page
		var pageNum = 1; //return inside content
		//middle calculation used variables
		var pageCount = 1; //counting current page
		var lang = book.language;
		if(lang=="undefined" || lang==null) lang = "zh";
		var currentLine = 0;
		var breakParagraph = 0;//not breaking a known paragraph
		var leftContent = "";
		var screenWidth = width;
		if(!isFinite(screenWidth) || isNaN(screenWidth) || screenWidth=="undefined" || screenWidth==null)         {
			screenWidth=DEFAULT_SCREEN_WIDTH;
		}
		var screenHeight = height;
		if(!isFinite(screenHeight) || isNaN(screenHeight) || screenHeight=="undefined" || screenHeight==null) screenHeight=DEFAULT_SCREEN_HEIGHT;
		//possible fontSize = 10,12,14,16,18,20,22,24,26,28,30
		var fontSize = stgs.fontSize;
		if(!isFinite(fontSize) || !isNaN(fontSize)) fontSize = DEFAULT_FONT_SIZE;
		if(fontSize<10 || fontSize>30) fontSize = DEFAULT_FONT_SIZE;
		var maxLine = 0;
		var maxChar = 0;
		var distgsh = " ";
		var index = (fontSize-10)/2;
		var charCountFactor = 1;
		var data = book.content;
		if (window.DOMParser)
		{
			parser=new DOMParser();
			xmlDoc=parser.parseFromString(book.content,"text/xml");
		}
		else // Internet Explorer
		{
			xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async="false";
			xmlDoc.loadXML(data); 
		}

		jObject = $(data);
		displayContent = $('p',jObject);

		//manual adjustment for font display
		if(lang=="zh")
		{
			distgsh = "\\";
			distgsh = distgsh+"u";
			maxChar = Math.floor(screenWidth/(fontSize*SZZHCHAR[index]));
			maxLine = Math.floor(screenHeight/(fontSize*SZZHLINE[index]));
			maxLine = Math.max(maxLine-3,3);
			charCountFactor = 5;
		}
		else
		{
			maxChar = Math.floor(screenWidth/(fontSize*SZENCHAR[index]));
			maxLine = Math.floor(screenHeight/(fontSize*SZENLINE[index]));
			maxLine = Math.max(maxLine-3,3);
			charCountFactor = 1;
		}
		//console.log("maxLine "+maxLine+"maxChar "+maxChar);
		//console.log("screenwidth "+screenWidth+"screenHeight "+screenHeight);
		displayContent = new Array();
		displayContent = xmlDoc.getElementsByTagName('p');
		wholeContent = new Array(displayContent.length);
		wholeHTML = new Array(displayContent.length);
		if(displayContent.length==0)
		{
			var oneParagraph = $(data).text();
			if(lang=="zh")
		    {
			    distgsh = "\\";
			    distgsh = distgsh+"u";
			    maxChar = Math.floor(screenWidth/(fontSize*SZZHCHAR2[index]));
			    maxLine = Math.floor(screenHeight/(fontSize*SZZHLINE2[index]));
			    maxLine = Math.max(maxLine-3,3);
			    charCountFactor = 5;
		    }
			displayContent[0] = oneParagraph;
			wholeContent[0] = oneParagraph;
			wholeHTML[0] = "<p>"+oneParagraph+"</p>";
		}
		else
		{
			for(var index=0;index<displayContent.length;index++)
			{
				wholeContent[index] = displayContent[index].textContent;
				wholeHTML[index] = "<p>"+displayContent[index].textContent+"</p>";
			}
		}
		var currentCheckingParagraph = 0;
		var lastPosition = -1;
		var currentPosition  = 0;
		while(currentCheckingParagraph<wholeContent.length)
		{
			//set up page number

			if(position>lastPosition&&position<=currentPosition)
			{   
				pageNum = Math.max(pageCount-1,1);
			}

			var nextLoading = "";
			var nextLoadingHTML = "";
			//not able to finish one page
			if(currentLine<maxLine)
			{
				//read next loading content
				if(breakParagraph ==0)
				{

					nextLoading = wholeContent[currentCheckingParagraph];
					nextLoadingHTML = wholeHTML[currentCheckingParagraph];
					//not enough to fill the whole page
					while(currentCheckingParagraph<wholeContent.length&&nextLoading.length==0)
					{
						currentCheckingParagraph = currentCheckingParagraph + 1;
						nextLoading = wholeContent[currentCheckingParagraph];
						nextLoadingHTML = wholeHTML[currentCheckingParagraph];
					}

					if(currentCheckingParagraph>=wholeContent.length)
						break;
					if(Math.ceil(nextLoading.length/maxChar)+currentLine < maxLine)
					{
						currentLine = currentLine + Math.ceil(nextLoading.length/maxChar)+2;
						pageContent = pageContent + nextLoadingHTML;
						currentCheckingParagraph = currentCheckingParagraph + 1;
						lastPosition = currentPosition;
						currentPosition =Math.max(lastPosition, data.indexOf(nextLoading)+nextLoading.length);
					}

					//enough to fill the whole page
					else
					{
						var endPosition = (maxLine-currentLine)*maxChar;
						if(lang!="zh")
							endPosition = (nextLoading.substring(0,endPosition)).lastIndexOf(distgsh);
						var addContent = nextLoading.substring(0,endPosition);
						leftContent = nextLoading.substring(endPosition);
						breakParagraph = 1;
						currentLine = maxLine;
						pageContent = pageContent + "<p>" + addContent +"</p>";   
						lastPosition = currentPosition;
						currentPosition = Math.max(lastPosition,currentPosition + endPosition);   

					}
				}
				else
				{
					nextLoading = leftContent;
					if(Math.ceil(nextLoading.length/maxChar)+currentLine < maxLine)
					{
						currentLine = currentLine + Math.ceil(nextLoading.length/maxChar)+2;
						pageContent = pageContent + "<p>"+nextLoading+"</p>";
						currentCheckingParagraph = currentCheckingParagraph + 1;
						lastPosition = currentPosition;
						currentPosition = Math.max(lastPosition,data.indexOf(nextLoading)+nextLoading.length);
						leftContent = "";
						breakParagraph = 0;
					}

					//enough to fill the whole page
					else
					{
						var endPosition = (maxLine-currentLine)*maxChar;
						if(lang!="zh")
							endPosition = (nextLoading.substring(0,endPosition)).lastIndexOf(distgsh);
						var addContent = nextLoading.substring(0,endPosition);
						leftContent = nextLoading.substring(endPosition);
						breakParagraph = 1;
						currentLine = maxLine;
						pageContent = pageContent + "<p>" + addContent +"</p>";         
						lastPosition = currentPosition;
						currentPosition = Math.max(lastPosition,currentPosition + endPosition);  
					}
				}
			}

			//page content is enough, update to pages to display and reset all variables except break paragraph
			else
			{
				var newPage = new Object();
				newPage.position = currentPosition;
				newPage.content = pageContent;
				pagesToDisplay[pageCount] = newPage;
				pageCount = pageCount + 1;

				currentLine = 0;
				pageContent = "";

			}
		}


		//return based on different callback functions
		if(pageContent.length!=0)
		{
			var newPage = new Object();
			newPage.position = currentPosition;
			newPage.content = pageContent;
			pagesToDisplay[pageCount] = newPage;
			pageCount = pageCount + 1;


			currentLine = 0;
			pageContent = "";
		}
		if(pagesToDisplay.length==0)
		{
			var newPage = new Object();
			newPage.position = 0;
			newPage.content ="This page is intentionally left as blank";
			pagesToDisplay[1] = newPage;
		}

        console.log(position>currentPosition);
		if(position==-1||position>=currentPosition)
			pageNum = pagesToDisplay.length-1;
		else if(position==0)
			pageNum =1 ;
		content.pagesToDisplay = pagesToDisplay;
		content.pageNum = pageNum;
		content.chapNum = chapNum;
		if(callback==0)
			return content;
		else
			callback(content);
	}catch(except){
		window.location = "library.html";
		mode = 1;
		setCookie("mode",1);
	}
}
