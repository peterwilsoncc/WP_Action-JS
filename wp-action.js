(WP_Action = function( window, document ) {
	var action_guid = 1,
		wp_action_id = '__$$WP__action_id$$__',
		actions = [];
	
	var has_action = function( hook, callback ) {
		if ( !hook || !callback ) {
			return false;
		}
		
		var priority,
			callback_guid,
			i,
			i_length;

		if ( !callback ) {
			// only checking if there is a hook
			if ( typeof actions[hook] == 'undefined' ) {
				//no hook, no actions
				return false;
			}
			else {
				for ( priority = 0; priority < 100; priority++ ) {
					if ( ( actions[hook][priority] ) && ( 0 < actions[hook][priority].length ) ) {
						return true;
					}
				}
			}
		}
		else {
			callback_guid = callback[wp_action_id];
			
			//checking against a specific function
			for ( priority = 0; priority < 100; priority++ ) {
				if ( actions[hook][priority] ) {
					for ( i = 0, i_length = actions[hook][priority].length; i<i_length; i++ ) {
						if ( actions[hook][priority][i][wp_action_id] == callback_guid ) {
							return true;
						}
					}
				}
			}
		}
		
		return false;
	}

	var add_action = function( hook, callback, priority ){
		if ( !hook || !callback ) {
			return;
		}
		
		if ( !priority || ( typeof priority != "number" ) ) {
			priority = 10;
		}
		else if ( Math.floor(priority) != priority ) {
			priority = Math.floor(priority);
		}
		
		if ( 0 > priority ) {
			priority = 0;
		}
		else if ( 100 < priority ) {
			priority = 100;
		}
		
		if ( typeof actions[hook] == 'undefined' ) {
			actions[hook] = [];
		}
		
		if ( typeof actions[hook][priority] == 'undefined' ) {
			actions[hook][priority] = [];
		}
		
		if ( !callback[wp_action_id] ) {
			callback[wp_action_id] = action_guid++;
		}
		
		actions[hook][priority].push( callback );
	}

	var do_action = function(){
		if ( arguments.length == 0 ) {
				return;
		}
		
		var accepted_args = Array.prototype.slice.call(arguments),
			hook = accepted_args.shift(),
			_this = this,
			priority,
			i,
			i_length;

		if ( typeof actions[hook] == 'undefined' ) {
			// nothing to do
			return;
		}

		for ( priority = 0; priority < 100; priority++ ) {
			if ( actions[hook][priority] ) {
				for ( i = 0, i_length = actions[hook][priority].length; i<i_length; i++ ) {
					actions[hook][priority][i].apply( _this, accepted_args );
				}
			}
		}
	}

	var do_action_ref_array = function(){
	}

	var did_action = function(){
	}

	var remove_action = function(){
	}

	var remove_all_actions = function(){
	}
		
	return {
		has: has_action,
		add: add_action,
		do: do_action,
		do_ref_array: do_action_ref_array,
		did: did_action,
		remove: remove_action,
		remove_all: remove_all_actions
	}
	

}( this, document ));

