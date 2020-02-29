(function() {
  //$.verto.init({}, bootstrapBase);
    //vertoInit();
})();

var vertoHandleBase, vertoCallbacksBase, currentCallBase, callListBase;
var loginExtensionBase, fsDomainBase, pwBase, callerIdNameBase;
var wssServerBase;
var bandwidthTestDataBase;
var destinationNumberBase;
var decliningCall = false;
var useVideoBase = false;

var standaloneDemo = false;
//standaloneDemo = true;

function vertoInit(){
    $.verto.init({}, bootstrapBase);
}

function bootstrapBase(status) {

  console.log("Setting wssServerBase = fsDomainBase.");
  console.log(fsDomainBase);
  wssServerBase = fsDomainBase;

  // var which_server = "wss://" + wssServerBase + ":8082";
  var which_server = "wss://dhcomm.net:8082";

  console.log("loginExtensionBase = " + loginExtensionBase);
  console.log("fsDomainBase = " + fsDomainBase);
  console.log("wssServerBase = " + wssServerBase);
  console.log("which_server=", which_server);
  console.log("login = " + loginExtensionBase + '@' + fsDomainBase);
  
  varSessid = $.verto.genUUID();
  

  vertoHandleBase = new jQuery.verto({
    login: loginExtensionBase + '@' + fsDomainBase,
    passwd: pwBase,
    socketUrl: which_server,
    ringFile: '',
    iceServers: true,
    useVideo: true,
    tag: 'video-remote',
    localTag: 'video-local',
    audioParams: {
      googEchoCancellation: true,
      googAutoGainControl: true,
      googNoiseSuppression: true,
      googHighpassFilter: true,
      googTypingNoiseDetection: true,
      googEchoCancellation2: false,
      googAutoGainControl2: false,
    },
    deviceParams: {
      useMic: 'any',
      useSpeak: 'any',
      useCamera:  'any'
    },
    sessid: varSessid
  }, vertoCallbacksBase);
}; // function bootstrapBase

vertoCallbacksBase = {
  onDialogState: onDialogStateBase,
  onWSLogin: onWSLoginBase,
  onWSClose: onWSCloseBase,
  onMessage: onMessageBase
}; // vertoCallbacksBase
console.log("vertoCallbacksBase");
console.log(vertoCallbacksBase);

var testBandwidthBase = function() {
  // Translates to 256KB.
  var bytesToSendAndReceive = 1024 * 256;
  vertoHandleBase.rpcClient.speedTest(bytesToSendAndReceive, function(event, data) {
    // These values are in kilobits/sec.
    var upBand = Math.ceil(data.upKPS);
    var downBand = Math.ceil(data.downKPS);
    console.log('[BANDWIDTH TEST] Up: ' + upBand + ', Down: ' + downBand);
    // Store the results for later.
    bandwidthTestDataBase = data;
  });
}; // testBandwidthBase

function tag() {
  var vid = document.createElement('video');
  vid.setAttribute("style", "width: 100%; height: 100%");
  vid.setAttribute("autoplay", "autoplay");
  var randomNumber = Math.floor(Math.random() * (10000000 - 1000000 + 1)) + 1000000; // Math.floor(Math.random() * (max - min + 1)) + min;
  vid.id = "v-" + randomNumber;
  document.getElementById("videoElements").appendChild(vid);
  // vid.id = "video-container";
  // document.getElementById("video-container").appendChild(vid);
  console.log(vid);
  return vid.id;
}

function makeCallBase() {

  vertoHandleBase.videoParams({
    // Dimensions of the video feed to send.
    minWidth: 640,
    minHeight: 480,
    maxWidth: 640,
    maxHeight: 480,
    // The minimum frame rate of the client camera, Verto will fail if it's
    // less than this.
    minFrameRate: 15,
    // The maximum frame rate to send from the camera.
    vertoBestFrameRate: 30
  });

  if(standaloneDemo) {
    destinationNumberBase = document.getElementById("destinationNumberBase").value;
  }

  if(destinationNumberBase === null) {
    destinationNumberBase = $("#lblExtension").html();
  }

  console.log("destinationNumberBase = " + destinationNumberBase);
  destinationNumberBase = destinationNumberBase.replace(/\(/g, "").replace(/\)/g, "").replace(/ /g, "").replace(/-/g, "");
  console.log("After str replace, destinationNumberBase = " + destinationNumberBase);
 

  console.log(bandwidthTestDataBase.upKPS + ' X ' + bandwidthTestDataBase.downKPS);

  currentCallBase = vertoHandleBase.newCall({
    // Extension to dial.
    destination_number: destinationNumberBase,
    caller_id_name: callerIdNameBase,
    caller_id_number: loginExtensionBase,
    useStereo: true,
    useVideo: true,
    tag: 'video-remote',
    localTag: 'video-local',
    mirrorInput: true,  
    //screenShare: true,
    deviceParams: {
      useMic: 'any',
      useSpeak: 'any',
      useCamera: 'any'
    },   
    sessid: varSessid,
    outgoingBandwidth: bandwidthTestDataBase.upKPS,
    incomingBandwidth: bandwidthTestDataBase.downKPS,
    // You can pass any application/call specific variables here, and they will
    // be available as a dialplan variable, prefixed with 'verto_dvar_'.
    userVariables: {
      // Shows up as a 'verto_dvar_email' dialplan variable.
      email: 'test@test.com'
    },
    // Use a dedicated outbound encoder for this user's video.
    // NOTE: This is generally only needed if the user has some kind of
    // non-standard video setup, and is not recommended to use, as it
    // dramatically increases the CPU usage for the conference.
    dedEnc: false
    // Example of setting the devices per-call.
    //useMic: 'any',
    //useSpeak: 'any',
  });

}; // makeCallBase



