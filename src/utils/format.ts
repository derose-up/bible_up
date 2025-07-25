export const formatarWhatsApp = (numero: string): string => {
  const cleaned = numero.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return numero;
};

export const limparWhatsApp = (numero: string): string => {
  return numero.replace(/\D/g, '');
};

export const formatarTexto = (texto: string, limite: number = 100): string => {
  if (texto.length <= limite) return texto;
  return texto.substring(0, limite) + '...';
};

export const capitalizar = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const gerarSlug = (texto: string): string => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};