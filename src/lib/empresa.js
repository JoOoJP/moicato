// Identificação do vendedor — exigida no site pelo Decreto 7.962/2013
// (comércio eletrônico). Usada no rodapé, nas políticas e nos e-mails.
// Campo vazio = não aparece no site. Preencher com os dados oficiais do CNPJ.
export const COMPANY = {
  tradeName: "Moikato",
  legalName: "65.363.770 João Antonio de Freitas Pombo", // razão social (MEI), como na Receita
  cnpj: "65.363.770/0001-44",
  address: {
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    uf: "",
    cep: "",
  },
  serviceEmail: "", // e-mail de atendimento (trocas, dúvidas, LGPD)
  serviceHours: "", // ex.: "Segunda a sexta, das 9h às 18h"
};

export function formatAddress(address = COMPANY.address) {
  const { street, number, complement, district, city, uf, cep } = address;
  if (!street || !city) return "";
  const line1 = [street, number].filter(Boolean).join(", ") + (complement ? ` — ${complement}` : "");
  const line2 = [district, city && uf ? `${city}/${uf}` : city].filter(Boolean).join(" · ");
  return [line1, line2, cep ? `CEP ${cep}` : ""].filter(Boolean).join(" · ");
}

// Linha legal do rodapé: "Razão social · CNPJ … · endereço" (só o que existir).
export function legalLine() {
  return [
    COMPANY.legalName,
    COMPANY.cnpj ? `CNPJ ${COMPANY.cnpj}` : "",
    formatAddress(),
  ]
    .filter(Boolean)
    .join(" · ");
}
