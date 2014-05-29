var opponentsList = {
  template:null,
  
  getTpl:function(){
    if(this.template==null){
        this.template= swig.compile("{% for player in players %} "+ 
                                      "<tr>" +
                                        "<td>{{ player.Nick }}</td>" +
                                        "<td>{{ player.Score }}</td>" +
                                        "<td><input type='button' value='Challenge'></td>"+
                                      "</tr>"+
                                    "{% endfor  %}"); 
    };
    return this.template;
  },

  render:function(locals){
    var template=this.getTpl();
    return template(locals);
  }
}
 