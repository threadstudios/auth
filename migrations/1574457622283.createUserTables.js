const { sql, q } = require("@threadws/puresql");

q.addQueries("auth", `${__dirname}/../sql/user.sql`);

async function up() {
  /* Up function */
  await sql.execute(q.auth.createUserTable);
  await sql.execute(q.auth.createUserLoginTable);
  await sql.execute(q.auth.createUserPasswordResetTable);
  await sql.execute(q.auth.createUserVerificationTable);
  sql.connection.end();
}

async function down() {
  /* Down function */
  await sql.execute(q.auth.dropUserVerificationTable);
  await sql.execute(q.auth.dropUserPasswordResetTable);
  await sql.execute(q.auth.dropUserLoginTable);
  await sql.execute(q.auth.dropUserTable);
  sql.connection.end();
}

module.exports = { up, down };
