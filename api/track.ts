
export const config = { runtime: 'edge' };

export default async (req: Request) => {
    let headersText = '';
    req.headers.forEach((value, key) => {
        headersText += `*${key}*: \`${value}\`\n`;
    });

    const currentTime = new Date().toString();
    const query = new URL(req.url).searchParams;

    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: process.env.RECIPIENT_TELEGRAM_ID,
            text: `New request at ${currentTime} !:\n\n${query.get('id') ? `ID: ${query.get('id')}\n` : ''}${headersText}`,
            parse_mode: "Markdown"
        })
    });
    return new Response();
};