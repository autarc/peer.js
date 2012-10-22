peer.js
=======

A wrapper for P2P connections.


API:

| new Peer( [ id ] )
| .connect( [ peer objects ], callback )


Consider
--------

- currently Firefox Nightly is the only browser which has a working DataChannel implementation,
  a flag needs to be enabled [link](http://mozillamediagoddess.org/2012/10/12/webrtc-for-desktop-is-in-nightly/)

- as you test the script localy, the browser needs to be closed - to reset the connection information

- currently the client can either 'offer' or 'answer' a request, they can't handle both

- a media stream is required for the transport, the fake property avoids permission request


ToDo
----

- fix for regular usage
- adjust for upcoming specifications
