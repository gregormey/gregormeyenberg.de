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
			{"/websocket", yags_handler, []}
		]}
	]),
	Port =yags_config:get_value(config,[websocket,port], 10010),
	{ok, _} = cowboy:start_http(http, 100, [{port, Port}],
		[{env, [{dispatch, Dispatch}]}]),
    yags_sup:start_link().

stop(_State) ->
    ok.
