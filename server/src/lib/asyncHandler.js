// Express 4 não captura rejeições de handlers async sozinho — sem isso, um
// erro (ex: violação de constraint do banco) vira uma unhandled rejection e
// derruba o processo Node inteiro. Envolve o handler pra sempre cair no
// middleware de erro em vez de crashar o servidor.
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
