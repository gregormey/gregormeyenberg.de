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
-export([install/1]).
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

-type not_valid() :: mail_exists | nick_exists | password_not_valid | mail_not_valid.
-type player() :: #player {}.




%% interfaces
-spec install() -> 'stopped' | {'error',_}.
install() ->
	yags:set_dbPath(), 
	create_tables().

%% set up schema for test enviroment
-spec install(test) -> 'stopped' | {'error',_}.
install(test)->
	create_tables().

-spec create_tables() -> 'stopped' | {'error',_}.
create_tables()->
	%% delete schema in case another schema is running on this node
	ok=mnesia:delete_schema([node()]),
	ok=mnesia:create_schema([node()]),
	ok=mnesia:start(), 
	{atomic,ok}=mnesia:create_table(player,[{attributes,record_info(fields,player)},{disc_copies,[node()]}]),
	mnesia:stop(). 

-spec start() -> {ok, pid()} | {error, any()}.
start()-> gen_server:start_link({local,?MODULE},?MODULE,[], []).

-spec start_link() -> {ok, pid()} | {error, any()}.
start_link() -> gen_server:start_link({local, ?MODULE}, ?MODULE, [], []).

-spec stop() -> ok.
stop()-> gen_server:call(?MODULE, stop).

-spec add_player(Nick::string(),Mail::string(),Passwor::string()) -> not_valid() | player().
add_player(Nick,Mail,Password) -> gen_server:call(?MODULE,{add_player, Nick,Mail,Password}).

-spec find_player(Hash::string()) -> player() |  not_a_player.
find_player(Hash) -> gen_server:call(?MODULE,{find_player, Hash}).

-spec find_player(Nick::string(),Password::string()) -> player() |  not_a_player.
find_player(Nick,Password) -> gen_server:call(?MODULE,{find_player, Nick,Password}).

-spec login_player(Hash::string()) ->  player() |  not_a_player.
login_player(Hash) -> gen_server:call(?MODULE,{login_player, Hash}).

-spec logout_player(Hash::string()) ->  player() |  not_a_player.
logout_player(Hash) -> gen_server:call(?MODULE,{logout_player, Hash}).

-spec delete_player(Nick::string()) ->  ok |  not_a_player.
delete_player(Nick) -> gen_server:call(?MODULE,{delete_player, Nick}).

-spec show(player) ->  [player()] | [].
show(player) ->  gen_server:call(?MODULE,{show, player}).

-spec update_schema() ->  ok.
update_schema() -> gen_server:call(?MODULE,{update_schema}).

%% internal Start --
do(Q) ->
	F = fun() -> qlc:e(Q) end,
	{atomic, Val} = mnesia:transaction(F),
	Val. 


%% creates a salted sha256 hash with a salt strung from the security section of
%% yags.config
-spec getHash(Nick::string(),Password::string()) ->  string().
getHash(Nick,Password)->
	Salt =yags_config:get_value(config,[security,salt], <<"soooosecure">>),
	hmac:hexlify(hmac:hmac256(Salt,list_to_binary(Nick ++ Password))).

%% find single player from database
-spec findPlayer(atom(),Hash::string()) -> player() |  not_a_player.
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
-spec writePlayer(player()) -> player().
writePlayer(Row)->
	F = fun() ->
			mnesia:write(Row)
		end,
	mnesia:transaction(F),
	findPlayer(hash,Row#player.hash).

-spec createPlayer(Nick::string(),Mail::string(),Password::string(),Registered::non_neg_integer()) -> player().
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
-spec loginPlayer(Hash::string(),LoginTS::non_neg_integer()) -> player() |  not_a_player.
loginPlayer(Hash,LoginTS)->
	case findPlayer(hash,Hash) of
		not_a_player -> not_a_player;
		Player -> writePlayer(Player#player{isOnline=1,lastLogin=LoginTS})
	end.

%% wrapper to logout a player. Sets isOnline=0 and timestamp for lastlogout
-spec logoutPlayer(Hash::string(),LogoutTS::non_neg_integer()) -> player() |  not_a_player.
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

