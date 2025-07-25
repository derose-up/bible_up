export const formatarData = (data: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(data);
};

export const formatarDataHora = (data: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(data);
};

export const calcularDiasDesde = (data: Date | null | undefined): number => {
  if (!(data instanceof Date)) {
    return Infinity; // Se não for data válida, considera como "antigo"
  }

  const hoje = new Date();
  const diferenca = hoje.getTime() - data.getTime();
  return Math.floor(diferenca / (1000 * 60 * 60 * 24));
};

export const isNovo = (data: Date | null | undefined): boolean => {
  return calcularDiasDesde(data) <= 7;
};
