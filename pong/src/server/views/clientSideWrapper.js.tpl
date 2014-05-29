var {{ name }} = {
  template:null,
  
  getTpl:function(){
    if(this.template==null){
        this.template= swig.compile({% block template %}{% endblock %}); 
    };
    return this.template;
  },

  render:function(locals){
    var template=this.getTpl();
    return template(locals);
  }
}
 