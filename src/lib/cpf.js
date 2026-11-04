// Validação de CPF (dígitos verificadores). Aceita com ou sem pontuação.
export function normalizeCpf(input) {
  return String(input ?? "").replace(/\D/g, "");
}

export function isValidCpf(input) {
  const cpf = normalizeCpf(input);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const digit = (len) => {
    let sum = 0;
    for (let i = 0; i < len; i += 1) sum += Number(cpf[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

export function normalizeCep(input) {
  return String(input ?? "").replace(/\D/g, "");
}
