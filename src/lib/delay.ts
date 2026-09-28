/**
 * Simula a latência de rede dos serviços mockados, para que os estados de
 * carregamento da interface sejam exercitados como seriam com uma API real.
 */
export function delay(ms = 220): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
