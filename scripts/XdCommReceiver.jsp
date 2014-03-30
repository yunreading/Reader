







if (!window.XNIntern) {
  XNIntern = {};
}

if (!XNIntern.XdReceiver) {
  XNIntern.XdReceiver = {
    delay : 100,
    timerId : -1,
    dispatchMessage: function() {
      var pathname = document.URL;
      var hashIndex = pathname.indexOf('#');
      var hash;
      if(hashIndex > 0) {
        hash = pathname.substring(hashIndex + 1);
      } else {
        hashIndex = pathname.indexOf('xn_login&');
        if(hashIndex > 0) {
          hash = pathname.substring(hashIndex + 9);
        } else {
          return;
        }
      }

      var debugFlag='debug=1&';
      if(hash.indexOf(debugFlag) == 0) {
        hash = hash.substring(debugFlag.length);
      }

      var packet_string;
      var func = null;
      try {
        var hostWindow = window.parent;
        if (hash.indexOf('fname=') == 0) {
          var packetStart = hash.indexOf('&');
          var frame_name = hash.substr(6, packetStart-6);
          if(frame_name == "_opener") {
            hostWindow = hostWindow.opener;
          } else if (frame_name == "_oparen") {
            hostWindow = hostWindow.opener.parent;
          } else if (frame_name != "_parent") {
            hostWindow = hostWindow.frames[frame_name];
          }
          packet_string = hash.substr(packetStart+1);
        } else {
          hostWindow = hostWindow.parent;
          packet_string = hash;
        }

		if (hostWindow && hostWindow.XN && hostWindow.XN.XdComm &&
		    hostWindow.XN.XdComm.Server &&
		    hostWindow.XN.XdComm.Server.singleton
		    ) {
          func = hostWindow.XN.XdComm.Server.singleton.onReceiverLoaded;
        }
      } catch (e) {
        if (e.number == -2146828218) {
          if (console && console.log) {
          	console.log("Fatal error in XdCommReceiver.js!!!");
          }
          return;
        }
      }

      if(func) {
        window.setTimeout(function(){
        	hostWindow.XN.XdComm.Server.singleton.onReceiverLoaded(packet_string);
        }, 0);
        if(XNIntern.XdReceiver.timerId != -1) {
          window.clearInterval(XNIntern.XdReceiver.timerId);
          XNIntern.XdReceiver.timerId = -1;
        }
      } else {
        if(XNIntern.XdReceiver.timerId == -1) {
          try {
            XNIntern.XdReceiver.timerId = window.setInterval(XNIntern.XdReceiver.dispatchMessage, XNIntern.XdReceiver.delay);
          } catch (e) {
          }
        }
      }
    }
  };

  if (!(window.XN && XN.Bootstrap && !XN.Bootstrap.isXdChannel)) {
    try {
      XNIntern.XdReceiver.dispatchMessage();
    }
    catch(e) {
    }
  }
 }