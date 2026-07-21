export type AlertVariant = 'info' | 'success' | 'error'

export interface AlertMessage {
  type: AlertVariant
  text: string
}
