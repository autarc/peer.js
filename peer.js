/* Peer  */
(function() {

	var RTCPeerConnection =	window.mozRTCPeerConnection		||   // Firefox
							window.webkitPeerConnection00	||   // Chrome
							window.RTCPeerConnection;            // * specs ?

	if ( !RTCPeerConnection ) {

		console.log('Your browser doesn\'t support PeerConnections yet...');

	} else {

        window.Peer = (function(){

            // normalize APIs
            if ( !navigator.getUserMedia ) {

                navigator.getUserMedia =    navigator.mozGetUserMedia       ||
                                            navigator.webkitGetUserMedia    ||
                                            navigator.msGetUserMedia;
            }

            // logging errors
            function logerr ( err ) {

                console.log( err );
            }



            var Peer = function ( id, config ) {

                this.id = id;

                // collections
                this.createdChannels = {};
                this.connectedChannels = {};
                this.connections = {};


                // configuration
                config = config || {};

                config = {

                    fake:   config.fake     || true,
                    video:  config.video    || true,
                    audio:  config.audio    || true
                };

                this.init( config );
            };


            /* Create stream - attach handler */
            Peer.prototype.init = function ( config ) {

                this.client = new RTCPeerConnection();

                this.addHandler();

                navigator.getUserMedia( config, function ( stream ) {

                    this.stream = stream;

                    this.client.addStream( stream );

                }.bind(this), logerr );
            };



            Peer.prototype.connect = function ( partners, callback ) {

                // one partner
                if ( !partners.length ) {

                    partners = [ partners ];
                }

                this.partners = partners;

                this.connected = callback;

                if ( this.stream ) { // stream is ready..

                    this.createOffer();

                } else {

                    console.log('Stream not ready, async...');
                }
            };



            // create offer for possible partners
            Peer.prototype.createOffer = function() {

                console.log('createOffer: ', this);

                this.client.createOffer( function ( offer ) {

                    this.offer = offer;

                    this.client.setLocalDescription( offer, function(){

                        this.setRemoteDescriptions();

                    }.bind(this), logerr );

                }.bind(this), logerr );
            };



            Peer.prototype.setRemoteDescriptions = function(){

                this.partners.forEach(function ( partner ) {


                    partner.client.setRemoteDescription( this.offer, function(){

                        partner.client.createAnswer( function ( answer ) {

                            partner.answer = answer;

                            partner.client.setLocalDescription( answer, function(){

                                setTimeout(function(){ // timer prevent crashing....

                                    this.client.setRemoteDescription( answer, function(){

                                        this.establishConnection( partner );

                                    }.bind(this), logerr );

                                }.bind(this), 4000);


                            }.bind(this), logerr );

                        }.bind(this), logerr );

                    }.bind(this), logerr );


                }, this);
            };



            Peer.prototype.establishConnection = function ( partner ) {

                try {

                    console.log(this.id); // internal, return 1000
                    console.log(partner.id); // return 2000....

                    this.client.connectDataConnection( this.id, partner.id );
                    partner.client.connectDataConnection( partner.id, this.id );

                } catch ( err ) {

                    console.log( err );
                }
            };



            Peer.prototype.addHandler = function(){

                var client = this.client;

                client.ondatachannel = this.onChannel;
                client.onconnection = this.onConnection;
                client.onclosedconnection = this.onClosedConnection;
                client.onstatechange = this.onStateChange;
            };


            Peer.prototype.onStateChange = function ( msg ) {

                console.log(msg);
            };


            Peer.prototype.onChannel = function ( channel ) {

                console.log(channel);
                // this.connectedChannels[channel.id] = channel;

                // channel.onopen = function(){};
                // channel.onmessage = function(){}; //
                // channel.onclose = function(){};

                // console.log( channel.readyState  );
            };


            Peer.prototype.onConnection = function ( connection ) {

                console.log(connection);

                // this.connections[connection.id] = connection;

                // still needs to handle if multiple connections...
                // this.connected();
            };


            Peer.prototype.onClosedConnection = function ( connection ) {

                console.log(connection);
                // delete this.connections[connection.id];
            };




            Peer.prototype.createChannel = function ( config ) {

                // default - reliable connection
                var channel = this.client.createDataChannel( config.id, config.type || {} );

                console.log(channel.id);

                if ( config.onopen ) channel.onopen = config.onopen.bind( channel );
                if ( config.onmessage ) channel.onmessage = config.onmessage.bind( channel );
                if ( config.onclose ) channel.onclose = config.onclose;

                this.createdChannels[channel.id] = channel;
            };


            return Peer;

        })();

    }

})();
