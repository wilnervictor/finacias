import { useState } from 'react'
import Modal from '../Modal'
import { COBRANCA_PERIODS } from '../../services/clientesService'

export default function ClienteModal({ initial, onClose, onSave }) {
  const [nome, setNome] = useState(initial?.nome || '')
  const [valor, setValor] = useState(initial?.valor ?? '')
  const [cobranca, setCobranca] = useState(initial?.cobranca || COBRANCA_PERIODS[0])
  const [observacoes, setObservacoes] = useState(initial?.observacoes || '')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim()) {
      setError('Informe o nome do cliente.')
      return
    }
    const value = Number(valor)
    if (!value || value <= 0) {
      setError('Informe um valor mensal válido.')
      return
    }
    onSave({
      nome: nome.trim(),
      valor: value,
      cobranca,
      observacoes: observacoes.trim(),
    })
  }

  return (
    <Modal title={initial ? 'Editar cliente' : 'Novo cliente'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Nome
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do cliente"
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Mensalidade (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 tabular-nums"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
              Cobrança
            </label>
            <select
              value={cobranca}
              onChange={(e) => setCobranca(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {COBRANCA_PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Observações
          </label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={3}
            placeholder="Opcional"
            className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 transition-colors"
        >
          {initial ? 'Salvar alterações' : 'Adicionar cliente'}
        </button>
      </form>
    </Modal>
  )
}
