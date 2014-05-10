-module(yags_rest_SUITE).
-include_lib("common_test/include/ct.hrl").

%% Common Test callbacks
-export([init_per_suite/1]).
-export([all/0]).

%% test cases
-export([player_new/1]).
-export([player_new_invalid_mail/1]).
-export([player_new_invalid_nick/1]).
-export([player_new_invalid_password/1]).
-export([player_find/1]).
-export([player_login/1]).
-export([player_logout/1]).
-export([player_delete/1]).


%% helpers
-import(helpers, [request/2, request/3, request/4, response_body/1]).

init_per_suite(Config) ->
    stopped = yags_database:install(test),  
    ok = yags:start_server(test),
    Config.

all() ->
    [
     player_new,
     player_new_invalid_mail,
     player_new_invalid_nick,
     player_new_invalid_password,
     player_find,
     player_login,
     player_logout,
     player_delete
    ].

player_new(_) ->
    M = <<"POST">>,
    B1 = <<"Nick=test100&Mail=test@test.de&Password=test100">>,
    {201, _, _} = request(M, "/player/new", [], B1),
    {406, _, _} = request(M, "/player/new", [], B1).

player_new_invalid_mail(_) ->
    M = <<"POST">>,
    B1 = <<"Nick=test100&Mail=test&Password=test100">>,
    {406, _, C1} = request(M, "/player/new", [], B1),
    <<"{\"Msg\":\"Mail not valid\"}">> = response_body(C1).

player_new_invalid_nick(_) ->
    M = <<"POST">>,
    B1 = <<"Nick=te&Mail=test&Password=test100">>,
    {406, _, C1} = request(M, "/player/new", [], B1),
    <<"{\"Msg\":\"Nick not valid\"}">> = response_body(C1).

player_new_invalid_password(_) ->
    M = <<"POST">>,
    B1 = <<"Nick=test100&Mail=test&Password=tes">>,
    {406, _, C1} = request(M, "/player/new", [], B1),
    <<"{\"Msg\":\"Password not valid\"}">> = response_body(C1).

player_find(_) ->
    M = <<"GET">>,
    {200, _, C2} = request(M, "/player/"++get_player_hash()),
    Player2=jsx:decode(response_body(C2)),
    [{<<"Hash">>,Hash2},{<<"Nick">>,<<"test100">>},_,_,_,_,_,_]=Player2.

player_login(_) ->
    M = <<"PUT">>,
    B1 = <<"Login=1">>,
    {200, _, C1} = request(M, "/player/"++get_player_hash(), [], B1),
     Player=jsx:decode(response_body(C1)),
    [{<<"Hash">>,Hash},{<<"Nick">>,<<"test100">>},_,_,{<<"IsOnline">>,1},_,_,_]=Player.

player_logout(_) ->
    M = <<"PUT">>,
    B1 = <<"Logout=1">>,
    {200, _, C1} = request(M, "/player/"++get_player_hash(), [], B1),
     Player=jsx:decode(response_body(C1)),
    [{<<"Hash">>,Hash},{<<"Nick">>,<<"test100">>},_,_,{<<"IsOnline">>,0},_,_,_]=Player.

player_delete(_) ->
    M = <<"DELETE">>,
    {200, _, _} = request(M, "/player/test100"),
     M2 = <<"GET">>,
    {404, _, C1} = request(M2, "/player/test100?pwd=test100"),
      <<"{\"Msg\":\"Player not found\"}">> = response_body(C1).


%% internals
get_player_hash()->
     M = <<"GET">>,
    {200, _, C1} = request(M, "/player/test100?pwd=test100"),
    Player=jsx:decode(response_body(C1)),
    [{<<"Hash">>,Hash},{<<"Nick">>,<<"test100">>},_,_,_,_,_,_]=Player,
    binary_to_list(Hash).



