
/**
 * Handles connnections to the game server, 
 * basically via websocket
 * @param {Number} Port WebSocket port
 */
var YagsClient = function(Port){
	//No chance to play without websockets
	if(!("WebSocket" in window)){  
		alert('Websockets are not supported');
		return;
	}


	// -- EVENTS
    this.opponentsListChange = function(players){
    	var output = opponentsList.render({players:players});
		$('tbody').html(output);	
    }

	/**
	 * Websocket url
	 * @type {String}
	 */
	var wsHost = "ws://localhost:"+Port+"/websocket";
    

	/**
	 * Websoccket connection
	 * @type {WebSocket}
	 */
    this.websocket = new WebSocket(wsHost);

    /**
     * Websocekt call back
     * @param  {[type]} evt [description]
     * @return {[type]}     [description]
     */
    this.websocket.onopen = function(evt) { }; 

    /**
     * Websocekt call back
     * @param  {[type]} evt [description]
     * @return {[type]}     [description]
     */
    this.websocket.onclose = function(evt) { location.href="/logout"}; 

    /**
     * Websocket call back
     * @param  {[type]} evt [description]
     * @return {[type]}     [description]
     */
    this.websocket.onmessage =  $.proxy(function(evt) {  
            var msg=JSON.parse(evt.data);
            if(!this[msg.event]){
                throw "Event "+msg.event+" not supported";
            }
            this[msg.event](msg.data);
        },this);

    /**
     * Websocekt call back
     * @param  {[type]} evt [description]
     * @return {[type]}     [description]
     */
    this.websocket.onerror = function(evt) { };

    
	
};