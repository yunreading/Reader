//Google analytics
	      var _gaq = _gaq || []; 
	      _gaq.push(['_setAccount', 'UA-26459146-1']);
	      _gaq.push(['_trackPageview']);
	     (function() {
         var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
         ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
         var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);})();
//End of Google analytics


//Check online status, set the cookie accordingly
if(window.navigator.onLine){
        console.log("setting to online mode");
            setCookie("mode",1);
}

var mode =1;

function handleNonRegUser(nextPosition){
	//alert(nextPosition);
        $("#fb_login_onfly").click(function(){fbauthen(nextPosition)});
        $("#rr_login_onfly").click(function(){authen(nextPosition)});
		$('#btn_not_to_login').live('click', function(){
			setCookie("userID",1);
			if(nextPosition == "library.html"){
				var str = location.href.split("/");
				nextPosition = str[str.length-1].split("#")[0];
			}
			//alert(nextPosition);
			window.location = nextPosition;
		});
    	//alert(nextPosition);
	window.location="login.html?"+nextPosition;
}

function guest_login()
{
   userID=1;
   $('#btn_login').hide();
   $('#btn_out').show();
}

function login()
{
  window.location="login.html";
}

function logout()
{
$('#btn_login').show();
$('#btn_out').hide();
$('#btn_library').hide();
setCookie('userID',1);
userID=1;
}
  function rrauthen(nextLocation)
  {
     	Renren.ui
			({
				url : 'http://graph.renren.com/oauth/authorize',
				display : 'popup',
				params : {"response_type":"token",
						  "client_id": 163365},
				onComplete : function(response){
					 if(window.console){
						 if(response.access_token) 
						 {
							 console.log("access token:"+ response.access_token);
							 var str=response.access_token;
							 console.log(str.substring(str.lastIndexOf('-')+1));
							 $.ajax(
								{ 
								   url			: "http://www.yunreading.com/user",
								   dataType	: 'json',
								   data        :
								  {
									  social_id:"rr_"+str.substring(str.lastIndexOf('-')+1)
								  },
								  type		: 'post',
								  success: function (out)
								  {
									  userID=out['u_id'];
									  setCookie("userID",userID);
									  $('#btn_login').hide();
									  $('#btn_out').show();
									  $('#btn_lan').hide();
									  if(nextLocation!=null){
										window.location = nextLocation;
									  }
								  },
								  error: function()
								 {
								 }
							   });
						 }
						 if(response.error) 
							 console.log("failure: " + response.error + ',' + response.error_description);
					 }
				}
		   });
  }
 // The function to get Yunreading user ID from Facebook user ID
	    function fbauthen(nextLocation)
		{
	       FB.login(function(response) {
   		        if (response.authResponse) {
                    //console.log('Welcome!  Fetching your information.... ');
		            FB.api("me",function(response){
                        var socialID=response.id;
                        if(socialID!= null) {
                            $.ajax({ 
        				        url		    : "/user",
        				        dataType	: 'json',
        				        data        :{social_id:"fb_"+socialID},
        					    type		: 'post',
        				        success     : function (out){
        					    		        userID = out['u_id'];
        					    		        setCookie("userID",userID);
        					    		        //userID = out['u_id'];
        					    		        $('#btn_out').show();
        					    		        $('#btn_login').hide();
												$('#btn_lan').hide();
                                                if(nextLocation!=null){
            					    		        window.location = nextLocation;
                                                }
        					    	        },
        				        error       : function(){
                                                alert("error");//unexpected errors
                                              }
                                });
                        }else alert("Error With Your Facebook Account");
                    });
	            } else {
		            //console.log('User cancelled login or did not fully authorize.');
	            }
	        });
        }
		function feeds(bookID,booktitle,author)
        { 
		    FB.init({appId: "268974906448534", status: true, cookie: true});
			  // calling the API ...
			var obj = {
			  method: 'feed',
			  link: 'http://www.yunreading.com',
			  picture: 'http://www.yunreading.com/book/'+bookID+'/cover',
			  name: booktitle,
			  caption: author,
			  description: 'Good Book'
			};
			function callback(response) {
			  console.log(response);
			}
			FB.ui(obj, callback);
        };
		var appId = '163365';
		 function rrfeeds(bookID,booktitle)
		{ 
			Renren.ui({
			url : 'feed',
			display :'popup',          
			style : {                       
			},
			params : {
				app_id: appId,
				url:'http://www.yunreading.com',
				name:booktitle,
				description:'一起来云读吧',
				image:'http://www.yunreading.com/book/'+bookID+'/cover',
				redirect_uri:'http://www.yunreading.com'
			},
			onComplete : function(response){
				if(window.console) 
					console.log("complete");
				alert("分享成功");
			},
			onFailure : function(response){
				if(window.console) 
					console.log("failure: " + response.error + ',' + response.error_description);
				alert("分享未成");
			 }
			});
		}
function registerOnlineOfflineEvent(onlineCallback, offlineCallback){
	window.addEventListener("online", onlineCallback, true);
	window.addEventListener("offline", offlineCallback, true);
}

function onlineCallback(){
		$('#status').html("<span class='online'>ONLINE</span>");
		mode = 1;
		setCookie("mode",1);
} 

function offlineCallback() {
		//$('#status').show();
		$('#status').html("<span class='offline'>OFFLINE</span>");
		mode = 0;
		setCookie("mode",0);
}

function onload(){
	registerOnlineOfflineEvent(onlineCallback, offlineCallback);
}
