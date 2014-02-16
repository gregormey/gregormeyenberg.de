//jQuery Mock
module.exports=function(){
		return function () {
				return { 
					innerWidth:function(){
						return 400;
					},
					innerHeight:function(){
						return 300;
					}
			}
		}
	}