import CryptoJS from 'crypto-js'

/**
 * Decrypt AES encrypted data
 * @param encryptedData - The encrypted data string
 * @param key - The decryption key
 * @returns Decrypted object or null if decryption fails
 */
export const aesDecrypt = (encryptedMessage: string, key: string): any => {
  try {
    // Decode the Base64 encoded message
    const encryptedData = CryptoJS.enc.Base64.parse(encryptedMessage)

    // Extract the IV (first 16 bytes)
    const iv = CryptoJS.lib.WordArray.create(encryptedData.words.slice(0, 4))

    // Extract the ciphertext
    const ciphertext = CryptoJS.lib.WordArray.create(
      encryptedData.words.slice(4)
    )

    // Decrypt using AES-256-CBC
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext },
      CryptoJS.enc.Utf8.parse(key),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    )

    // Convert the decrypted WordArray to a UTF-8 string
    return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted))
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
