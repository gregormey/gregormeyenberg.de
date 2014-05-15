%table definitions
-record(player,{hash :: string(),
				nick :: string(),
				mail :: string(),
				score :: non_neg_integer(),
				registered :: non_neg_integer(), %%timestamp
				isOnline :: 0 | 1,
				lastLogin ::  non_neg_integer(), %%timestamp
				lastLogout :: non_neg_integer() %%timestamp
		}).