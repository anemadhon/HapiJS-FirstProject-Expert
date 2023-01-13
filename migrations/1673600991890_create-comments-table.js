exports.up = pgm => {
	pgm.createTable('comments', {
		id: {
			type: 'VARCHAR(50)',
			primaryKey: true,
		},
		content: {
			type: 'TEXT',
			notNull: true,
		},
		is_deleted: {
			type: 'BOOLEAN',
			notNull: true,
			default: false,
		},
		created_at: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp'),
		},
		thread_id: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
		owner: {
			type: 'VARCHAR(50)',
			notNull: true,
		},
	})
	pgm.addConstraint(
		'comments',
		'fk_comments.thread_id_threads.id',
		'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE'
	)
	pgm.addConstraint(
		'comments',
		'fk_comments.owner_users.id',
		'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
	)
}

exports.down = pgm => {
	pgm.dropConstraint('comments', 'fk_comments.thread_id_threads.id')
	pgm.dropConstraint('comments', 'fk_comments.owner_users.id')
	pgm.dropTable('comments')
}
