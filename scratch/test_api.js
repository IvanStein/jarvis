async function testApi() {
    console.log("Sending message to API...");
    try {
        const res = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Jarvis, lembrete: eu nasci no dia 17/01/1980',
                userId: 'ivan_stein',
                conversationId: Date.now().toString(),
                apiKey: process.env.GEMINI_API_KEY
            })
        });
        const text = await res.text();
        console.log("Response:", res.status, text);
    } catch(e) { console.error('fetch object failed:', e); }
}
testApi();
