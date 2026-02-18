"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
const prisma = new client_1.PrismaClient();
const PRICE_DEVOCIONAL = 29.9;
const PRICE_KIT = 19.9;
const PRICE_CURSO = 49.9;
const SLUG_DEVOCIONAL = 'familia-em-conserva-devocional';
const SLUG_KIT = 'kit-familia-em-conserva';
const SLUG_CURSO = 'curso-blindar-familia';
const DEVOCIONAL_DAYS = [
    {
        dayNumber: 1,
        theme: 'Aliança não é contrato',
        verse: '"Mas o Senhor, que é fiel, o que confirmou as promessas feitas aos nossos pais, não nos abandonou." (Neemias 9:8)',
        wordOriginal: 'berith (ברית)',
        wordMeaning: 'Aliança no hebraico: compromisso sagrado, pacto de fidelidade que une as partes. Não é um mero acordo jurídico, mas um laço de amor e responsabilidade.',
        reflection: 'A família que Deus desenhou é fundada em aliança — berith. Não em contratos que se quebram quando deixam de ser convenientes. Quando entendemos que nosso casamento e nossa casa são uma aliança com Deus e entre nós, passamos a "conservar" o que o mundo tenta dissolver. Hoje, reflita: sua família está construída sobre aliança ou sobre conveniência?',
        questions: [
            'O que significa para você viver em "aliança" com sua família?',
            'Que práticas em sua casa refletem compromisso e não apenas obrigação?',
        ],
        sortOrder: 1,
    },
    {
        dayNumber: 2,
        theme: 'Guardar e preservar',
        verse: '"Guarda o teu coração, porque dele procedem as saídas da vida." (Provérbios 4:23)',
        wordOriginal: 'shamar (שמר)',
        wordMeaning: 'Guardar, vigiar, preservar. No contexto bíblico, é proteção ativa — não passiva. Implica cuidado constante e intencional.',
        reflection: 'Shamar é o verbo por trás de "conservar". Deus nos chama a guardar nosso coração e nosso lar. Isso exige vigilância: o que entra pela porta da nossa casa (conversas, mídia, valores)? O que cultivamos no coração? Família em conserva é família guardada — com propósito e ação.',
        questions: [
            'O que você está "guardando" ativamente em sua casa hoje?',
            'Há algo que precisa ser vigiado ou removido do ambiente familiar?',
        ],
        sortOrder: 2,
    },
    {
        dayNumber: 3,
        theme: 'Proteção da família',
        verse: '"Como a ave que vagueia longe do seu ninho, assim é o homem que vagueia longe do seu lugar." (Provérbios 27:8)',
        wordMeaning: 'O ninho representa segurança, identidade e pertencimento. A família é o "ninho" que protege e prepara os filhos para a vida.',
        reflection: 'Conservar a família é também protegê-la. Proteção não é isolamento total do mundo, mas criar um ambiente onde valores, fé e amor são prioridade. Quando o lar é um ninho seguro, os filhos sabem para onde voltar e em que acreditar.',
        questions: [
            'Sua casa funciona como um "ninho" seguro? De que forma?',
            'O que você pode fazer esta semana para fortalecer esse senso de proteção?',
        ],
        sortOrder: 3,
    },
    {
        dayNumber: 4,
        theme: 'Fundamentos da casa',
        verse: '"Todo aquele, pois, que ouve estas minhas palavras e as pratica será comparado a um homem prudente que edificou a sua casa sobre a rocha." (Mateus 7:24)',
        reflection: 'A casa que permanece é a construída sobre a Rocha — Jesus e sua Palavra. Sem esse alicerce, a família cai quando vêm as chuvas da cultura, da pressão e da indiferença. Hoje é dia de checar os fundamentos: sua família está edificada sobre a Rocha?',
        questions: [
            'Quais "palavras" de Jesus sua família pratica juntos?',
            'Há algum hábito ou valor que precisa ser realinhado ao fundamento bíblico?',
        ],
        sortOrder: 4,
    },
    {
        dayNumber: 5,
        theme: 'Compromisso e fidelidade',
        verse: '"Melhor é dois do que um... Se um cair, o outro levanta." (Eclesiastes 4:9-10)',
        reflection: 'Família em conserva é família comprometida uns com os outros. Marido e mulher, pais e filhos — não estamos sozinhos. O compromisso de levantar o que cai, perdoar e continuar juntos é o que diferencia um grupo de pessoas de uma família.',
        questions: [
            'Quando alguém da sua família "cai", como vocês reagem?',
            'De que forma você pode ser o "outro" que levanta nesta semana?',
        ],
        sortOrder: 5,
    },
    {
        dayNumber: 6,
        theme: 'Casamento e aliança',
        verse: '"Portanto, o que Deus uniu não o separe o homem." (Marcos 10:9)',
        reflection: 'O casamento é a aliança central da família. Deus une; o mundo tenta separar. Conservar o casamento é escolher diariamente honrar a aliança, comunicar-se com respeito e buscar reconciliação quando há feridas.',
        questions: [
            'O que "une" seu casamento além da lei ou da rotina?',
            'Que pequeno gesto pode fortalecer a união esta semana?',
        ],
        sortOrder: 6,
    },
    {
        dayNumber: 7,
        theme: 'Amor sacrificial',
        verse: '"Maridos, amai vossas mulheres, como também Cristo amou a igreja e a si mesmo se entregou por ela." (Efésios 5:25)',
        wordOriginal: 'agapao (ἀγαπάω)',
        wordMeaning: 'No grego, o amor que é decisão e entrega, não apenas emoção. Cristo deu a vida; esse é o padrão para o amor no casamento.',
        reflection: 'O amor que conserva a família é agapao — amor que escolhe, que se entrega, que serve. Não depende do que o outro "merece", mas da decisão de amar como Cristo amou. Hoje, reflita: seu amor em casa é sacrificial ou condicional?',
        questions: [
            'Em que situações você encontra mais dificuldade para amar de forma sacrificial?',
            'Que um gesto de "entrega" você pode fazer por alguém da sua família hoje?',
        ],
        sortOrder: 7,
    },
    {
        dayNumber: 8,
        theme: 'Filhos e herança',
        verse: '"Herança do Senhor são os filhos; o fruto do ventre, seu galardão." (Salmos 127:3)',
        reflection: 'Os filhos são herança e responsabilidade. Conservar a família inclui criar os filhos no caminho do Senhor — não apenas com palavras, mas com exemplo, tempo e disciplina amorosa.',
        questions: [
            'Que "herança" espiritual você deseja deixar para seus filhos?',
            'O que você pode fazer esta semana para investir nessa herança?',
        ],
        sortOrder: 8,
    },
    {
        dayNumber: 9,
        theme: 'Autoridade com graça',
        verse: '"Vós, pais, não provoqueis vossos filhos à ira, mas criai-os na disciplina e na admoestações do Senhor." (Efésios 6:4)',
        reflection: 'Autoridade bíblica não é autoritarismo. É liderar com firmeza e graça, disciplinando sem humilhar, corrigindo sem provocar ira. Conservar a família é exercer autoridade que protege e orienta.',
        questions: [
            'Como você equilibra disciplina e graça em casa?',
            'Há alguma área em que você precisa ajustar esse equilíbrio?',
        ],
        sortOrder: 9,
    },
    {
        dayNumber: 10,
        theme: 'Disciplina em amor',
        verse: '"A vara e a disciplina dão sabedoria, mas o filho entregue a si mesmo envergonha a sua mãe." (Provérbios 29:15)',
        reflection: 'Disciplina é parte do amor. Deixar o filho "entregue a si mesmo" não é liberdade — é abandono. Conservar a família é corrigir com amor e propósito, sempre apontando para o bem.',
        questions: [
            'De que forma a disciplina na sua casa comunica amor?',
            'Seus filhos entendem o "porquê" das regras e correções?',
        ],
        sortOrder: 10,
    },
    {
        dayNumber: 11,
        theme: 'Comunicação no lar',
        verse: '"A resposta branda desvia o furor, mas a palavra dura suscita a ira." (Provérbios 15:1)',
        reflection: 'A comunicação pode construir ou destruir. Palavras brandas, escuta atenta e respeito conservam o lar. Hoje, busque falar e ouvir de forma que edifique.',
        questions: [
            'Como está a qualidade da comunicação na sua família?',
            'Que um hábito você pode adotar para melhorar o diálogo em casa?',
        ],
        sortOrder: 11,
    },
    {
        dayNumber: 12,
        theme: 'Culto doméstico',
        verse: '"Tu e tua casa servireis ao Senhor." (Josué 24:15)',
        reflection: 'Josué tomou uma decisão em família. O culto doméstico — oração, leitura da Palavra e adoração juntos — é uma forma prática de "conservar" a fé no lar.',
        questions: [
            'Vocês têm algum momento regular de culto ou devocional em família?',
            'Que pequeno passo pode dar esta semana para cultivar isso?',
        ],
        sortOrder: 12,
    },
    {
        dayNumber: 13,
        theme: 'Provérbios e sabedoria',
        verse: '"O que guarda a lei é filho prudente." (Provérbios 28:7)',
        reflection: 'O livro de Provérbios é um guia para a vida em família. Sabedoria não é apenas conhecimento; é aplicar a Palavra no dia a dia. Conservar a família é buscar e praticar essa sabedoria.',
        questions: [
            'Qual provérbio você gostaria que sua família vivesse mais?',
            'Como você pode compartilhar um versículo de Provérbios com seus filhos esta semana?',
        ],
        sortOrder: 13,
    },
    {
        dayNumber: 14,
        theme: 'Educação segundo a Palavra',
        verse: '"Instrui o menino no caminho em que deve andar, e, até quando envelhecer, não se desviará dele." (Provérbios 22:6)',
        reflection: 'A educação que conserva é a que aponta para o "caminho" — os valores e a fé que permanecem. Não é controle rígido, mas direção clara dada com amor.',
        questions: [
            'Que "caminho" você está mostrando aos seus filhos?',
            'O que você quer que eles levem para a vida adulta?',
        ],
        sortOrder: 14,
    },
    {
        dayNumber: 15,
        theme: 'Ambiente espiritual',
        verse: '"E estas palavras que hoje te ordeno estarão no teu coração; e as ensinarás a teus filhos." (Deuteronômio 6:6-7)',
        reflection: 'O ambiente espiritual do lar é criado quando a Palavra está no coração dos pais e é ensinada naturalmente no dia a dia — em casa, no caminho, ao deitar e ao levantar.',
        questions: [
            'A Palavra está no seu coração de forma que transborde para seus filhos?',
            'Em que momento do dia você pode incluir uma conversa sobre Deus com sua família?',
        ],
        sortOrder: 15,
    },
    {
        dayNumber: 16,
        theme: 'Propósito da família',
        verse: '"Não fostes vós que me escolhestes a mim; pelo contrário, eu vos escolhi a vós." (João 15:16)',
        reflection: 'Deus nos escolheu e nos colocou em família com um propósito. Nossa casa não é por acaso; é um campo de missão e de formação. Conservar a família é viver esse propósito juntos.',
        questions: [
            'Qual você acredita ser o propósito da sua família?',
            'Como vocês podem cumprir esse propósito no bairro ou na igreja?',
        ],
        sortOrder: 16,
    },
    {
        dayNumber: 17,
        theme: 'Testemunho no mundo',
        verse: '"Assim brilhe a vossa luz diante dos homens." (Mateus 5:16)',
        reflection: 'Uma família conservada não fica só dentro de casa; ela brilha. O testemunho de um lar que ama, perdoa e serve é uma luz para o mundo ao redor.',
        questions: [
            'De que forma sua família pode "brilhar" para os vizinhos ou amigos?',
            'Que história de graça da sua casa você poderia compartilhar com alguém?',
        ],
        sortOrder: 17,
    },
    {
        dayNumber: 18,
        theme: 'Unidade',
        verse: '"Como é bom e agradável que os irmãos vivam em união!" (Salmos 133:1)',
        reflection: 'A unidade familiar não significa ausência de conflito, mas decisão de permanecer juntos, perdoar e buscar paz. Conservar é cultivar essa união.',
        questions: [
            'O que fortalece a união na sua família?',
            'Há algum conflito ou mágoa que precisa ser tratado para restaurar a unidade?',
        ],
        sortOrder: 18,
    },
    {
        dayNumber: 19,
        theme: 'Perdão em casa',
        verse: '"Antes, sede uns para com os outros benignos, compassivos, perdoando-vos uns aos outros." (Efésios 4:32)',
        reflection: 'Sem perdão, a família se desfaz. Perdoar em casa é escolher não guardar rancor e dar ao outro a mesma graça que Deus nos dá. Isso conserva relacionamentos.',
        questions: [
            'Há alguém em casa a quem você precisa perdoar ou pedir perdão?',
            'Como você pode demonstrar perdão de forma prática esta semana?',
        ],
        sortOrder: 19,
    },
    {
        dayNumber: 20,
        theme: 'Gratidão',
        verse: '"Em tudo dai graças." (1 Tessalonicenses 5:18)',
        reflection: 'Famílias que conservam o que importa são famílias gratas. Gratidão por um ao outro, pela provisão de Deus e pelos pequenos momentos transforma o ambiente do lar.',
        questions: [
            'Pelo que você é grato na sua família?',
            'Como você pode expressar gratidão em voz alta para seu cônjuge ou filhos hoje?',
        ],
        sortOrder: 20,
    },
    {
        dayNumber: 21,
        theme: 'Fé em família',
        verse: '"Crê no Senhor Jesus e serás salvo, tu e tua casa." (Atos 16:31)',
        reflection: 'A promessa é para "tu e tua casa". Nossa fé não é só individual; ela alcança e protege a família. Conservar a família é viver e transmitir essa fé.',
        questions: [
            'Como a fé é vivida e compartilhada na sua casa?',
            'O que você pode fazer para que sua família conheça e siga a Jesus?',
        ],
        sortOrder: 21,
    },
    {
        dayNumber: 22,
        theme: 'Esperança',
        verse: '"Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal." (Jeremias 29:11)',
        reflection: 'Deus tem planos de paz para nossa família. Mesmo em tempos difíceis, podemos conservar a esperança de que Ele está no controle e nos guarda.',
        questions: [
            'Em que área da sua família você precisa renovar a esperança?',
            'Como você pode lembrar a si e aos seus que Deus tem planos de paz?',
        ],
        sortOrder: 22,
    },
    {
        dayNumber: 23,
        theme: 'Perseverança',
        verse: '"Não nos cansemos de fazer o bem." (Gálatas 6:9)',
        reflection: 'Conservar a família exige perseverança. Fazer o bem em casa — dia após dia — pode ser cansativo, mas a colheita virá. Não desista.',
        questions: [
            'O que mais te cansa na rotina familiar?',
            'Como você pode se fortalecer para perseverar no bem?',
        ],
        sortOrder: 23,
    },
    {
        dayNumber: 24,
        theme: 'Legado',
        verse: '"Uma geração louvará as tuas obras à outra." (Salmos 145:4)',
        reflection: 'O que conservamos hoje vira legado amanhã. A forma como amamos, oramos e vivemos em família será lembrada pela próxima geração. Que legado você está construindo?',
        questions: [
            'Que legado espiritual você deseja deixar para as próximas gerações?',
            'O que você pode fazer esta semana que contribua para esse legado?',
        ],
        sortOrder: 24,
    },
    {
        dayNumber: 25,
        theme: 'Bênção',
        verse: '"O Senhor te abençoe e te guarde." (Números 6:24)',
        reflection: 'Deus quer abençoar e guardar nossa família. Quando buscamos a Ele e vivemos em obediência, abrimos espaço para essa bênção. Hoje, peça e declare bênção sobre sua casa.',
        questions: [
            'De que bênção sua família mais precisa agora?',
            'Como você pode abençoar verbalmente alguém da sua família hoje?',
        ],
        sortOrder: 25,
    },
    {
        dayNumber: 26,
        theme: 'Tempo de qualidade',
        verse: '"Ensina-nos a contar os nossos dias de tal maneira que alcancemos coração sábio." (Salmos 90:12)',
        reflection: 'Os dias passam rápido. Conservar a família é investir tempo de qualidade — presente, atento e intencional. Um coração sábio sabe que o tempo com os que amamos é precioso.',
        questions: [
            'Quanto tempo você dedica de fato à sua família (sem telas)?',
            'Que um momento especial você pode planejar para esta semana?',
        ],
        sortOrder: 26,
    },
    {
        dayNumber: 27,
        theme: 'Servir uns aos outros',
        verse: '"Porque o Filho do homem não veio para ser servido, mas para servir." (Marcos 10:45)',
        reflection: 'Jesus veio para servir. Em família, conservamos o amor quando servimos uns aos outros — nas tarefas, no cuidado e no apoio. Quem você pode servir em casa hoje?',
        questions: [
            'De que forma você pode servir seu cônjuge ou seus filhos esta semana?',
            'Que tarefa ou gesto você pode fazer sem esperar retorno?',
        ],
        sortOrder: 27,
    },
    {
        dayNumber: 28,
        theme: 'Paciência',
        verse: '"O amor é paciente." (1 Coríntios 13:4)',
        reflection: 'O amor que conserva é paciente. Paciência com o ritmo do outro, com os erros e com o processo de crescimento. Hoje, escolha ser paciente com alguém da sua família.',
        questions: [
            'Com quem em casa você precisa ser mais paciente?',
            'O que te ajuda a lembrar de respirar e esperar com amor?',
        ],
        sortOrder: 28,
    },
    {
        dayNumber: 29,
        theme: 'Revisão da jornada',
        verse: '"Examinai-vos a vós mesmos." (2 Coríntios 13:5)',
        reflection: 'Estamos perto do fim dos 30 dias. É tempo de revisar: o que mudou em sua família? O que você quer manter? O que ainda precisa de atenção? Examine seu coração e sua casa.',
        questions: [
            'Qual foi o maior aprendizado desses dias para você?',
            'Que um compromisso você quer levar para os próximos meses?',
        ],
        sortOrder: 29,
    },
    {
        dayNumber: 30,
        theme: 'Compromisso renovado',
        verse: '"Quanto a mim e à minha casa, serviremos ao Senhor." (Josué 24:15)',
        reflection: 'Como Josué, declare hoje: eu e minha casa serviremos ao Senhor. Que estes 30 dias sejam o início de uma jornada permanente de conservar sua família — na aliança, na guarda e no amor. Parabéns por concluir!',
        questions: [
            'Qual declaração você quer fazer em família hoje?',
            'Como você vai continuar cultivando sua família em conserva daqui em diante?',
        ],
        sortOrder: 30,
    },
];
async function seedDevocional() {
    const existing = await prisma.product.findUnique({ where: { slug: SLUG_DEVOCIONAL } });
    if (existing) {
        console.log('Produto devocional já existe:', SLUG_DEVOCIONAL);
        return;
    }
    const product = await prisma.product.create({
        data: {
            title: 'Devocional Família em Conserva',
            slug: SLUG_DEVOCIONAL,
            type: 'devocional',
            price: new library_1.Decimal(PRICE_DEVOCIONAL),
            badge: '30 dias',
            tag: 'devocional',
            description: 'Conservar aquilo que o mundo tenta dissolver. Um devocional de 30 dias para a família, com leituras bíblicas diárias, reflexões sobre casamento, filhos, autoridade, amor e propósito. Inclui perguntas para discussão em casa e espaço para oração guiada. Conceitos bíblicos como aliança (berith), guardar (shamar) e amor sacrificial (agapao) dão profundidade real à jornada.',
            active: true,
        },
    });
    for (const day of DEVOCIONAL_DAYS) {
        await prisma.devocionalDay.create({
            data: {
                productId: product.id,
                dayNumber: day.dayNumber,
                theme: day.theme,
                verse: day.verse,
                wordOriginal: day.wordOriginal ?? null,
                wordMeaning: day.wordMeaning ?? null,
                reflection: day.reflection,
                questions: day.questions,
                sortOrder: day.sortOrder,
            },
        });
    }
    console.log('Devocional criado: 1 produto, 30 dias.');
}
async function seedKit() {
    const existing = await prisma.product.findUnique({ where: { slug: SLUG_KIT } });
    if (existing) {
        console.log('Produto kit já existe:', SLUG_KIT);
        return;
    }
    const product = await prisma.product.create({
        data: {
            title: 'Kit Família em Conserva',
            slug: SLUG_KIT,
            type: 'kit',
            price: new library_1.Decimal(PRICE_KIT),
            badge: 'Kit completo',
            tag: 'kit',
            description: 'Tudo que você precisa para organizar e fortalecer sua família na fé: plano devocional semanal, guia de culto doméstico, planner familiar cristão, artes para imprimir e colocar em casa, versículos decorativos e capa para perfil "Minha família está em conserva". Prático e acessível.',
            active: true,
        },
    });
    await prisma.kitSection.createMany({
        data: [
            {
                productId: product.id,
                sectionKey: 'planner',
                title: 'Planner familiar cristão',
                config: {
                    weeklyGoals: true,
                    spiritualGoals: true,
                    familyMeeting: true,
                    defaultLabels: ['Metas espirituais', 'Culto doméstico', 'Oração em família', 'Tarefas dos filhos'],
                },
                sortOrder: 0,
            },
            {
                productId: product.id,
                sectionKey: 'worship_guide',
                title: 'Guia de culto doméstico',
                config: {
                    verses: [
                        'Guarda o teu coração, porque dele procedem as saídas da vida. (Provérbios 4:23)',
                        'Instrui o menino no caminho em que deve andar. (Provérbios 22:6)',
                        'Como é bom e agradável que os irmãos vivam em união! (Salmos 133:1)',
                        'Maridos, amai vossas mulheres, como também Cristo amou a igreja. (Efésios 5:25)',
                        'Em tudo dai graças. (1 Tessalonicenses 5:18)',
                        'A resposta branda desvia o furor. (Provérbios 15:1)',
                        'Herança do Senhor são os filhos. (Salmos 127:3)',
                        'Portanto, o que Deus uniu não o separe o homem. (Marcos 10:9)',
                        'Não provoqueis vossos filhos à ira. (Efésios 6:4)',
                        'Uma geração louvará as tuas obras à outra. (Salmos 145:4)',
                        'Quanto a mim e à minha casa, serviremos ao Senhor. (Josué 24:15)',
                        'O Senhor te abençoe e te guarde. (Números 6:24)',
                        'O amor é paciente. (1 Coríntios 13:4)',
                        'Melhor é dois do que um. (Eclesiastes 4:9)',
                        'Assim brilhe a vossa luz diante dos homens. (Mateus 5:16)',
                    ],
                    questions: [
                        'O que Deus nos ensinou hoje como família?',
                        'Por que precisamos guardar nosso coração?',
                        'Como podemos servir uns aos outros esta semana?',
                        'O que significa para nós viver em aliança?',
                        'Como podemos ser luz no nosso bairro?',
                        'Pelo que somos gratos hoje?',
                        'Como podemos perdoar e nos reconciliar?',
                        'Que versículo vamos decorar juntos?',
                        'Como podemos orar uns pelos outros?',
                        'O que vamos fazer para conservar nossa família?',
                        'Que decisão tomamos juntos hoje?',
                        'Como podemos honrar nossos pais?',
                        'O que aprendemos sobre o amor de Cristo?',
                        'Como vamos aplicar isso na prática?',
                        'Que bênção declaramos sobre nossa casa?',
                    ],
                    themes: [
                        'Aliança e compromisso',
                        'Guardar o coração',
                        'Amor sacrificial',
                        'Culto em família',
                        'Gratidão',
                        'Unidade',
                        'Perdão',
                        'Servir uns aos outros',
                        'Educação dos filhos',
                        'Legado e bênção',
                        'Luz no mundo',
                        'Perseverança',
                        'Esperança',
                        'Paciência',
                        'Fé em família',
                    ],
                },
                sortOrder: 1,
            },
            {
                productId: product.id,
                sectionKey: 'verse_library',
                title: 'Versículos decorativos e artes',
                config: {
                    items: [
                        { title: 'Guarda o teu coração – Provérbios 4:23', description: 'Arte para imprimir e colocar em casa.' },
                        { title: 'Minha família está em conserva', description: 'Capa para perfil nas redes sociais.' },
                        { title: 'Instrui o menino – Provérbios 22:6', description: 'Versículo decorativo.' },
                        { title: 'Quanto a mim e à minha casa – Josué 24:15', description: 'Arte para o lar.' },
                        { title: 'O Senhor te abençoe – Números 6:24', description: 'Bênção para imprimir.' },
                        { title: 'Como é bom viver em união – Salmos 133:1', description: 'Versículo para moldurar.' },
                        { title: 'Herança do Senhor são os filhos – Salmos 127:3', description: 'Arte para quarto de criança.' },
                        { title: 'Uma geração louvará – Salmos 145:4', description: 'Legado familiar.' },
                    ],
                },
                sortOrder: 2,
            },
        ],
    });
    console.log('Kit criado: 1 produto, 3 seções.');
}
async function seedCurso() {
    const existing = await prisma.product.findUnique({ where: { slug: SLUG_CURSO } });
    if (existing) {
        console.log('Produto curso já existe:', SLUG_CURSO);
        return;
    }
    const product = await prisma.product.create({
        data: {
            title: 'Como blindar sua família espiritualmente nos tempos atuais',
            slug: SLUG_CURSO,
            type: 'curso',
            price: new library_1.Decimal(PRICE_CURSO),
            badge: 'Curso',
            tag: 'curso',
            description: 'Curso curto para pais: cultura vs princípios bíblicos, educação dos filhos com base em Provérbios, autoridade e amor equilibrados, e como criar um ambiente espiritual saudável no lar. Conteúdo prático e aplicável.',
            active: true,
        },
    });
    const mod1 = await prisma.courseModule.create({
        data: {
            productId: product.id,
            title: 'Cultura e princípios bíblicos',
            description: 'Entenda a diferença entre o que o mundo propaga e o que a Bíblia ensina para a família. Como discernir e escolher os valores que vão guiar sua casa.',
            sortOrder: 0,
        },
    });
    await prisma.courseLesson.createMany({
        data: [
            {
                moduleId: mod1.id,
                title: 'Cultura atual e pressões sobre a família',
                summary: 'A cultura contemporânea oferece muitos modelos de família e de educação que conflitam com a visão bíblica. Nesta aula, identificamos as principais pressões (mídia, redes sociais, relativismo) e como elas afetam o lar. O objetivo é conscientizar para depois escolher com clareza os princípios que blindam a família.',
                practicalQuestion: 'Quais três influências da cultura você identifica hoje na sua casa e como você pode filtrá-las?',
                sortOrder: 0,
                durationMinutes: 10,
            },
            {
                moduleId: mod1.id,
                title: 'Princípios bíblicos que não mudam',
                summary: 'A Bíblia apresenta verdades atemporais sobre casamento, filhos, autoridade e amor. Revisamos esses princípios e por que eles "blindam" a família quando aplicados com graça e sabedoria.',
                practicalQuestion: 'Qual princípio bíblico você quer priorizar na sua família nesta semana?',
                sortOrder: 1,
                durationMinutes: 12,
            },
        ],
    });
    const mod2 = await prisma.courseModule.create({
        data: {
            productId: product.id,
            title: 'Educação dos filhos com base em Provérbios',
            description: 'O livro de Provérbios é um manual de sabedoria para a vida. Aprenda a aplicar seus ensinamentos na educação dos seus filhos.',
            sortOrder: 1,
        },
    });
    await prisma.courseLesson.createMany({
        data: [
            {
                moduleId: mod2.id,
                title: 'Instruir no caminho: Provérbios 22:6',
                summary: 'O versículo "instrui o menino no caminho em que deve andar" não é uma fórmula mágica, mas um chamado à responsabilidade e à perseverança. Refletimos sobre o que significa "caminho", como instruir na prática e como confiar no resultado a longo prazo.',
                practicalQuestion: 'Que "caminho" você está mostrando aos seus filhos no dia a dia? Está alinhado com a Palavra?',
                sortOrder: 0,
                durationMinutes: 11,
            },
            {
                moduleId: mod2.id,
                title: 'Disciplina e correção com sabedoria',
                summary: 'Provérbios fala de vara, disciplina e correção. Como aplicar isso hoje sem violência e com amor? Abordamos a diferença entre punição e disciplina formativa, e como corrigir de forma que edifique.',
                practicalQuestion: 'Em uma situação recente, sua correção comunicou amor ou apenas raiva? O que você pode ajustar?',
                sortOrder: 1,
                durationMinutes: 10,
            },
        ],
    });
    const mod3 = await prisma.courseModule.create({
        data: {
            productId: product.id,
            title: 'Autoridade e amor equilibrados',
            description: 'Ser autoridade em casa não significa ser autoritário. Aprenda a liderar com firmeza e graça, como Cristo.',
            sortOrder: 2,
        },
    });
    await prisma.courseLesson.createMany({
        data: [
            {
                moduleId: mod3.id,
                title: 'Autoridade que protege e orienta',
                summary: 'Deus delegou aos pais a autoridade para proteger e orientar os filhos. Essa autoridade é serviço, não domínio. Refletimos sobre Efésios 6 e como exercer liderança sem provocar ira.',
                practicalQuestion: 'Você tem usado sua autoridade para servir ou para impor? Que um ajuste você pode fazer?',
                sortOrder: 0,
                durationMinutes: 10,
            },
            {
                moduleId: mod3.id,
                title: 'Amor que disciplina: Efésios 5 e 6',
                summary: 'O amor no casamento (Efésios 5) e na relação com os filhos (Efésios 6) é o contexto da autoridade. Amor sacrificial e disciplina amorosa andam juntos. Como equilibrar os dois no dia a dia.',
                practicalQuestion: 'Como você pode demonstrar amor e firmeza na mesma situação esta semana?',
                sortOrder: 1,
                durationMinutes: 11,
            },
        ],
    });
    const mod4 = await prisma.courseModule.create({
        data: {
            productId: product.id,
            title: 'Ambiente espiritual saudável no lar',
            description: 'Criar um ambiente onde a fé é vivida, oração é prática e a Palavra é central. Passos concretos para sua casa.',
            sortOrder: 3,
        },
    });
    await prisma.courseLesson.createMany({
        data: [
            {
                moduleId: mod4.id,
                title: 'Culto doméstico e devocional em família',
                summary: 'O culto doméstico não precisa ser longo ou complicado. Um momento de leitura, oração e conversa já transforma o ambiente. Ideias práticas para começar ou renovar esse hábito.',
                practicalQuestion: 'Que um momento fixo você pode estabelecer esta semana para orar ou ler a Bíblia em família?',
                sortOrder: 0,
                durationMinutes: 10,
            },
            {
                moduleId: mod4.id,
                title: 'Conversas que edificam e oração contínua',
                summary: 'O ambiente espiritual é feito de conversas que apontam para Deus e de oração que inclui os filhos. Como falar de fé no dia a dia e como orar juntos em momentos de alegria e de dificuldade.',
                practicalQuestion: 'Quantas vezes esta semana você orou com ou por alguém da sua família? Como aumentar isso?',
                sortOrder: 1,
                durationMinutes: 9,
            },
        ],
    });
    console.log('Curso criado: 1 produto, 4 módulos, 8 aulas.');
}
const BADGES_DEVOCIONAL = [
    { code: 'primeiro_passo', name: 'Primeiro passo', description: 'Você deu o primeiro passo na jornada do devocional.', conditionType: 'days_completed', conditionValue: { days: 1 } },
    { code: 'em_marcha', name: 'Em marcha', description: 'Cinco dias de reflexão em família.', conditionType: 'days_completed', conditionValue: { days: 5 } },
    { code: 'dez_dias_bencao', name: 'Dez dias de bênção', description: 'Uma década de dias dedicados ao lar.', conditionType: 'days_completed', conditionValue: { days: 10 } },
    { code: 'meio_caminho', name: 'Meio caminho', description: 'Metade da jornada concluída.', conditionType: 'days_completed', conditionValue: { days: 15 } },
    { code: 'quase_la', name: 'Quase lá', description: 'Faltam apenas dez dias para o fim.', conditionType: 'days_completed', conditionValue: { days: 20 } },
    { code: 'reta_final', name: 'Reta final', description: 'Últimos passos até os 30 dias.', conditionType: 'days_completed', conditionValue: { days: 25 } },
    { code: 'guardiao_lar', name: 'Guardião do Lar', description: 'Completou os 30 dias do devocional Família em Conserva.', conditionType: 'days_completed', conditionValue: { days: 30 } },
    { code: 'aquecendo', name: 'Aquecendo', description: 'Três dias seguidos no devocional.', conditionType: 'streak', conditionValue: { days: 3 } },
    { code: 'fiel_jornada', name: 'Fiel na jornada', description: 'Manteve um streak de 7 dias seguidos no devocional.', conditionType: 'streak_7', conditionValue: {} },
    { code: 'duas_semanas_firmes', name: 'Duas semanas firmes', description: 'Quatorze dias de sequência.', conditionType: 'streak', conditionValue: { days: 14 } },
];
async function seedBadges(devocionalProductId) {
    const existingBadges = await prisma.badge.findMany({
        where: { productId: devocionalProductId },
        select: { code: true },
    });
    const existingCodes = new Set(existingBadges.map((b) => b.code));
    const toCreate = BADGES_DEVOCIONAL.filter((b) => !existingCodes.has(b.code));
    if (toCreate.length === 0) {
        console.log('Badges do devocional já estão completos.');
        return;
    }
    for (const b of toCreate) {
        await prisma.badge.create({
            data: {
                productId: devocionalProductId,
                code: b.code,
                name: b.name,
                description: b.description,
                conditionType: b.conditionType,
                conditionValue: b.conditionValue,
            },
        });
    }
    console.log(`${toCreate.length} medalha(s) criada(s) para o devocional.`);
}
async function main() {
    console.log('Iniciando seed de produtos...');
    await seedDevocional();
    await seedKit();
    await seedCurso();
    const devocional = await prisma.product.findUnique({ where: { slug: SLUG_DEVOCIONAL } });
    if (devocional) {
        await seedBadges(devocional.id);
    }
    console.log('Seed de produtos concluído.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-products.js.map