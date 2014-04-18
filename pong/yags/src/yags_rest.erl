-module(yags_rest).
-compile({parse_transform, leptus_pt}).

%% leptus callbacks
-export([init/3]).
-export([get/3]).
-export([post/3]).
-export([put/3]).
-export([delete/3]).
-export([terminate/3]).

-include("yags_database.hrl").

init(_Route, _Req, State) ->
    {ok, State}.

%%internal
formatPlayer(Player) ->
    [{<<"Hash">>,list_to_binary(Player#player.hash)},
    {<<"Nick">>,list_to_binary(Player#player.nick)},
    {<<"Mail">>,list_to_binary(Player#player.mail)},
    {<<"Score">>,Player#player.score},
    {<<"IsOnline">>,Player#player.isOnline},
    {<<"Registered">>,Player#player.registered},
    {<<"LastLogin">>,Player#player.lastLogin},
    {<<"LastLogout">>,Player#player.lastLogout}
    ].

%% GET Methods
get("/players/", _Req, State) ->
    Status = 200,
    Players= [formatPlayer(Player)|| 
    			Player <- yags_database:show(player)],
    {Status, {json, Players}, State};

get("/player/:id", Req, State) ->
    case leptus_req:qs_val(<<"pwd">>, Req) of
        undefined -> Hash=leptus_req:param(id, Req),
                     case yags_database:find_player(binary_to_list(Hash)) of
                        not_a_player -> {404, {json,[{<<"Msg">>,<<"Player not found">>}]},State};
                        Player -> {200, {json, formatPlayer(Player)}, State}
                    end;
        Password -> Nick=leptus_req:param(id, Req),
                    case yags_database:find_player(binary_to_list(Nick), binary_to_list(Password)) of
                        not_a_player -> {404, {json,[{<<"Msg">>,<<"Player not found">>}]},State};
                        Player -> {200, {json, formatPlayer(Player)}, State}
                    end
    end.

%% POST  Methods
post("/player/new", Req, State)->
	[{<<"Nick">>,Nick},{<<"Mail">>,Mail},{<<"Password">>,Password}]=leptus_req:body_qs(Req),
	case yags_database:add_player(binary_to_list(Nick),
                                binary_to_list(Mail),
                                binary_to_list(Password)) of 
            nick_exists->{409, {json,[{<<"Msg">>,<<"Nick exists">>}]},State};
            mail_exists->{409, {json,[{<<"Msg">>,<<"Mail exists">>}]},State};
            NewPlayer->{201, [{<<"Location">>, 
                                list_to_binary("/player/"++NewPlayer#player.hash)}], 
                                {json, [{<<"Msg">>,<<"Player created">>}]}, 
                        State}
    end;


post("/server/:command", Req, State)->
    case leptus_req:param(command, Req) of
           <<"stop">> -> 
                yags:stop_server(),
                    {200,{json, [{<<"Msg">>,<<"Shutdown triggred">>}]}, State};
            <<"restart">> -> 
                yags:restart_server(),
                    {200,{json, [{<<"Msg">>,<<"Restart triggered">>}]}, State};
            _ -> {403,{json, [{<<"Msg">>,<<"Command not allowed">>}]}, State}
end. 

%% PUT Methods
put("/player/:id", Req, State) ->
    Hash=leptus_req:param(id, Req),
    case leptus_req:body_qs(Req) of
        [{<<"Login">>,<<"1">>}] -> 
            {200, {json, formatPlayer(yags_database:login_player(binary_to_list(Hash)))}, State};
        [{<<"Logout">>,<<"1">>}] ->
            {200, {json, formatPlayer(yags_database:logout_player(binary_to_list(Hash)))}, State};
         _ -> {406,{json, [{<<"Msg">>,<<"Parameter not matching">>}]}, State}
end.

%% DELETE Methods

delete("/player/:id", Req, State)->
    Nick=leptus_req:param(id, Req),
    case yags_database:delete_player(binary_to_list(Nick)) of
        not_a_player -> {404, {json,[{<<"Msg">>,<<"Player not found">>}]},State};
        ok -> {200, {json,[{<<"Msg">>,<<"Player deleted">>}]},State}
    end.


terminate(_Reason, _Req, _State) ->
    ok.