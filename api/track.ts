import { waitUntil } from '@vercel/functions'

export const config = { runtime: 'edge' }

/**
 * Generates a formatted string representation of the given headers.
 *
 * @param headers - The Headers object containing the key-value pairs to be formatted.
 * @returns A string where each header key-value pair is formatted as `*key*: \`value\``.
 */
function generateHeadersText(headers: Headers): string {
	let headersText = ''
	headers.forEach((value, key) => {
		headersText += `*${key}*: \`${value}\`\n`
	})

	return headersText
}

export default async (req: Request) => {
	const currentTime = new Date().toString()
	const query = new URL(req.url).searchParams

	waitUntil(
		fetch(
			`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat_id: process.env.RECIPIENT_TELEGRAM_ID,
					text: `New request at ${currentTime} !:\n\n${query.get('id') ? `ID: ${query.get('id')}\n` : ''}${generateHeadersText(req.headers)}`,
					parse_mode: 'Markdown',
				}),
			},
		).catch((error) => {
			console.error('Error sending message to Telegram:', error)
		}),
	)

	return new Response()
}
