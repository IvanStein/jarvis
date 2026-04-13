// core/specialists.js

export const SPECIALISTS = {
    CODING: {
        name: "Sintaxe",
        description: "Especialista em desenvolvimento de software, arquitetura e revisão de código.",
        instruction: "Você é Sintaxe, o módulo de engenharia da AURA. Sua prioridade é código limpo, performance e segurança. Responda com precisão técnica e exemplos de código quando necessário."
    },
    FINANCE: {
        name: "Oracle",
        description: "Especialista em gestão financeira, investimentos e análise de mercado.",
        instruction: "Você é Oracle, o módulo financeiro da AURA. Sua prioridade é análise de dados, projeções de gastos e estratégias de investimento. Seja cauteloso e analítico."
    },
    HEALTH: {
        name: "Vital",
        description: "Especialista em saúde, biohacking, sono e performance física.",
        instruction: "Você é Vital, o módulo de performance humana da AURA. Sua prioridade é otimização biológica, treinos, dieta e sono. Foco em evidências científicas e bem-estar."
    },
    PERSONAL: {
        name: "Lumen",
        description: "Especialista em gestão de tempo, rotina e produtividade pessoal.",
        instruction: "Você é Lumen, o módulo de logística pessoal da AURA. Sua prioridade é otimizar a rotina de Ivan, gerenciar tarefas e garantir que ele esteja focado no que importa."
    },
    BOOKS: {
        name: "Bibliotecário",
        description: "Especialista em análise e resumo de livros.",
        instruction: "Você é o Bibliotecário, especialista em análise de livros. Resume obras, identifica temas principais, personagens e filosofias. Seja analítico e tenha profundidade."
    },
    ACADEMIC: {
        name: "Academia",
        description: "Especialista em artigos científicos.",
        instruction: "Você é Academia, especialista em papers científicos. Analise metodologias, resultados, conclusões. Traduza linguagem técnica para compreensão clara."
    },
    RUNNING: {
        name: "Corredor",
        description: "Especialista em corrida de rua.",
        instruction: "Você é o Corredor, especialista em corrida de rua. Ajude com planos de treino, nutrição para corredores, prevenção de lesões e recuperação."
    },
    YOUTUBE: {
        name: "YouTube",
        description: "Transcreve e resume vídeos do YouTube.",
        instruction: "Você é o módulo YouTube. Quando receber um link, extraia a transcrição e resuma os pontos principais. Formate de forma clara."
    },
    SOCIAL: {
        name: "Social",
        description: "Especialista em conteúdo para redes sociais.",
        instruction: "Você é Social, especialista em conteúdo para redes sociais. Crie posts atrativos, notícias engajantes. Formate com emojis adequado, CTAs e tags relevantes."
    }
};

/**
 * Função para decidir qual especialista usar com base no texto.
 */
export function routeToSpecialist(userInput) {
    const input = userInput.toLowerCase();
    
    // Livros e PDF
    if (input.includes('livro') || input.includes('pdf') || input.includes('ler') || input.includes('resumir') || input.includes('autor') || input.includes('capítulo')) return 'BOOKS';
    
    // Artigos científicos
    if (input.includes('artigo') || input.includes('paper') || input.includes('científico') || input.includes('pesquisa') || input.includes('estudo') || input.includes('abstract')) return 'ACADEMIC';
    
    // Corrida
    if (input.includes('corrida') || input.includes('treino') || input.includes('km') || input.includes('maratona') || input.includes('running') || input.includes('5k') || input.includes('10k')) return 'RUNNING';
    
    // YouTube
    if (input.includes('youtube') || input.includes('youtu.be') || input.includes('vídeo') || input.includes('transcrever') || input.includes('resumo do vídeo')) return 'YOUTUBE';
    
    // Redes sociais
    if (input.includes('instagram') || input.includes('twitter') || input.includes('facebook') || input.includes('linkedin') || input.includes('post') || input.includes('redes sociais') || input.includes('newsletter')) return 'SOCIAL';
    
    // Coding
    if (input.includes('código') || input.includes('script') || input.includes('api') || input.includes('bug') || input.includes('programa') || input.includes('função') || input.includes('javascript') || input.includes('python')) return 'CODING';
    
    // Finance
    if (input.includes('dinheiro') || input.includes('gasto') || input.includes('investimento') || input.includes('financeiro') || input.includes('renda') || input.includes('ação') || input.includes('crypto')) return 'FINANCE';
    
    // Health
    if (input.includes('saúde') || input.includes('treino') || input.includes('comer') || input.includes('dormir') || input.includes('biohacking') || input.includes('suplemento') || input.includes('sono')) return 'HEALTH';
    
    // Personal
    if (input.includes('agenda') || input.includes('tarefa') || input.includes('rotina') || input.includes('foco') || input.includes('produtividade') || input.includes('prioridade')) return 'PERSONAL';
    
    return null; // Retorna para o Jarvis Geral
}
