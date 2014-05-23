-module(yags_websocket).
-behaviour(cowboy_websocket_handler).

-export([init/3]).
-export([websocket_init/3]).
-export([websocket_handle/3]).
-export([websocket_info/3]).
-export([websocket_terminate/3]).


init({tcp, http}, _Req, _Opts) ->
    {upgrade, protocol, cowboy_websocket}.

websocket_init(_TransportName, Req, _Opts) ->
    gproc:reg({p, l, wsbroadcast}), 
    gproc:send({p, l, wsbroadcast}, {self(), wsbroadcast, yags_database:show(player_online)}),
    %%set timeout to 5 min 
    {ok, Req, undefined_state,300000}. 

%%client calls
websocket_handle({text, Msg}, Req, State) ->
    {reply, {text, << "That's what she said! ", Msg/binary >>}, Req, State};
websocket_handle(_Data, Req, State) ->
    {ok, Req, State}.

%% server calls
websocket_info({_PID,wsbroadcast,Msg}, Req, State) ->
    {reply, {text, yags_util:jsonPlayers(Msg)}, Req, State, hibernate};
websocket_info(_Info, Req, State) ->
    {ok, Req, State}.

websocket_terminate(_Reason, _Req, _State) ->
    ok.