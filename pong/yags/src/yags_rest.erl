-module(yags_rest).
-compile({parse_transform, leptus_pt}).

%% leptus callbacks
-export([init/3]).
-export([get/3]).
-export([terminate/3]).

init(_Route, _Req, State) ->
    {ok, State}.

get("/", _Req, State) ->
    {<<"Hello, leptus!">>, State};
get("/hi/:name", Req, State) ->
    Status = 200,
    Name = leptus_req:param(name, Req),
    Body = [{<<"say">>, <<"Hi">>}, {<<"to">>, Name}],
    {Status, {json, Body}, State}.

terminate(_Reason, _Req, _State) ->
    ok.