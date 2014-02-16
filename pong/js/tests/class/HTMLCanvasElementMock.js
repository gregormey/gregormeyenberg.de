//Mock of {HTMLCanvasElement}
 module.exports=function(){
 	return {	
  		getContext:function(){
  			return {
  				beginPath:function(){
  					
  				},
  				arc:function(){

  				},
  				
  				fill:function(){

  				},
          fillRect:function(){

          },
          /**
           * sets a ball moch to the ctx object
           * @param {Number} x [description]
           * @param {Number} y [description]
           */
          setBall:function(x,y){
            this.ball={
                x:x,
                y:y,
                radius:5
            }
          }

  			}

  		}
  	}
 }