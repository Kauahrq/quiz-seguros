import React, { useState } from 'react';

// Cole aqui a URL terminada em /exec gerada no Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxYSPeYWw9J611ibuYmgw7zj_FdPyHwWwRvqmURk0Kqlzbc75zjP6FMhbkqlaCZJepR/exec";

const questoes = [
  {
    pergunta: "Em qual situação a reativação do seguro NÃO pode ser realizada?",
    opcoes: [
      "Quando o cancelamento ocorreu por falta de pagamento há 60 dias",
      "Quando o cancelamento ocorreu por falta de pagamento há 30 dias",
      "Quando o cancelamento ocorreu por resgate solicitado pelo segurado",
      "Quando o cliente deseja atualizar seus dados cadastrais"
    ],
    respostaCerta: 2
  },
  {
    pergunta: "Qual é o prazo máximo para solicitar reativação de um seguro cancelado por falta de pagamento?",
    opcoes: [
      "60 dias após o cancelamento",
      "90 dias após o cancelamento",
      "120 dias após o cancelamento",
      "30 dias após o cancelamento"
    ],
    respostaCerta: 1
  },
  {
    pergunta: "Em qual período a solicitação de alteração do capital segurado poderá ser analisada para apólices da modalidade capital global?",
    opcoes: [
      "A qualquer momento durante a vigência do seguro",
      "Somente após o vencimento da próxima fatura",
      "Apenas nos 30 dias que antecedem o aniversário do seguro",
      "Apenas no momento da renovação anual da apólice"
    ],
    respostaCerta: 2
  },
  {
    pergunta: "Ao receber uma solicitação de alteração de capital para um produto elegível (CNPJ), qual informação deve ser repassada ao cliente?",
    opcoes: [
      "A alteração será efetivada após a emissão da próxima fatura/cobrança, mediante análise",
      "A alteração será realizada imediatamente após o registro da manifestação",
      "A alteração será efetivada em até 5 dias úteis após a solicitação",
      "A alteração só poderá ser realizada presencialmente na corretora"
    ],
    respostaCerta: 0
  },
  {
    pergunta: "Um cliente solicita a segunda via da apólice de um seguro ativo. Qual deve ser a orientação inicial do atendente?",
    opcoes: [
      "Abrir manifestação no sistema para emissão de apólice",
      "Orientar o cliente a acessar os canais digitais, sem registrar manifestação",
      "Solicitar o envio de documentos para validação de identidade",
      "Emitir a apólice e enviar para a residência do cliente"
    ],
    respostaCerta: 1
  },
  {
    pergunta: "Um segurado solicita a segunda via da apólice de um seguro que consta como cancelado. Qual é o procedimento correto?",
    opcoes: [
      "Emitir o certificado via portal vida e encaminhar ao cliente por e-mail",
      "Informar que não é possível fornecer qualquer documentação após o cancelamento",
      "Abrir manifestação solicitando a emissão da apólice",
      "Direcionar exclusivamente ao corretor de seguros responsável"
    ],
    respostaCerta: 2
  },
  {
    pergunta: "Um cliente possui um produto Kirton e solicita a emissão da segunda via de apólice. Como proceder?",
    opcoes: [
      "Emitir o certificado normalmente pelo portal vida e realizar o envio",
      "Informar que não é possível consultar nenhuma informação da apólice",
      "Orientar a consulta no site e, em caso de insistência, abrir manifestação ao setor",
      "Transferir o cliente imediatamente para o setor de cancelamento"
    ],
    respostaCerta: 2
  },
  {
    pergunta: "Cliente no canal de voz solicita segunda via de apólice. Como proceder?",
    opcoes: [
      "Orientar aos canais digitais no momento da solicitação",
      "Verificar se a apólice está inclusa nos critérios de exceções e orientar corretamente",
      "Emitir a apólice após validação dos dados e realizar o envio por e-mail",
      "Pedir para o cliente retornar o contato em 24 horas úteis"
    ],
    respostaCerta: 1
  }
];

