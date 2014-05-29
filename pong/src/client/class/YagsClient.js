
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
	wsHost = "ws://localhost:"+Port+"/websocket";
    websocket = new WebSocket(wsHost);

    websocket.onopen = function(evt) { }; 
    websocket.onclose = function(evt) { location.href="/logout"}; 
    websocket.onmessage = function(evt) { 
    					
							players=JSON.parse(evt.data);
							var output = opponentsList.render({players:players});
							$('tbody').html(output);

    					}; 
    websocket.onerror = function(evt) { }; 
	
};