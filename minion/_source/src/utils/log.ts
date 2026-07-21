export function log(message?: any, ...optionalParams: any[]) {
  if (import.meta.env.MODE !== 'production') {
    // eslint-disable-next-line no-console
    console.log(message, ...optionalParams)
  }
}
