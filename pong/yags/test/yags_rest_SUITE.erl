-module(yags_rest_SUITE).
-include_lib("common_test/include/ct.hrl").

%% Common Test callbacks
-export([init_per_suite/1]).
-export([all/0]).

%% test cases
-export([player_new/1]).

%% helpers
-import(helpers, [request/2, request/3, request/4, response_body/1]).

init_per_suite(Config) ->
    stopped = yags_database:install(),  
    Priv = ?config(priv_dir, Config),
    ok = yags:start_server(test),
    Config.

all() ->
    [
     player_new
    ].

player_new(_) ->
    M = <<"POST">>,
    B1 = <<"Nick=test100&Mail=test@test.de&Password=test100">>,
    {201, _, C1} = request(M, "/player/new", [], B1).
