-module(yags).
-author("Gregor Meyenberg <gregor@meyenberg.de>").

-export([start_server/1]).
-export([start_server/0]).
-export([stop_server/0]).
-export([restart_server/0]).
-export([set_dbPath/0]).

-spec start_server() -> {ok, pid()} | {error, any()}.

%starts yags and dependencie services with a path to database
start_server(test) ->
	start_applications().

%starts yags and dependencie services and database in priv dir
start_server() ->
	set_dbPath(),
	start_applications().

%sets mnesia dir
set_dbPath()->
	application:set_env(mnesia, dir, filename:join(code:priv_dir(yags), "data")).

%starts all required OTP applications
start_applications() ->
	application:start(crypto),
	application:start(ranch),
	application:start(cowboy),
	application:start(leptus),
	application:start(yags),
	leptus:start_http(yags),
	ok.

-spec stop_server() -> ok | {error, not_found}.
stop_server() ->
    init:stop(),
    ok.

 restart_server() ->
 	init:restart(),
 	ok.