function onWSLoginBase(verto, success) {
  console.log('onWSLoginBase', success);
  if(success) {
      testBandwidthBase();
  }
}; // onWSLoginBase

// Receives conference-related messages from FreeSWITCH.
// Note that it's possible to write server-side modules to send customized
// messages via this callback.
function onMessageBase(verto, dialog, message, data) {
  // console.log("onMessageBase called, message = ");
  // console.log(message);
  switch (message) {
    case $.verto.enum.message.pvtEvent:
      if (data.pvtData) {
        switch (data.pvtData.action) {
          // This client has joined the live array for the conference.
          case "conference-liveArray-join":
            // With the initial live array data from the server, you can
            // configure/subscribe to the live array.
            //console.log("Calling initLiveArray");
            initLiveArray(verto, dialog, data);
            break;
          // This client has left the live array for the conference.
          case "conference-liveArray-part":
            // Some kind of client-side wrapup...
            break;
        }
      }
      break;
  }
} // onMessageBase

function enableVideo(){
  if(currentCallBase) {
    console.log('enableVideo');
    currentCallBase.useVideo = true;
    
  }
} // enableVideo

function loginBase(){
  // bootstrapBase();
  vertoInit();
} // loginBase

function holdCallBase(){
  if(currentCallBase.state.name !== 'held') {
    currentCallBase.hold();
  }
  else {
    currentCallBase.unhold();
  }
} // holdCallBase

function muteCallBase(){
  console.log("muting");
  currentCallBase.setMute("toggle");
} // muteCallBase

function sendtovoicemail(){
  console.log('sendtovoicemail');
    try {
        if(currentCallBase !== null) {
        currentCallBase.transfer("*99" + loginExtensionBase);
        }
    } catch(ex) {
    }
} // sendtovoicemail

function transferCallBase(destinationNumber){
  console.log('transferCallBase');
  currentCallBase.transfer(destinationNumber);
} // transferCallBase

function hangupCallBase() {
    try {
        if(currentCallBase !== null) {
            currentCallBase.hangup();
        }
    } catch(ex) {
    }
}; // hangupCallBase

function declineCallBase() {
    console.log("verto declineCall,   [currentCallBase]  " );
    
    try {
        if(currentCallBase !== null) {
            decliningCall = true;
            answerCallBase(true);
            setTimeout(function(){
                //do what you need here
                hangupCallBase();
            }, 2000);
        }
    } catch(ex) {
    }
}

function answerDialog(incomingData) {
    console.log("Entering answerDialog");
    
    var event = new CustomEvent('showCall', {
      detail: {
        phone_number: currentCallBase.params.caller_id_number, 
        name: currentCallBase.params.caller_id_name,
        id : currentCallBase.callID
      }
    })
    window.dispatchEvent(event);
}

function onCallDialog(incomingData) {
    console.log("Entering onCallDialog");
    console.log(currentCallBase);

    var event = new CustomEvent("oncalldlg", {
      detail: {
        data: currentCallBase
      }
    })
    window.dispatchEvent(event);

}
    
function onCallDialogDismiss(incomingData) {
    console.log("Entering onCallDialogDismiss");
    console.log(incomingData);
    try {

        var event = new CustomEvent("oncalldlgDismiss", {
          detail: {
            data: incomingData
          }
        })
        window.dispatchEvent(event);

    } catch(ex) {
    }
}
 
function on3WayCall(data) {
    console.log("Entering on3WayCall");
    
    try {
        var element = angular.element($('#onCallContainer'));
        var controller = element.controller();
        var scopeVar = element.scope();

        if(!scopeVar.$$phase) {
            //as this happends outside of angular you probably have to notify angular 
            //of the change by wrapping your function call in $apply
            scopeVar.$apply(function(){
                scopeVar.outgoing3WayCall(data);
            });
        }
        
    } catch(ex) {
    }
}

function onCall3WayMergeDismiss(data) {
    console.log("Entering onCall3WayMergeDismiss");
    
      try {
              var element = angular.element($('#onCallContainer'));
              var controller = element.controller();
              var scopeVar = element.scope();

              scopeVar.$apply(function(){
                  scopeVar.onCall3WayMergeDismiss(data);
              });

      } catch(ex) {

      }
}



function answerCallBase() {
    // alert("answerCallBase");
    try {
        if(currentCallBase !== null) {     
            currentCallBase.answer({
              useVideo: true,
              useStereo: true,
            });
        }
    } catch(ex) {
    }
}; // answerCallBase

