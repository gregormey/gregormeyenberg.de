-module(yags_util).
-author("Gregor Meyenberg <gregor@meyenberg.de>").

-export([unixTS/0]).
-export([validate/2]).
-export([validate/3]).

-type validation_result() :: valid | nick_not_valid | password_not_valid | mail_not_valid.

%% generates a POSIX timestamp
-spec unixTS()-> non_neg_integer().
unixTS()->
	{Mega, Secs, _} = os:timestamp(),
	Mega*1000000 + Secs.

%% validates a email
%% standard HTML5 secified regex is used
-spec validate(email|password|nick,string())-> valid | not_valid.
validate(email,Sting)->
	case re:run(Sting, "\\b[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*\\b") of
		nomatch -> not_valid;
		{match,_} -> valid
	end;
%% password needs to have more the 3 characters
validate(password,String)->
	case string:len(String) > 3 of
		true -> valid;
		false -> not_valid
	end;
%% nick needs to have more the 2 characters
validate(nick,String)->
	case string:len(String) > 2 of
		true -> valid;
		false -> not_valid
	end.
%% wrapper to validate input for account creation
-spec validate(Nick::string(),Password::string(),Mail::string())-> validation_result().
validate(Nick,Password, Mail) ->
	case {validate(nick,Nick),validate(password,Password),validate(email,Mail)} of
		{valid,valid,valid} -> valid;
		{not_valid,_,_} -> nick_not_valid;
		{_,not_valid,_} -> password_not_valid;
		{_,_,not_valid} -> mail_not_valid
	end.
