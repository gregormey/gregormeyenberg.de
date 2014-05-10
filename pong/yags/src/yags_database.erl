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

%% interfaces to database
-export([install/0]).
-export([start/0]).
-export([start_link/0]).
-export([stop/0]).
-export([add_player/3]).
-export([find_player/1]).
-export([find_player/2]).
-export([login_player/1]).
-export([logout_player/1]).
-export([delete_player/1]).
-export([show/1]).
-export([update_schema/0]).



-include_lib("stdlib/include/qlc.hrl").


-include("yags_database.hrl").


%% interfaces
install() ->
	%% delete schema in case another schema is running on this node
	ok=mnesia:delete_schema([node()]),
	ok=mnesia:create_schema([node()]),
	ok=mnesia:start(), 
	{atomic,ok}=mnesia:create_table(player,[{attributes,record_info(fields,player)},{disc_copies,[node()]}]),
	mnesia:stop(). 


start()-> gen_server:start_link({local,?MODULE},?MODULE,[], []).
start_link() -> gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).
stop()-> gen_server:call(?MODULE, stop).

add_player(Nick,Mail,Password) -> gen_server:call(?MODULE,{add_player, Nick,Mail,Password}).
find_player(Hash) -> gen_server:call(?MODULE,{find_player, Hash}).
find_player(Nick,Password) -> gen_server:call(?MODULE,{find_player, Nick,Password}).
login_player(Hash) -> gen_server:call(?MODULE,{login_player, Hash}).
logout_player(Hash) -> gen_server:call(?MODULE,{logout_player, Hash}).
delete_player(Nick) -> gen_server:call(?MODULE,{delete_player, Nick}).
show(player) ->  gen_server:call(?MODULE,{show, player}).
update_schema() -> gen_server:call(?MODULE,{update_schema}).

%% internal Start --
do(Q) ->
	F = fun() -> qlc:e(Q) end,
	{atomic, Val} = mnesia:transaction(F),
	Val. 

%% creates a salted sha256 hash with a salt strung from the security section of
%% yags.config
getHash(Nick,Password)->
	Salt =yags_config:get_value(config,[security,salt], <<"soooosecure">>),
	hmac:hexlify(hmac:hmac256(Salt,list_to_binary(Nick ++ Password))).

%% find single player from database
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

%% Update a player by given row
writePlayer(Row)->
	F = fun() ->
			mnesia:write(Row)
		end,
	mnesia:transaction(F),
	findPlayer(hash,Row#player.hash).

createPlayer(Nick,Mail,Password,Registered) ->
	Hash=getHash(Nick,Password),
	Row = #player{hash=Hash, 
					nick=Nick, 
					mail=Mail, 
					registered=Registered, 
					score=0, 
					lastLogin=0, 
					lastLogout=0,
					isOnline=0
				},
	writePlayer(Row).

%% wrapper to login a player. Sets isOnline=1 and timestamp for lastlogin
loginPlayer(Hash,LoginTS)->
	case findPlayer(hash,Hash) of
		not_a_player -> not_a_player;
		Player -> writePlayer(Player#player{isOnline=1,lastLogin=LoginTS})
	end.

%% wrapper to logout a player. Sets isOnline=0 and timestamp for lastlogout
logoutPlayer(Hash,LogoutTS)->
	case findPlayer(hash,Hash) of
		not_a_player -> not_a_player;
		Player -> writePlayer(Player#player{isOnline=0,lastLogout=LogoutTS})
	end.


%% internal End --

%% gen_server
init([]) ->
	mnesia:start(),
	mnesia:wait_for_tables([player],20000),
    {ok, ?MODULE}.

%% call handler to add a player
%% before adding the player it checks if Input is valid and if nick and mail not already exists
handle_call({add_player, Nick,Mail,Password}, _From, Tab) ->
	case yags_util:validate(Nick, Password, Mail) of 
		valid ->
			case findPlayer(nick,Nick) of
				not_a_player -> case findPlayer(mail,Mail) of
									not_a_player -> {reply, createPlayer(Nick,Mail,Password,yags_util:unixTS()) , Tab};
									_ -> {reply, mail_exists , Tab}
								end;
				_ -> {reply, nick_exists , Tab}
			end;
		Validation -> 	{reply, Validation , Tab}
	end;

%% find player by hash
handle_call({find_player,Hash},_From, Tab) ->
	{reply, findPlayer(hash,Hash), Tab};	

%% find player by hash and password
handle_call({find_player,Nick,Password},_From, Tab) ->
	Hash = getHash(Nick,Password),
	{reply, findPlayer(hash,Hash), Tab};	

handle_call({login_player,Hash},_From, Tab) ->
	{reply, loginPlayer(Hash,yags_util:unixTS()), Tab};	

handle_call({logout_player,Hash},_From, Tab) ->
	{reply, logoutPlayer(Hash,yags_util:unixTS()), Tab};	

handle_call({delete_player,Nick},_From, Tab) ->
	case findPlayer(nick,Nick) of
		not_a_player -> {reply, not_a_player, Tab};
		Player -> {atomic, Val} = mnesia:transaction(
					fun () -> mnesia:delete_object(Player) end
					),
				{reply, Val, Tab}
	end;
%% list all players
handle_call({show, player}, _From, Tab) ->
	Reply =do(qlc:q([X || X <- mnesia:table(player)])),
	{reply, Reply, Tab};

%% call to update database schema. loads update FUN from yags.update
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

