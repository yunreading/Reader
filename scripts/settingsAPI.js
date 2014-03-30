var IP = "http://www.yunreading.com";
//============================ get settings ====================================
function getSettings(userID,callback)
{
    if(userID ==1)
    {
        console.log("Guest User, get settings");
        var settings = new Object();
	    settings.font = "Arial";
        settings.fontSize ="22";
        settings.textColor = "#000000";
        settings.backColor = "#f0f0f0";
	    callback(settings);
	}
	else
	{
        
        var url = IP+"/user/"+userID+"/setting";
        var jqxhr = $.getJSON(url, function(data) 
        {
            handleSettingsData(data,callback);
        })
        .error(function() { 
            console.log("Database error, return default settings");
            var settings = new Object();
	        settings.font = "Arial";
            settings.fontSize ="22";
            settings.textColor = "#000000";
            settings.backColor = "#f0f0f0";
	        callback(settings);
        })
    }
}


function handleSettingsData(data,callback)
{
	var settings = new Object();
	settings.font = data["font"];
	settings.fontSize = data["font_size"];
	settings.textColor = data["text_color"];
	settings.backColor = data["bg_color"];
	callback(settings);
}


//============================ update settings ====================================
function updateSettings(userID,font,fontSize,textColor,backColor,callback)
{
    if(userID == 1)
    {
        console.log("Guest user, update settings");
        callback(1);
    }
    else
    {
	    $.mobile.pageLoading();
	    var url = "http://www.yunreading.com/user/"+userID+"/setting";
	    var data = {"font":font,"font_size":fontSize,"text_color":textColor,"bg_color":backColor};
        $.ajax({
		    type: 'PUT',
		    url: url,
		    data:data,
		    success: function(data){callback(1);},
		    error:function(){callback(0);},
		    dataType: "json"
	    });
	}
}


