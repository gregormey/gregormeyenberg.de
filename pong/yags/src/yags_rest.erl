-module(yags_rest).
-compile({parse_transform, leptus_pt}).

%% leptus callbacks
-export([init/3]).
-export([get/3]).
-export([post/3]).
-export([terminate/3]).

-include("yags_database.hrl").

init(_Route, _Req, State) ->
    {ok, State}.

get("/players/", _Req, State) ->
    Status = 200,
    Players= [[{<<"Hash">>,list_to_binary(Hash)},
                {<<"Nick">>,list_to_binary(Nick)},
    			{<<"Mail">>,list_to_binary(Mail)},
                {<<"Score">>,Score}]|| 
    			{player,Hash,Nick,Mail,Score} <- yags_database:show(player)],
    {Status, {json, Players}, State}.


post("/player/new", Req, State)->
	[{<<"Nick">>,Nick},{<<"Mail">>,Mail},{<<"Password">>,Password}]=leptus_req:body_qs(Req),
	case yags_database:add_player(binary_to_list(Nick),
                                binary_to_list(Mail),
                                binary_to_list(Password)) of 
            nick_exists->{409, {json,[{<<"Msg">>,<<"Nick exists">>}]},State};
            mail_exists->{409, {json,[{<<"Msg">>,<<"Mail exists">>}]},State};
            NewPlayer->{201, [{<<"Location">>, 
                                list_to_binary("/player/"++NewPlayer#player.hash)}], 
                                <<"created">>, 
                        State}
    end;

post("/server/:command", Req, State)->
    case leptus_req:param(command, Req) of
           <<"stop">> -> 
                yags:stop_server(),
                    {200,{json, [{<<"Msg">>,<<"Shutdown triggred">>}]}, State};
            <<"restart">> -> 
                yags:restart_server(),
                    {200,{json, [{<<"Msg">>,<<"Shutdown triggred">>}]}, State};
            _ -> {403,{json, [{<<"Msg">>,<<"Command not allowed">>}]}, State}
end. 

terminate(_Reason, _Req, _State) ->
    ok.