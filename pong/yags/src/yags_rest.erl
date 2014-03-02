-module(yags_rest).
-import(yags_database, [show/1]).
-compile(export_all).

-include("/usr/local/lib/yaws/include/yaws_api.hrl").

out(Arg) ->
     Uri = yaws_api:request_url(Arg),
     Path = string:tokens(Uri#url.path, "/"),
     Method = (Arg#arg.req)#http_request.method,
     out(Arg,Method,Path).

out(Arg, 'GET', ["players"]) ->
	json2:encode(yags_database:show(player)).

return_json(Json) ->
    {content,
    "application/json; charset=iso-8859-1",
    Json}.
