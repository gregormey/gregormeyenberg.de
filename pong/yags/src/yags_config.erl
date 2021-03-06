-module(yags_config).
-author("Gregor Meyenberg <gregor@meyenberg.de>").

-export([get_value/3]).
-export([get_fun/3]).
-export([eval_fun/1]).



%% read priv/yags.config file
-spec config_file(yags, File::string()) -> tuple()| {error, any()}.
config_file(App,File) ->
    case file:consult(filename:join([priv_dir(App), File])) of
        {ok, Terms} ->
            Terms;
        Else ->
            Else
    end.

%% find the path to the priv directory in an application
-spec priv_dir(yags) -> string().
priv_dir(App) ->
    case code:priv_dir(App) of
        {error, bad_name} ->
            Ebin = filename:dirname(code:which(App)),
            filename:join(filename:dirname(Ebin), "priv");
        PrivDir ->
            PrivDir
    end.

%% loads fun for database update from yags.update  
-spec get_fun(update, Keys::list(),Default::any())-> fun().
get_fun(update,Keys,Default) ->
	eval_fun(get_value(update,Keys,Default)).

%% eval function string
-spec eval_fun(Value::string())-> fun().
eval_fun(Value) ->
	{ok, Ts, _} = erl_scan:string(Value),
  	{ok, Exprs} = erl_parse:parse_exprs(Ts),
  	{value, Fun, _} = erl_eval:exprs(Exprs, []),
  	Fun.

%% loads a value from yags.config
-spec get_value(config|update|list(),list()|tuple(),any())-> any().
get_value(config,Keys,Default) ->
	Config=config_file(yags,"yags.config"),
	get_value(Keys,Config,Default);

%% loads a value from yags.update
get_value(update,Keys,Default) ->
	Config=config_file(yags,"yags.update"),
	get_value(Keys,Config,Default);

 %% recrusive search for value in a config set 
 get_value([Key|Keys],Opts,Default) ->
    case lists:keyfind(Key, 1, Opts) of
        {_, V} -> get_value(Keys,V,Default);
        _ -> get_value([],Default,Default)
    end;

 get_value([],V,_) -> V.