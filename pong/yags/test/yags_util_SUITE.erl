-module(yags_util_SUITE).
-include_lib("common_test/include/ct.hrl").

-export([all/0]).

-export([testValidate/1]).

all() ->
    [
     testValidate
    ].

testValidate(_) ->
   	valid = yags_util:validate("abc", "abcdefg", "abc@def.de"), 
   	nick_not_valid = yags_util:validate("ab", "abcdefg", "abc@def.de"), 
   	password_not_valid = yags_util:validate("abc", "abc", "abc@def.de"), 
   	mail_not_valid = yags_util:validate("abc", "abcdefg", "abcdef").

