-module(yags_rest).
-compile({parse_transform, leptus_pt}).

%% leptus callbacks
-export([init/3]).
-export([get/3]).
-export([post/3]).
-export([terminate/3]).

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
	NewPlayer=yags_database:add_player(Nick,Mail,Password),
	NewPlayerRoute=list_to_binary("/player/"++binary_to_list(NewPlayer)),
	 {201, [{<<"Location">>, NewPlayerRoute}], <<"created">>, State}.

terminate(_Reason, _Req, _State) ->
    ok.