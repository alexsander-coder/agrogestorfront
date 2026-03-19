export interface CashAccount {
  id: string
  name: string
  balance: number
  createdAt: string
}

export interface CreateCashAccountPayload {
  name: string
}