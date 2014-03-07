-module(yags_rest).
-compile({parse_transform, leptus_pt}).

%% leptus callbacks
-export([init/3]).
-export([get/3]).
-export([post/3]).
-export([terminate/3]).

init(_Route, _Req, State) ->
    yags_database:start(),
    {ok, State}.

get("/players/", _Req, State) ->
    Status = 200,
    Players= [[{<<"Nick">>,Nick},
    			{<<"Mail">>,Mail},
    			{<<"Password">>,Password}]|| 
    			{player,Nick,Mail,Password} <- yags_database:show(player)],
    {Status, {json, Players}, State}.



post("/player/new", Req, State)->
	[{<<"Nick">>,Nick},{<<"Mail">>,Mail},{<<"Password">>,Password}]=leptus_req:body_qs(Req),
	yags_database:add_player(Nick,Mail,Password),
	NewPlayerRoute=list_to_binary("/player/"++binary_to_list(Nick)),
	 {201, [{<<"Location">>, NewPlayerRoute}], <<"created">>, State}.

terminate(_Reason, _Req, _State) ->
    ok.