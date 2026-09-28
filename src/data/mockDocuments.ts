import type { Document } from '@/types'
import { daysFromToday } from '@/utils/date'

export function createMockDocuments(): Document[] {
  const created = new Date().toISOString()
  const doc = (id: number, data: Omit<Document, 'id' | 'createdAt'>): Document => ({ id: `doc-${id}`, createdAt: created, ...data })
  return [
    doc(1, { name: 'RG', category: 'pessoais', location: 'Carteira', notes: 'Cópia digital no Drive > Documentos pessoais' }),
    doc(2, { name: 'CNH', category: 'pessoais', expiresAt: daysFromToday(45), location: 'Carteira + app CNH Digital', notes: 'Agendar exame médico para renovação.' }),
    doc(3, { name: 'Passaporte', category: 'pessoais', expiresAt: daysFromToday(730), location: 'Pasta azul — armário do quarto' }),
    doc(4, { name: 'Declaração de IR 2026', category: 'financeiros', location: 'Drive > Finanças > Imposto de Renda', notes: 'Recibo de entrega salvo junto.' }),
    doc(5, { name: 'Comprovantes médicos do ano', category: 'financeiros', location: 'Pasta sanfonada — escritório', notes: 'Guardar para a próxima declaração.' }),
    doc(6, { name: 'Contrato de aluguel', category: 'casa', expiresAt: daysFromToday(240), location: 'Pasta da casa', notes: 'Reajuste anual pelo IPCA.' }),
    doc(7, { name: 'Garantia da geladeira', category: 'casa', expiresAt: daysFromToday(-20), location: 'Gaveta da cozinha' }),
    doc(8, { name: 'CRLV do carro', category: 'veiculo', expiresAt: daysFromToday(95), location: 'Porta-luvas + app Carteira Digital de Trânsito' }),
    doc(9, { name: 'Apólice do seguro auto', category: 'veiculo', expiresAt: daysFromToday(150), location: 'E-mail da seguradora (marcador "Carro")' }),
    doc(10, { name: 'Contrato de trabalho', category: 'trabalho', location: 'Drive > Trabalho' }),
    doc(11, { name: 'Diploma de graduação', category: 'estudos', location: 'Pasta de diplomas — escritório' }),
    doc(12, { name: 'Certidão de nascimento — Lucas', category: 'familia', location: 'Pasta da família', notes: 'Original + 2 cópias autenticadas.' }),
    doc(13, { name: 'Carteira de vacinação — Lucas', category: 'familia', location: 'Pasta da família' }),
  ]
}
