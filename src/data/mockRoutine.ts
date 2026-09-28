import type { RoutineEvent, RoutineEventType } from '@/types'
import { daysFromToday } from '@/utils/date'

type Seed = [dayOffset: number, start: string, end: string | undefined, title: string, type: RoutineEventType, location?: string]

const SEEDS: Seed[] = [
  [-2, '09:00', '10:00', 'Reunião com cliente', 'compromisso', 'Google Meet'],
  [-1, '07:00', '08:00', 'Treino funcional', 'compromisso', 'Academia'],
  [-1, '18:30', '19:30', 'Aula de inglês', 'compromisso', 'Online'],
  [0, '07:00', '08:00', 'Treino funcional', 'compromisso', 'Academia'],
  [0, '09:30', '10:30', 'Reunião de alinhamento', 'compromisso', 'Escritório'],
  [0, '14:00', '15:00', 'Enviar relatório mensal', 'tarefa'],
  [0, '19:30', '21:00', 'Jantar em família', 'evento', 'Casa'],
  [1, '08:00', '09:00', 'Estudar módulo 3 de UX', 'tarefa'],
  [1, '12:30', '13:30', 'Almoço com Carla', 'compromisso', 'Restaurante Lótus'],
  [1, '18:00', '19:00', 'Pilates', 'compromisso', 'Studio Equilíbrio'],
  [2, '07:00', '08:00', 'Treino funcional', 'compromisso', 'Academia'],
  [2, '10:00', '11:30', 'Planejamento trimestral', 'compromisso', 'Sala 3'],
  [2, '16:00', undefined, 'Pagar internet', 'tarefa'],
  [3, '09:00', '10:00', 'Dentista', 'compromisso', 'Clínica Sorriso'],
  [3, '15:00', '16:00', 'Organizar documentos', 'tarefa'],
  [4, '07:00', '08:00', 'Treino funcional', 'compromisso', 'Academia'],
  [4, '20:00', '23:00', 'Aniversário da Ana', 'evento', 'Casa da Ana'],
  [5, '10:00', '11:00', 'Feira orgânica', 'evento', 'Praça da Liberdade'],
  [5, '16:00', '18:30', 'Cinema com amigos', 'evento', 'Shopping Pátio'],
  [6, '09:00', '09:45', 'Revisão semanal do orçamento', 'tarefa'],
  [6, '12:00', '15:00', 'Almoço na casa dos pais', 'evento'],
  [8, '14:00', '15:30', 'Revisão do carro', 'compromisso', 'Oficina Auto Center'],
  [12, '19:00', '22:00', 'Show no teatro', 'evento', 'Teatro Municipal'],
  [15, '10:00', '11:00', 'Consulta check-up anual', 'compromisso', 'Hospital Santa Luzia'],
]

export function createMockRoutine(): RoutineEvent[] {
  const created = new Date().toISOString()
  return SEEDS.map(([offset, startTime, endTime, title, type, location], index) => ({
    id: `evt-${index + 1}`,
    createdAt: created,
    title,
    type,
    date: daysFromToday(offset),
    startTime,
    endTime,
    location,
  }))
}
