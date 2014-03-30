function getCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
	}

	// This will return null if it doesn't exist
	var ret;
	try{
		ret = localStorage.getItem(c_name);
	} catch (e){
		ret = null;
	}
	return ret;
}

function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
	try{
		localStorage.setItem(c_name,value);
	} catch (e){

	}
}

function checkuserIDCookie()
{
	var userID=getCookie("userID");
	if (userID!=null && !isNaN(userID) && userID!="")
	{
		return userID;
	}
	else 
	{
		return 1;
	}
}


function checkbookIDCookie()
{
	var bookID=getCookie("bookID");
	if (bookID!=null && !isNaN(bookID) && bookID!="")
	{
		return bookID;
	}
	else 
	{
		return 0;
	}
}

function checkmodeCookie()
{
	var mode=getCookie("mode");
	if (mode!=null && mode!="")
	{
		return mode;
	}
	else 
	{
		return 1;
	}
}
