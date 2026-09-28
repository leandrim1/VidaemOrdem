/**
 * Registro de funções de reset dos stores de dados do usuário.
 * Ao sair da conta, todos os caches em memória são limpos para que os dados de
 * um usuário nunca apareçam para o próximo.
 */
const resetters = new Set<() => void>()

export function registerReset(reset: () => void): void {
  resetters.add(reset)
}

export function resetUserStores(): void {
  resetters.forEach((reset) => reset())
}
