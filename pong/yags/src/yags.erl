-module(yags).
-author("Gregor Meyenberg <gregor@meyenberg.de>").

-export([start_server/0]).
-export([stop_server/0]).

-spec start_server() -> {ok, pid()} | {error, any()}.
start_server() ->
	leptus:start_http(yags).

-spec stop_server() -> ok | {error, not_found}.
stop_server() ->
    leptus:stop_http(). 