export default function App() {
  const [nomeAluno, setNomeAluno] = useState("");
  const [quizIniciado, setQuizIniciado] = useState(false);
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [isRespondido, setIsRespondido] = useState(false);
  const [statusEnvio, setStatusEnvio] = useState("");

  const enviarParaPlanilha = async (pontuacaoFinal) => {
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === "https://script.google.com/macros/s/AKfycbxYSPeYWw9J611ibuYmgw7zj_FdPyHwWwRvqmURk0Kqlzbc75zjP6FMhbkqlaCZJepR/exec") {
      return;
    }

    setStatusEnvio("Salvando resultado...");
    const porcentagem = Math.round((pontuacaoFinal / questoes.length) * 100);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          nome: nomeAluno,
          acertos: pontuacaoFinal,
          total: questoes.length,
          porcentagem: porcentagem
        }),
      });
      setStatusEnvio("Resultado registrado com sucesso!");
    } catch (error) {
      setStatusEnvio("Não foi possível salvar automaticamente.");
    }
  };

  const iniciarQuiz = (e) => {
    e.preventDefault();
    if (nomeAluno.trim() !== "") {
      setQuizIniciado(true);
    }
  };

  const lidarComResposta = (indiceOpcao) => {
    setOpcaoSelecionada(indiceOpcao);
    setIsRespondido(true);

    const acertou = indiceOpcao === questoes[perguntaAtual].respostaCerta;
    const novaPontuacao = acertou ? pontuacao + 1 : pontuacao;

    if (acertou) {
      setPontuacao(novaPontuacao);
    }

    setTimeout(() => {
      const proximaPergunta = perguntaAtual + 1;
      if (proximaPergunta < questoes.length) {
        setPerguntaAtual(proximaPergunta);
        setOpcaoSelecionada(null);
        setIsRespondido(false);
      } else {
        setMostrarResultado(true);
        enviarParaPlanilha(novaPontuacao);
      }
    }, 2000);
  };

  const reiniciarQuiz = () => {
    setQuizIniciado(false);
    setNomeAluno("");
    setPerguntaAtual(0);
    setPontuacao(0);
    setMostrarResultado(false);
    setOpcaoSelecionada(null);
    setIsRespondido(false);
    setStatusEnvio("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8">
        
        {!quizIniciado ? (
          <form onSubmit={iniciarQuiz} className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              Quiz de Seguros
            </h1>
            <p className="text-gray-600 mb-6">
              Digite seu nome completo para iniciar a avaliação.
            </p>
            <input
              type="text"
              required
              placeholder="Seu nome completo"
              value={nomeAluno}
              onChange={(e) => setNomeAluno(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg mb-6 text-gray-800 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full cursor-pointer"
            >
              Começar Quiz
            </button>
          </form>
        ) : mostrarResultado ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Resultado Final!</h2>
            <p className="text-gray-500 mb-4">Aluno: <span className="font-semibold text-gray-700">{nomeAluno}</span></p>
            <p className="text-xl text-gray-600 mb-6">
              Você acertou <span className="font-bold text-blue-600">{pontuacao}</span> de {questoes.length} perguntas.
            </p>
            
            <div className="mb-6">
              {pontuacao >= 6 ? (
                <div className="p-4 bg-green-100 text-green-700 rounded-lg text-lg font-medium">
                  🎉 Excelente trabalho! Você domina os processos!
                </div>
              ) : pontuacao >= 4 ? (
                <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg text-lg font-medium">
                  👍 Bom trabalho, mas vale a pena revisar alguns pontos!
                </div>
              ) : (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg text-lg font-medium">
                  📚 Não desanime! Revise o material e tente novamente.
                </div>
              )}
            </div>

            {statusEnvio && (
              <p className="text-sm text-gray-500 mb-6">{statusEnvio}</p>
            )}

            <button 
              onClick={reiniciarQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full cursor-pointer"
            >
              Fazer Novamente
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
              <span>Questão {perguntaAtual + 1} de {questoes.length}</span>
              <span>Acertos: {pontuacao}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${((perguntaAtual) / questoes.length) * 100}%` }}
              ></div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
              {questoes[perguntaAtual].pergunta}
            </h2>

            <div className="space-y-3">
              {questoes[perguntaAtual].opcoes.map((opcao, index) => {
                
                let classesBotao = "w-full text-left p-4 rounded-lg border-2 transition-all font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 cursor-pointer";
                
                if (isRespondido) {
                  if (index === questoes[perguntaAtual].respostaCerta) {
                    classesBotao = "w-full text-left p-4 rounded-lg border-2 font-medium bg-green-100 border-green-500 text-green-800";
                  } else if (index === opcaoSelecionada) {
                    classesBotao = "w-full text-left p-4 rounded-lg border-2 font-medium bg-red-100 border-red-500 text-red-800";
                  } else {
                    classesBotao = "w-full text-left p-4 rounded-lg border-2 font-medium bg-gray-50 border-gray-200 text-gray-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={index}
                    disabled={isRespondido}
                    onClick={() => lidarComResposta(index)}
                    className={classesBotao}
                  >
                    {opcao}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}