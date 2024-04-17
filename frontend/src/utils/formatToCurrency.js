/* eslint-disable new-cap */
export default function formatToCurrency(value) {
  return Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
