-module(helpers).

-export([url/1]).
-export([request/2, request/3, request/4]).
-export([response_body/1]).


url(Route) when is_list(Route) ->
    R1 = list_to_binary(Route),
    Port = list_to_binary(integer_to_list(leptus_port())),
    <<"http://localhost:", Port/binary , R1/binary>>.


leptus_port() ->
    Options = leptus_config:config_file(yags),
    yags_config:get_value([http,port], Options, <<"8080">>).

request(Method, Url) ->
    request(Method, Url, [], <<>>).

request(Method, Url, Headers) ->
    request(Method, Url, Headers, <<>>).

request(Method, Url, Headers, Body) ->
    {ok, Client} = cowboy_client:init([]),
    {ok, Client1} = cowboy_client:request(Method, url(Url), Headers, Body, Client),
    {ok, Status, Headers1, Client2} = cowboy_client:response(Client1),
    {Status, Headers1, Client2}.

response_body(Client) ->
    {ok, Data, _} = cowboy_client:response_body(Client),
    Data.
