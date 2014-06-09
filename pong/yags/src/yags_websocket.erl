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
    erlang:display("New Web Socket"),
    gproc:reg({p, l, wsbroadcast}), 
    gproc:send({p, l, wsbroadcast}, {self(), wsbroadcast, yags_database:show(player_online)}),
    %%set timeout to 5 min 
    {ok, Req, undefined_state,300000}. 

%%client calls
websocket_handle({text, Msg}, Req, State) ->
    erlang:display("GET Message:"),
    erlang:display(binary_to_list(Msg)),
    Response = handle_events(Msg),
    case Response of
        true -> {ok, Req, State};
        _ -> {reply, {text, << "That's what she said! ", Msg/binary >>}, Req, State}
    end;
websocket_handle(_Data, Req, State) ->
    {ok, Req, State}.

%% server calls
websocket_info({_PID,wsbroadcast,Players}, Req, State) ->
    FormatedPlayers=[ yags_util:formatPlayer(Player) || Player <- Players],
    Msg = [{<<"event">>,<<"opponentsListChange">>},{<<"data">>,FormatedPlayers}],
    {reply, {text, jsx:encode(Msg)}, Req, State, hibernate};
websocket_info({_PID,Data}, Req, State) ->
    {reply, {text, jsx:encode(Data)}, Req, State, hibernate};
websocket_info(_Info, Req, State) ->
    {ok, Req, State}.

websocket_terminate(_Reason, _Req, _State) ->
    ok.

%% events
%% Proxy for possible events
-spec handle_events(binary()) -> true | any().
handle_events(Msg) ->
    case jsx:decode(Msg) of
        [{<< "RegisterHash" >> , UserHash}] -> registerHash(UserHash);
        [{<< "To" >> , To } , {<< "Data" >> , Data }] -> sendObjectsToRemote(To, Data);
        _ -> Msg
    end.

%% Register Websocket connection by User Hash
-spec registerHash(binary()) -> true.
registerHash(UserHash) ->
    erlang:display("Register User:"++binary_to_list(UserHash)),
    gproc:reg({p, l, UserHash}).

-spec sendObjectsToRemote(binary(),binary()) -> true.
sendObjectsToRemote(To,Data) ->
    erlang:display("Send Data To:"++binary_to_list(To)),
    {_PID, Data}=gproc:send({p, l, To}, {self(), Data}),
    true.
    