function onWSCloseBase(verto, success) {
  console.log('onWSCloseBase', success);
}; // onWSCloseBase

// Receives call state messages from FreeSWITCH.
function onDialogStateBase(d) {
  console.log("Call state =============================> " + d.state.name + "; " + d.verto.options.tag);
  
  if(!currentCallBase) {
    // when the call is incoming...
      currentCallBase = d;     

  }
  
  var callIsListed = false;
  if(typeof callListBase === 'undefined') {
      console.log("Initializing callListBase");
      callListBase = Object.create(null);
  }
 
    
  for(var k in callListBase) {
      if(d.callID === k) {
          callIsListed = true;
          callListBase[k] = d;
      }
  }
    
  if(!callIsListed) {
    //console.log("=======================>  Adding callID " + d.callID + " to list");
    callListBase[d.callID] = d;
  }


  switch (d.state.name) {
  
    case "requesting":

      break;

    case "trying":
        console.debug('Calling:', d.cidString());

        on3WayCall(d);
        break;

    case "early":
        console.debug('Talking to:', d.cidString());

        break;


    case "answering":
      console.log("answering");

      break;

    case "active":

        console.debug(d.cidString());
      currentCallBase = d;
      if(d.lastState.name === "held") {
          break;
      }
      console.log(d);
      data = {
        "phone_number": d.params.caller_id_number,
        "name": d.params.caller_id_number,
        "id" : "id"
      };
      if(!decliningCall) {
        onCallDialog();
      }

      if(callListBase) {
        var keys = Object.keys(callListBase);
        if(keys.length == 1) { 
          console.log('---------------------------------------------------->>> ');  
          console.log(callListBase[keys[0]].verto); 
          // callListBase[keys[0]].verto.options.tag = tag();
          callListBase[keys[0]].verto.options.localTag = 'video-local';
          callListBase[keys[0]].verto.options.tag = 'video-remote';
          
        }
      }
      break;


    case "hangup":
      console.log("Call ended with cause: " + d.cause);
      console.log(d);
      onCallDialogDismiss(d);
      decliningCall = false;
      break;


    case "ringing":
        console.log('Incoming call is ringing');
        console.log(currentCallBase);
        //enableVideo();
        // currentCallBase = d;
        
        console.log(Object.keys(callListBase).length + " calls in list");
        if(Object.keys(callListBase).length >= 3) {
          d.transfer("*99" + d.params.callee_id_number);
          break;
        }

        answerDialog();
        
        
        break;
    case "offering":
        console.log('offering');
        break;
    case "destroy":
        
        delete callListBase[d.callID];
        currentCallBase = null;
        break;
  }
  
//  console.log("++++++++++    Call array:   ++++++++++" );
//  console.log(callListBase);
}; // onDialogStateBase

/*
 * Setting up and subscribing to the live array.
 */
var vertoConfBase, liveArrayBase;
var initLiveArray = function(verto, dialog, data) {
    // Set up addtional configuration specific to the call.
    vertoConfBase = new $.verto.conf(verto, {
      dialog: dialog,
      hasVid: true,
      laData: data.pvtData,
      // For subscribing to published chat messages.
      chatCallback: function(verto, eventObj) {
        var from = eventObj.data.fromDisplay || eventObj.data.from || 'Unknown';
        var message = eventObj.data.message || '';
      }
    }); // initLiveArray

    var configBase = {
      subParams: {
        callID: dialog ? dialog.callID : null
      }
    }; // configBase

    // Set up the live array, using the live array data received from FreeSWITCH.
    liveArrayBase = new $.verto.liveArray(verto, data.pvtData.laChannel, data.pvtData.laName, configBase);
    // Subscribe to live array changes.
    liveArrayBase.onChange = function(liveArrayObj, args) {
      //console.log("Call UUID is: " + args.key);
      //console.log("Call data is: ", args.data);
      try {
        switch (args.action) {

          // Initial list of existing conference users.
          case "bootObj":
            //console.log("bootObj");
            //console.log(liveArrayObj);
            //console.log("Call UUID is: " + args.key);
            // console.log("Call data is: ", args.data);
            break;

          // New user joined conference.
          case "add":
            // console.log("User joined");
            // console.log(liveArrayObj);
            // console.log("Call UUID is: " + args.key);
            // console.log("Call data is: ", args.data);
            break;

          // User left conference.
          case "del":

            // Erik:  Handle the hangup of a conference leg here.
            

            //console.log("User left");
            //console.log(liveArrayObj);
            //console.log("Call UUID is: " + args.key);
            console.log("Call data is: ", args);
            
            
            var data = {callID: args.key};
            onCall3WayMergeDismiss(data);
                       
            break;

          // Existing user's state changed (mute/unmute, talking, floor, etc)
          case "modify":
            break;

        }
      } catch (err) {
        console.error("ERROR: " + err);
      }
    }; // liveArrayBase.onChange

    // Called if the live array throws an error.
    liveArrayBase.onErr = function (obj, args) {
      console.error("Error: ", obj, args);
    }; // liveArrayBase.onErr
}; // initLiveArray  

