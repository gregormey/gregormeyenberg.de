var opponentsList = function () {
  return swig.compile("{% for player in players %} "+ 
  "<tr>" +
    "<td>{{ player.Nick }}</td>" +
    "<td>{{ player.Score }}</td>" +
    "<td><input type='button' value='Challenge'></td>"+
  "</tr>"+
"{% endfor  %}"); 
}
 