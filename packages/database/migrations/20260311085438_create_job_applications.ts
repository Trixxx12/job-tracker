import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('job_applications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('company_name', 255).notNullable();
    table.string('role_title', 255).notNullable();
    table
      .enum('status', [
        'pending',
        'interview',
        'rejected',
        'accepted',
        'withdrawn',
      ])
      .defaultTo('pending');
    table.string('platform', 50);
    table.text('job_url');
    table.timestamp('applied_at').defaultTo(knex.fn.now());
    table.text('notes');
    table.string('email_id', 255);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.index('user_id');
    table.index('status');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('job_applications');
}
