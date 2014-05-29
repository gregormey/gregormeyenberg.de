/**
 * /**
 * Handels view Routes for client rendering
 * @type {Object}
 */

var Views={
	/**
	 * renders template code for opponentsList
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	opponentsList:function(req,res){
		res.render('opponentsList', {name: 'opponentsList'});
	},

	template:function(req,res){
		if(Views[req.params.template]){
			Views[req.params.template](req,res);
		}else{
			res.status(404).send('Template not found');
		}
	}

};

/**
 * Exports
 * @type {[type]}
 */
exports.template=Views.template;