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
-export([find_player/1]).
-export([find_player/2]).
-export([delete_player/1]).
-export([show/1]).
-export([update_schema/0]).



-include_lib("stdlib/include/qlc.hrl").


-include("yags_database.hrl").


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
find_player(Hash) -> gen_server:call(?MODULE,{find_player, Hash}).
find_player(Nick,Password) -> gen_server:call(?MODULE,{find_player, Nick,Password}).
delete_player(Nick) -> gen_server:call(?MODULE,{delete_player, Nick}).
show(player) ->  gen_server:call(?MODULE,{show, player}).
update_schema() -> gen_server:call(?MODULE,{update_schema}).

%% internal Start --
do(Q) ->
	F = fun() -> qlc:e(Q) end,
	{atomic, Val} = mnesia:transaction(F),
	Val. 

setDataPath() ->
	application:set_env(mnesia, dir, "yags/data").

getHash(Nick,Password)->
	Salt =yags_config:get_value(config,[security,salt], <<"soooosecure">>),
	hmac:hexlify(hmac:hmac256(Salt,list_to_binary(Nick ++ Password))).

findPlayer(hash,Hash)->
	case do(qlc:q([X || X <- mnesia:table(player), 
							X#player.hash == Hash]))  of
		[] -> not_a_player;
		[Player] -> Player
	end;

findPlayer(nick,Nick)->
	case do(qlc:q([X || X <- mnesia:table(player), 
							X#player.nick == Nick]))  of
		[] -> not_a_player;
		[Player] -> Player
	end;

findPlayer(mail,Mail)->
	case do(qlc:q([X || X <- mnesia:table(player), 
							X#player.mail == Mail]))  of
		[] -> not_a_player;
		[Player] -> Player
	end.

writePlayer(Nick,Mail,Password,Score) ->
	Hash=getHash(Nick,Password),
	Row = #player{hash=Hash, nick=Nick, mail=Mail, score=Score},
	F = fun() ->
			mnesia:write(Row)
		end,
	mnesia:transaction(F),
	findPlayer(hash,Hash).

%% internal End --

%% gen_server
init([]) ->
    setDataPath(),
	mnesia:start(),
	mnesia:wait_for_tables([player],20000),
    {ok, ?MODULE}.

handle_call({add_player, Nick,Mail,Password}, _From, Tab) ->
	case findPlayer(nick,Nick) of
		not_a_player -> case findPlayer(mail,Mail) of
							not_a_player -> {reply, writePlayer(Nick,Mail,Password,0) , Tab};
							_ -> {reply, mail_exists , Tab}
						end;
		_ -> {reply, nick_exists , Tab}
	end;

handle_call({find_player,Hash},_From, Tab) ->
	{reply, findPlayer(hash,Hash), Tab};	

handle_call({find_player,Nick,Password},_From, Tab) ->
	Hash = getHash(Nick,Password),
	{reply, findPlayer(hash,Hash), Tab};	

handle_call({delete_player,Nick},_From, Tab) ->
	case findPlayer(nick,Nick) of
		not_a_player -> {reply, not_a_player, Tab};
		Player -> {atomic, Val} = mnesia:transaction(
					fun () -> mnesia:delete_object(Player) end
					),
				{reply, Val, Tab}
	end;
		
handle_call({show, player}, _From, Tab) ->
	Reply =do(qlc:q([X || X <- mnesia:table(player)])),
	{reply, Reply, Tab};

handle_call({update_schema},_From, Tab) ->
	Fun=yags_config:get_fun(update,[update,schema], "fun(X)->X end."),
	{reply, mnesia:transform_table(player, 
			Fun
			, record_info(fields,player)),
	ok, Tab};


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

