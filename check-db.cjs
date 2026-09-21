require('dotenv/config')

const { Client } = require('pg')

async function main() {
	const client = new Client({
		connectionString: process.env.DATABASE_URL
	})

	await client.connect()

	const result = await client.query(`
    SELECT
      column_name,
      data_type,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'drizzle'
      AND table_name = '__drizzle_migrations'
    ORDER BY ordinal_position
  `)

	console.table(result.rows)

	await client.end()
}

main().catch(error => {
	console.error(error)
	process.exit(1)
})
