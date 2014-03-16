-module(yags_config).
-author("Gregor Meyenberg <gregor@meyenberg.de>").

-export([get_value/3]).


%% read priv/yags.config file
config_file(App) ->
    case file:consult(filename:join([priv_dir(App), "yags.config"])) of
        {ok, Terms} ->
            Terms;
        Else ->
            Else
    end.

%% find the path to the priv directory in an application
priv_dir(App) ->
    case code:priv_dir(App) of
        {error, bad_name} ->
            Ebin = filename:dirname(code:which(App)),
            filename:join(filename:dirname(Ebin), "priv");
        PrivDir ->
            PrivDir
    end.
    
get_value(security,Key, Default) ->
	Config=config_file(yags),
	Opts=get_value(security,Config,[]),
    case lists:keyfind(Key, 1, Opts) of
        {_, V} -> V;
        _ -> Default
    end;

 get_value(Key,Opts,Default) ->
    case lists:keyfind(Key, 1, Opts) of
        {_, V} -> V;
        _ -> Default
    end.