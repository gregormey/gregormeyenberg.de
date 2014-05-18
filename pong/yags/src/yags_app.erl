-module(yags_app).

-behaviour(application).

%% Application callbacks
-export([start/2, stop/1]).

%% ===================================================================
%% Application callbacks
%% ===================================================================

start(_StartType, _StartArgs) ->
	 Dispatch = cowboy_router:compile([
		{'_', [
			{"/websocket", ws_handler, []}
		]}
	]),
	{ok, _} = cowboy:start_http(http, 100, [{port, 10010}],
		[{env, [{dispatch, Dispatch}]}]),
    yags_sup:start_link().

stop(_State) ->
    ok.
