/* simplePeer  */
(function() {

  /*-------------------------------------------

    structure
    =========

    createOffer();      // pc1
    setLocal();       // pc1

    setRemote();      // pc2
    createAnswer();     // pc2
    setLocal();       // pc2

    setRemote();      // pc1

    createDataChannels(); // pc1 && pc2


    A connection can be used to create multiple channels, seperating the information channels...

  --------------------------------------------- */


  function err ( msg ) {

    console.error( msg );
  }

  var RTCPeerConnection = window.mozRTCPeerConnection   ||   // Firefox
                          window.webkitPeerConnection00 ||   // Chrome
                          window.RTCPeerConnection;            // * specs ?

  if ( !RTCPeerConnection ) {

    console.log('Your browser doesn\'t support PeerConnections yet...');

  } else {


        if ( !config ) {

            config = {};
        }

        var config = {

            fake:   config.fake     || true,
            video:  config.video    || true,
            audio:  config.audio    || true
        };


        // normalize APIs
        if ( !navigator.getUserMedia ) {

            navigator.getUserMedia =    navigator.mozGetUserMedia       ||
                                        navigator.webkitGetUserMedia    ||
                                        navigator.msGetUserMedia;
        }


        var pc1,
            pc1_offer,
            pc1_channels = [],

            pc2,
            pc2_answer,
            pc2_channels = [],

            dc1,
            dc2,

            placeholder;    // fakestream


        window.channel1 = pc1_channels;
        window.channel2 = pc2_channels;


        setTimeout( function(){

            createPeer1();

        }, 3000);






        var createChannels = function(){
            console.log('4.) createChannels');

            setTimeout(function(){

                try {

                    pc1.connectDataConnection( 5000, 5001 );
                    pc2.connectDataConnection( 5001, 5000 );

                } catch ( err ) {

                    console.info( err );
                }

            }, 2000);
        };

        var setLocal = function(){

            console.log('3.) setLocal');

            pc2.setRemoteDescription( pc1_offer, function(){ // set finished

                pc2.createAnswer( function ( answer ) { // created answer

                    pc2_answer = answer;

                    pc2.setLocalDescription( answer, function(){

                      pc1.setRemoteDescription( pc2_answer, createChannels, err );

                    }, err );

                });

            }, err);
        };


        var createPeer2 = function(){

            pc2 = new RTCPeerConnection();

            pc2.addStream( placeholder );

            // as channel gets created
            pc2.ondatachannel = function ( channel ) {

                console.log('pc2: channel(',channel,')');

                pc2_channels.push( channel );

                channel.onopen = function(){

                    channel.send('pc2: ','Hello World...');
                };

                channel.onmessage = function ( msg ) {

                    var data = msg.data;

                    console.log('pc2: ', data);
                };

                channel.onclose = function(){

                    console.log('Channel got closed....');
                };

                // if ( channel.readyState !== 0 ){ // race condition check ?
                //     // console.log('race condition ?');
                // }

            };

            // as a connection gets established
            pc2.onconnection = function(){

                console.log('pc2 - connected...');

            };

            pc2.onclosedconnection = function(){

                console.log('Connection closed...');
            };


            // create offer
            setTimeout(function(){

                setLocal();

            }, 5000);
        };




    var createOffer = function ( offer ) {

            console.log('2.) createOffer');

      pc1_offer = offer;

      pc1.setLocalDescription( offer, function(){

                createPeer2();

            }, err );
    };





    var createPeer1 = function() {

            console.log('1.) createPeer1');

      pc1 = new RTCPeerConnection();

            // as channel gets created
      pc1.ondatachannel = function( channel ) {
                // console.log(channel);
    //             pc1_channels.push( channel );

        // channel.onopen = function(){

    //                 channel.send('Hello World...');
        // };

        // channel.onmessage = function ( msg ) {

        // };

        // channel.onclose = function(){

    //                 console.log('Channel got closed....');
    //             };

    //             if ( channel.readyState !== 0 ){ // race condition check ?
    //                 console.log('race condition ?');
    //             }

            };

            // as a connection gets established
            pc1.onconnection = function(){

                console.log('pc1 connected');

                // reliable - TCP like
                dc1 = pc1.createDataChannel('ch1', {});
                // dc1.binarytype = 'blob';
                // console.log('channel: ', dc1, ' | binarytype: ', dc1.binarytype );

                // unreliable - UDP like
                // dc2 = pc2.createDataChannel('ch2', { outOfOrderAllowed: true, maxRetransmitNum: 0 });
                // console.log('channel: ', dc2, ' | binarytype: ', dc2.binarytype );


                dc1.onopen = function(){

                    // console.log('dc1.state:', dc1.state);
                    dc1.send(11111);
                };


                // counterpart for "ondatachannel" - since it got created, her new declarations
                dc1.onmessage = function ( msg ) {

                    var data = msg.data;

                    console.log('pc1: ', data);
                };

                dc1.onclose = function(){        };

                pc1_channels.push(dc1);
            };


            pc1.onclosedconnection = function(){

                console.log('Connection closed...');
            };

           // create offer
            navigator.getUserMedia( config, function ( stream ) {

                pc1.addStream( stream );

                placeholder = stream;

                pc1.createOffer( createOffer, err );

            }, err);

    };

}

})();
