
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
    websocket.onopen = function(evt) { alert('connected'); }; 
    websocket.onclose = function(evt) { alert('disconected'); }; 
    websocket.onmessage = function(evt) { alert(evt.data); }; 
    websocket.onerror = function(evt) { }; 
	
};