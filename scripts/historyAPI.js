var IP = "http://www.yunreading.com";
//============================ get history ====================================
function getHistory(userID,bookID,callback)
{
     if(userID==1) 
    {
        console.log("guest user, get history"); 
        var history = new Object();
	    history.chapterID = 1;
	    history.lastTime = 0;
	    history.lastPosition = 0;
	    callback(history);
    }
    else
    {
        var url = IP+"/user/"+userID+"/book/"+bookID+"/";
        //alert("URL in hsty"+url);
        var jqxhr = $.getJSON(url, function(data) 
        {
            handleHistoryData(data,callback);
        })
        .error(function() { 
            console.log("Fails in getting history");
             var history = new Object();
	        history.chapterID = 1;
	        history.lastTime = 0;
	        history.lastPosition = 0;
	        callback(history);
        })
    }
}


function handleHistoryData(data,callback)
{
	var history = new Object();
	history.chapterID = data["c_id"];
	history.lastTime = data["lastTime"];
	history.lastPosition = data["lastPosition"];
	callback(history);
}


//============================ update history ====================================
function updateHistory(userID,bookID,chapterID,position,callback)
{
	 if(userID==1) 
    {
        console.log ("guest user,update history"); 
	    callback(1);
    }
    else
    {
	    var url = IP+"/user/"+userID+"/book/"+bookID+"/";
	    var data = {"u_id":userID,"b_id":bookID,"c_id":chapterID,"lastPosition":position};
        $.ajax({
		    type: 'PUT',
		    url: url,
		    data:data,
		    success: function(){callback(1);},
		    error:function(){callback(0);},
		    dataType: "json"
	    });
	}
}


