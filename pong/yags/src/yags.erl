-module(yags).
-author("Gregor Meyenberg <gregor@meyenberg.de>").

-export([start_server/0]).
-export([stop_server/0]).

-spec start_server() -> {ok, pid()} | {error, any()}.

%starts yags and dependencie services
start_server() ->
	application:start(crypto),
	application:start(ranch),
	application:start(cowboy),
	application:start(leptus),
	application:start(yags),
	leptus:start_http(yags),
	io:format("YAGS listening port 8000"). 

-spec stop_server() -> ok | {error, not_found}.
stop_server() ->
    leptus:stop_http(),
    application:stop(yags),
    application:stop(leptus),
    application:stop(cowboy),
    application:stop(ranch),
    application:stop(crypto).
