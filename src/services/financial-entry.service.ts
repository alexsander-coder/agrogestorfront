import { api } from "./api"

export const financialEntryService = {
  createEntry: (payload: {
    accountId: string
    type: "INCOME" | "EXPENSE"
    value: number
    description: string
  }) => api.post("/financial-entry", payload)
}