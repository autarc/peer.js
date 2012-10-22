(function () {

	setTimeout(function(){

		console.log('Start....');

		var p1 = new Peer( 5000 ),
			p2 = new Peer( 5001 );

		setTimeout(function(){

			p1.connect( p2, function(){

				console.log('Callback');
			});

		}, 2000);


	}, 2000);

})();
