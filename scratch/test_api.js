async function testApi() {
    console.log("Sending message to API...");
    try {
        const res = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'test from api',
                userId: 'ivan_stein',
                conversationId: '1'
            })
        });
        const text = await res.text();
        console.log("Response:", res.status, text);
    } catch(e) { console.error('fetch object failed:', e); }
}
testApi();
