import api from "../lib/axios"

export const settingService = {
  async updateSettings(payload: Record<string, any>) {
    const { data } = await api.patch("/settings/update-setting", payload)
    return data
  },
}