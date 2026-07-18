import { apiRequest } from '../lib/api'

export const COBRANCA_PERIODS = ['Dia 1-10', 'Dia 15-20', 'Dia 20-30']

export async function listClientes() {
  const { clientes } = await apiRequest('/clientes')
  return clientes
}

export async function addCliente(data) {
  const { cliente } = await apiRequest('/clientes', { method: 'POST', body: data })
  return cliente
}

export async function updateCliente(id, data) {
  const { cliente } = await apiRequest(`/clientes/${id}`, { method: 'PUT', body: data })
  return cliente
}

export async function deleteCliente(id) {
  await apiRequest(`/clientes/${id}`, { method: 'DELETE' })
}

export async function togglePagamento(id, ym) {
  const { cliente } = await apiRequest(`/clientes/${id}/pagamentos`, {
    method: 'PATCH',
    body: { ym },
  })
  return cliente
}
