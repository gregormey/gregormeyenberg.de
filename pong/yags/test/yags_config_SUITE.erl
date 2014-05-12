-module(yags_config_SUITE).
-include_lib("common_test/include/ct.hrl").

%% Common Test callbacks
-export([init_per_suite/1]).
-export([all/0]).

%% test cases
-export([load_salt/1]).
-export([load_fun/1]).

all() ->
    [
     load_salt,
     load_fun
    ].

init_per_suite(Config) ->
    Config.

load_salt(Config) ->
	<<"Maike">>=yags_config:get_value([security,salt], config_file(Config,"yags.config") ,<<"soooosecure">>),
	<<"soooosecure">>=yags_config:get_value([security,salty], config_file(Config,"yags.config") ,<<"soooosecure">>).

load_fun(Config) -> 
	Value=yags_config:get_value([update,schema], config_file(Config,"yags.update") ,"fun(X)->[X,1] end."),
	Fun=yags_config:eval_fun(Value), 
	test=Fun(test).


config_file(Config,File) ->
    case file:consult(filename:join([?config(data_dir, Config), File])) of
        {ok, Terms} ->
            Terms;
        Else ->
            Else
    end.