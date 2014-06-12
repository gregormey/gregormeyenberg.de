//Mock of {HTMLCanvasElement}
 module.exports=function(){
 	return {	
  		getContext:function(){
  			return {
          width:400,
          height:300,
  				beginPath:function(){
  					
  				},
  				arc:function(){

  				},
  				
  				fill:function(){

  				},
          fillRect:function(){

          },
          clearRect:function(){

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
                reset:function(){},
                radius:5
            }
          },
          /**
           * used to check if player addScore is called in
           * checkScore
           * @type {Object}
           */
          player:{
            hasBall: false,
            side: PLAYER_LEFT,
            x:5,
            y:15,
            width:10,
            height:40,
            addScore:function(){
              this.score=true;
            }
          },
          /**
           * used to check if opponent addScore is called in
           * checkScore
           * @type {Object}
           */
          opponent:{
            hasBall: true,
            side: PLAYER_RIGHT,
            width:10,
            height:40,
            y:15,
            x:385,
            addScore:function(){
              this.score=true;
            }
          }


  			}

  		}
  	}
 }