import CryptoJS from 'crypto-js'

/**
 * Decrypt AES encrypted data
 * @param encryptedData - The encrypted data string
 * @param key - The decryption key
 * @returns Decrypted object or null if decryption fails
 */
export const aesDecrypt = (encryptedData: string, key: string): any => {
  try {
    if (!encryptedData || !key) {
      return null
    }

    const bytes = CryptoJS.AES.decrypt(encryptedData, key)
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8)

    return JSON.parse(decryptedData)
  } catch (error) {
    console.error('AES decryption failed:', error)
    return null
  }
}

/**
 * Parse JSON string safely
 * @param jsonString - The JSON string to parse
 * @returns Parsed object or null if parsing fails
 */
export const parseJson = (jsonString: string): any => {
  try {
    if (!jsonString || typeof jsonString !== 'string') {
      return null
    }
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('JSON parsing failed:', error)
    return null
  }
}
