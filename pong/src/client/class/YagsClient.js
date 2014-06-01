
/**
 * Handles connnections to the game server, 
 * basically via websocket
 * @param {Number} Port WebSocket port
 */
var YagsClient = {
	/**
     * Websoccket connection
     * @type {WebSocket}
     */
    websocket:null,

    /**
     * Opponent Hash
     * @type {string}
     */
    opponent:null,

    /**
     * User Hash
     * @type {string}
     */
    user:null,

    init:function(Port,UserHash,OpponentHash,start){
            //The cool kids use websockets
        if(!("WebSocket" in window)){  
            alert('Websockets are not supported');
            return;
        };

        /**
        * Opponent Hash
        * @type {string}
        */
        this.opponent=OpponentHash;

        /**
        * User Hash
        * @type {string}
        */
        this.user=UserHash;

        /**
         * Websocket url
         * @type {String}
         */
        var wsHost = "ws://192.168.2.103:"+Port+"/websocket";

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
        this.websocket.onopen = function(evt) {
                /**
                * register socket connection with Player Hash
                */
                console.log('register HASH:'+YagsClient.user);
                YagsClient.websocket.send(JSON.stringify({
                        RegisterHash: YagsClient.user
                }));

                if(!start){
                    YagsClient.sendStartGame();
                }
        }; 

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
        this.websocket.onmessage =  function(evt) {  
                var msg=JSON.parse(evt.data);
                if(!YagsClient[msg.event]){
                    throw "Event "+msg.event+" not supported";
                }
                YagsClient[msg.event](msg.data);
            };

        /**
         * Websocekt call back
         * @param  {[type]} evt [description]
         * @return {[type]}     [description]
         */
        this.websocket.onerror = function(evt) { };

       
    },


	// -- REMOTE EVENTS
    opponentsListChange:function(players){
        //remove Player
        if(opponentsList){
            players=$.map(players,function(player,i){
                
                if(player.Hash == YagsClient.user){
                    return null;
                }else{
                    return player;
                }
            });
        	var output = opponentsList.render({players:players,userHash:YagsClient.user});
    		$('tbody').html(output);
        }	
    },

    /**
     * called when remote sends objects
     * @param  {Object} data [description]
     * @return {[type]}      [description]
     */
    requestRemoteObjects:function(data){
        console.log("get:"+data);
        $.fn.pong.ctx.forEach(
                function(ctx){
                    ctx.opponent.setRemoteData(data);
                }
            );
    },

    /**
     * called when remote starts game
     * @param  {Object} data [description]
     * @return {[type]}      [description]
     */
    startGame:function(opponent){
        location.href="/play?start=true&opponent="+opponent;
    },

    // -- LOCAL EVENTS

    /**
     * sends local objects to remote
     * @return {[type]} [description]
     */
    sendObjectsToRemote : function(data){
        console.log("send:"+data);
        if(this.opponent && this.websocket.readyState == this.websocket.OPEN){    
            this.websocket.send(JSON.stringify({
                To: YagsClient.opponent,
                Data: {
                    event:"requestRemoteObjects",
                    data:data,
                }
            }));
        }
    },

    sendStartGame:function(){
        if(this.opponent && this.websocket.readyState == this.websocket.OPEN){  
            console.log("Start Game with:"+YagsClient.opponent);  
            this.websocket.send(JSON.stringify({
                To: YagsClient.opponent,
                Data: {
                    event:"startGame",
                    data:YagsClient.user
                }
            }));
        }
    },
	
};