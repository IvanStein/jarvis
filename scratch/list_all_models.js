
const apiKey = "AIzaSyBpJ3T0wV8BGodTL_SF6UfSezApgk2Qdfo";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function check() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('Modelos disponíveis:');
        if (data.models) {
            data.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods})`));
        } else {
            console.log('Nenhum modelo retornado. Resposta:', JSON.stringify(data));
        }
    } catch (e) {
        console.error('Erro ao listar:', e.message);
    }
}

check();
