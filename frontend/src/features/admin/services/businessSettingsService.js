
const STORAGE_KEY = 'bennyshairfort_mock_business_settings'

const DEFAULT_SETTINGS = {
  businessName: "Benny'shairfort",
  whatsappNumber: '',
  phoneNumber: '',
  email: '',
  instagramUrl: '',
  tiktokUrl: '',
  address: '',
  openingHours: {
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  },
}

/**
 * Temporary frontend-only settings service.
 * Uses localStorage to simulate persistent backend storage.
 * Replace with API requests when the backend is implemented.
 */

export function getBusinessSettings() {
  try {
    const storedSettings = localStorage.getItem(STORAGE_KEY)

    if (!storedSettings) {
      return structuredClone(DEFAULT_SETTINGS)
    }

    return {
      ...structuredClone(DEFAULT_SETTINGS),
      ...JSON.parse(storedSettings),
    }
  } catch (error) {
    console.error('Could not load business settings:', error)
    return structuredClone(DEFAULT_SETTINGS)
  }
}

export function saveBusinessSettings(settings) {
  const updatedSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
    openingHours: {
      ...DEFAULT_SETTINGS.openingHours,
      ...settings.openingHours,
    },
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings))

  return updatedSettings
}

export function resetBusinessSettings() {
  localStorage.removeItem(STORAGE_KEY)
  return structuredClone(DEFAULT_SETTINGS)
}
