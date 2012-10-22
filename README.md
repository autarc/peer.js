Peer.js
=======

A wrapper for P2P connections.


Consider
--------

- currently Firefox Nightly is the only browser which has a working DataChannel implementation,
  a flag needs to be enabled

- as you test it localy, the browser needs to be closed - to reset the connection information

- currently the client can either 'offer' or 'answer' a request, they can't handle both
