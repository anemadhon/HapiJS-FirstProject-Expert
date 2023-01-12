/* eslint-disable camelcase */
exports.up = pgm => {
	pgm.addColumns('threads', {
		owner: { type: 'VARCHAR(50)' },
	})
	pgm.addConstraint(
		'threads',
		'fk_threads.owner_users.id',
		'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
	)
}

exports.down = pgm => {
	pgm.dropColumns('threads', ['owner'])
	pgm.dropConstraint('threads', 'fk_threads.owner_users.id')
}
