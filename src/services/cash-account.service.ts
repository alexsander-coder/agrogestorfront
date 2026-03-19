import { api } from "./api"

export const cashAccountService = {
  getAccounts: () => api.get("/cash-accounts"),

  createAccount: (payload: {
    name: string
  }) => api.post("/cash-accounts", payload)
}