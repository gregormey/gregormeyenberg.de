-module(yags_database).
-behaviour(gen_server).

-author("Gregor Meyenberg <gregor@meyenberg.de>").


%% gen_server
-export([init/1]).
-export([handle_call/3]).
-export([handle_cast/2]).
-export([handle_info/2]).
-export([terminate/2]).
-export([code_change/3]).


-export([install/0]).
-export([start/0]).
-export([start_link/0]).
-export([stop/0]).
-export([add_player/3]).
-export([show/1]).

-include_lib("stdlib/include/qlc.hrl").

%table definitions
-record(player,{nick,mail,password}).


%% interfaces
install() ->
	setDataPath(),
	mnesia:create_schema([node()]),
	mnesia:start(),
	mnesia:create_table(player,[{attributes,record_info(fields,player)},{disc_copies,[node()]}]),
	mnesia:stop().

start()-> gen_server:start_link({local,?MODULE},?MODULE,[], []).
start_link() -> gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).
stop()-> gen_server:call(?MODULE, stop).

add_player(Nick,Mail,Password) -> gen_server:call(?MODULE,{add_player, Nick,Mail,Password}).
show(player) ->  gen_server:call(?MODULE,{show, player}).


%% internal
do(Q) ->
	F = fun() -> qlc:e(Q) end,
	{atomic, Val} = mnesia:transaction(F),
	Val. 

setDataPath() ->
	application:set_env(mnesia, dir, "yags/data").


%% gen_server
init([]) ->
    setDataPath(),
	mnesia:start(),
	mnesia:wait_for_tables([player],20000),
    {ok, ?MODULE}.

handle_call({add_player, Nick,Mail,Password}, _From, Tab) ->
	Row = #player{nick=Nick, mail=Mail, password=Password},
	F = fun() ->
			mnesia:write(Row)
		end,
	mnesia:transaction(F),
	{reply, Nick, Tab};

handle_call({show, player}, _From, Tab) ->
	Reply =do(qlc:q([X || X <- mnesia:table(player)])),
	{reply, Reply, Tab};

handle_call(stop, _From, Tab) ->
	{stop, normal, stopped, Tab}.

handle_cast(_Msg, State) ->
    {noreply, State}.

handle_info(_Info, State) ->
    {noreply, State}.

terminate(_Reason, _State) ->
    ok.

code_change(_OldVsn, State, _Extra) ->
    {ok, State}.

