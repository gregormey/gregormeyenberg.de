-module(yags_database).
-compile(export_all).

-include_lib("stdlib/include/qlc.hrl").

-record(player,{nick,mail,password}).

install() ->
	setDataPath(),
	mnesia:create_schema([node()]),
	mnesia:start(),
	mnesia:create_table(player,[{attributes,record_info(fields,player)},{disc_copies,[node()]}]),
	mnesia:stop().

start()->
	setDataPath(),
	mnesia:start(),
	mnesia:wait_for_tables([player],20000).

add_player(Nick,Mail,Password) ->
	Row = #player{nick=Nick, mail=Mail, password=Password},
	F = fun() ->
			mnesia:write(Row)
		end,
	mnesia:transaction(F).

show(player)->
	do(qlc:q([X || X <- mnesia:table(player)])).

do(Q) ->
	F = fun() -> qlc:e(Q) end,
	{atomic, Val} = mnesia:transaction(F),
	Val. 

setDataPath() ->
	application:set_env(mnesia, dir, "../data").