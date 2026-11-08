// Políticas da loja (pt-BR). Rascunho redigido a partir do CDC, do Decreto
// 7.962/2013 e da LGPD, refletindo a operação real do site (Asaas, Melhor
// Envio, Neon/Vercel). Revisar com contador/advogado antes de abrir as vendas.
import { COMPANY, formatAddress } from "../lib/empresa";

const UPDATED = "8 de novembro de 2026";

function contact() {
  const parts = [];
  if (COMPANY.serviceEmail) parts.push(`pelo e-mail ${COMPANY.serviceEmail}`);
  parts.push("pelo WhatsApp indicado no rodapé do site");
  return parts.join(" ou ");
}

function seller() {
  const id = [COMPANY.legalName || COMPANY.tradeName, COMPANY.cnpj ? `CNPJ ${COMPANY.cnpj}` : ""].filter(Boolean).join(", ");
  const address = formatAddress();
  return address ? `${id}, com endereço em ${address}` : id;
}

export const POLICIES = {
  "trocas-e-devolucoes": {
    title: "Trocas e devoluções",
    description: "Como desistir de uma compra, trocar ou devolver uma peça Moikato.",
    updated: UPDATED,
    sections: () => [
      {
        body: [
          "Cada peça Moikato é feita à mão com capim dourado. Queremos que ela chegue do jeito que você imaginou — e, se não chegar, resolvemos com você.",
        ],
      },
      {
        heading: "Arrependimento: 7 dias para desistir",
        body: [
          "Você pode desistir da compra em até 7 dias corridos contados do recebimento, sem precisar justificar, como prevê o artigo 49 do Código de Defesa do Consumidor.",
          "Nesse caso devolvemos o valor integral pago, incluindo o frete de envio, e a devolução da peça não tem custo para você: enviamos uma etiqueta de postagem.",
          "Pedimos que a peça volte sem sinais de uso, com o cartão e a embalagem que a acompanharam, para que possamos recebê-la de volta com o mesmo cuidado com que foi feita.",
        ],
      },
      {
        heading: "Defeitos: até 90 dias",
        body: [
          "Se a peça apresentar defeito de fabricação, você tem até 90 dias a partir do recebimento para nos avisar (artigo 26 do CDC). Avaliamos e resolvemos em até 30 dias com reparo, troca por peça equivalente ou devolução do valor.",
          "Pequenas diferenças de tom, trama e formato em relação às fotos fazem parte do trabalho artesanal e não são consideradas defeito.",
        ],
      },
      {
        heading: "Peça danificada no transporte",
        body: [
          "Se a embalagem chegar violada ou a peça chegar danificada, fotografe a embalagem e a peça e fale com a gente em até 7 dias do recebimento. Cuidamos do contato com a transportadora e da reposição ou do reembolso.",
        ],
      },
      {
        heading: "Troca por outra peça",
        body: [
          "Dentro do prazo de 7 dias, você também pode trocar por outra peça do catálogo, sujeita à disponibilidade. Se houver diferença de valor, ajustamos com você.",
        ],
      },
      {
        heading: "Como pedir",
        body: [`Fale com a gente ${contact()}, informando o número do pedido e o motivo. Respondemos em até 2 dias úteis com as instruções.`],
      },
      {
        heading: "Reembolso",
        list: [
          "Pagamentos via Pix: devolvidos para a conta de origem em até 5 dias úteis após recebermos a peça.",
          "Cartão de crédito: pedimos o estorno à operadora em até 5 dias úteis após recebermos a peça. O crédito aparece em até duas faturas, conforme o banco emissor.",
        ],
      },
    ],
  },

  privacidade: {
    title: "Política de privacidade",
    description: "Quais dados a Moikato coleta, por que, com quem compartilha e como você exerce seus direitos (LGPD).",
    updated: UPDATED,
    sections: () => [
      {
        body: [
          `Esta política explica como tratamos seus dados pessoais neste site, em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018). A responsável pelo tratamento (controladora) é ${seller()}.`,
        ],
      },
      {
        heading: "Quais dados coletamos",
        list: [
          "Ao comprar: nome, e-mail, celular, CPF, endereço de entrega, itens do pedido e, se você quiser, a mensagem para presente.",
          "Ao navegar: métricas agregadas de uso e desempenho (Vercel Analytics e Speed Insights), sem cookies e sem identificar você.",
          "Sua sacola fica guardada só no seu navegador (armazenamento local) e não é enviada para nós até você finalizar a compra.",
        ],
      },
      {
        heading: "Pagamento",
        body: [
          "O pagamento é feito no ambiente seguro do Asaas, instituição de pagamento autorizada pelo Banco Central. Não recebemos nem armazenamos os dados do seu cartão.",
        ],
      },
      {
        heading: "Para que usamos",
        list: [
          "Processar e entregar seu pedido, enviar confirmações e o código de rastreio, e prestar atendimento (execução de contrato).",
          "Emitir nota fiscal e manter registros fiscais e contábeis (obrigação legal).",
          "Prevenir fraudes e manter o site seguro e funcionando bem (legítimo interesse).",
          "Enviar novidades e ofertas somente se você autorizar expressamente — e você pode cancelar a qualquer momento.",
        ],
      },
      {
        heading: "Com quem compartilhamos",
        body: ["Somente com quem precisamos para concluir a sua compra. Não vendemos seus dados."],
        list: [
          "Asaas — processamento do pagamento.",
          "Melhor Envio e a transportadora escolhida — cálculo do frete, etiqueta e entrega.",
          "Neon e Vercel — hospedagem do banco de dados e do site.",
          "Contabilidade — emissão de notas e obrigações fiscais.",
          "Autoridades públicas, quando exigido por lei.",
        ],
      },
      {
        heading: "Onde os dados ficam",
        body: [
          "Alguns desses fornecedores armazenam dados em servidores nos Estados Unidos. Essa transferência ocorre com fornecedores que adotam padrões de segurança e proteção compatíveis com a LGPD.",
        ],
      },
      {
        heading: "Por quanto tempo",
        body: [
          "Guardamos os dados do pedido enquanto forem necessários para a entrega, o atendimento e as garantias, e pelo prazo exigido pela legislação fiscal (em geral, 5 anos). Depois disso, eliminamos ou anonimizamos.",
        ],
      },
      {
        heading: "Seus direitos",
        body: [
          `Você pode, a qualquer momento: confirmar se tratamos seus dados, acessá-los, corrigi-los, pedir anonimização ou eliminação do que não for obrigatório manter, pedir portabilidade, saber com quem compartilhamos e revogar um consentimento. Para isso, fale com a gente ${contact()}. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).`,
        ],
      },
      {
        heading: "Segurança",
        body: [
          "Usamos conexão criptografada (HTTPS) em todo o site, acesso restrito ao painel administrativo e fornecedores com práticas reconhecidas de segurança.",
        ],
      },
    ],
  },

  termos: {
    title: "Termos de uso e de venda",
    description: "As regras de compra na loja Moikato: produtos, preços, pagamento, entrega e garantias.",
    updated: UPDATED,
    sections: () => [
      {
        body: [`Este site é operado por ${seller()}. Ao comprar aqui, você concorda com estes termos.`],
      },
      {
        heading: "Produtos artesanais",
        body: [
          "As peças são feitas à mão com capim dourado e outros materiais naturais. Cada uma pode ter pequenas variações de cor, trama e formato em relação às fotos, que são ilustrativas.",
        ],
      },
      {
        heading: "Preços e disponibilidade",
        body: [
          "Os preços estão em reais e podem mudar a qualquer momento, sem afetar pedidos já pagos. O estoque de cada peça é limitado. Se houver erro evidente de preço ou de estoque, avisamos você e, se preferir, cancelamos o pedido com devolução integral.",
        ],
      },
      {
        heading: "Pedido e pagamento",
        body: [
          "O pagamento é feito por Pix ou cartão de crédito no ambiente do Asaas. A peça fica reservada para você por 60 minutos enquanto o pagamento é concluído. O pedido é confirmado quando o pagamento é aprovado, e você recebe a confirmação por e-mail.",
        ],
      },
      {
        heading: "Entrega",
        body: [
          "Enviamos para todo o Brasil. O prazo informado no checkout soma os dias de preparo da peça e o prazo da transportadora, e começa a contar após a confirmação do pagamento. Você recebe o código de rastreio por e-mail quando a peça é postada. Confira o endereço com atenção: entregas devolvidas por endereço incorreto podem ter novo frete.",
        ],
      },
      {
        heading: "Trocas, devoluções e garantia",
        body: ["Valem as regras da nossa política de Trocas e devoluções, em conformidade com o Código de Defesa do Consumidor."],
      },
      {
        heading: "Propriedade intelectual",
        body: ["Fotos, textos, marca e criações da Moikato não podem ser reproduzidos sem autorização."],
      },
      {
        heading: "Lei aplicável",
        body: [
          `Estes termos seguem a legislação brasileira, em especial o Código de Defesa do Consumidor. Dúvidas ou problemas: fale com a gente ${contact()}.`,
        ],
      },
    ],
  },
};

export const POLICY_SLUGS = Object.keys(POLICIES);
