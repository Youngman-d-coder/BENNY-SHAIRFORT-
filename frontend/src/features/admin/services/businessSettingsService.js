const STORAGE_KEY = "bennyshairfort_mock_business_settings";

const DEFAULT_SETTINGS = {
  businessName: "Benny'shairfort",
  whatsappNumber: "",
  phoneNumber: "",
  email: "",
  instagramUrl: "",
  tiktokUrl: "",
  address: "",
  openingHours: {
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  },

  // Editable brand presentation
  aboutHeadline: "Beauty is an expression.",
  aboutHeadlineAccent: "Make yours unforgettable.",
  aboutIntroduction:
    "At Benny'shairfort, we believe that the right hairstyle does more than complete your appearance. It expresses your individuality, elevates your confidence and lets you show up as your most authentic self.",
  aboutStory: "",
  aboutMission: "",

  brandValues: [
    {
      id: "value-1",
      title: "Exceptional Elegance",
      description: "Discover styles that bring sophistication to every look.",
    },
    {
      id: "value-2",
      title: "Personal Expression",
      description: "Your hair should reflect your personality and confidence.",
    },
    {
      id: "value-3",
      title: "Beauty Without Limits",
      description:
        "Explore possibilities and find a style that feels like you.",
    },
  ],
};

/**
 * Temporary frontend-only settings service.
 * Uses localStorage to simulate persistent backend storage.
 * Replace with API requests when the backend is implemented.
 */

export function getBusinessSettings() {
  try {
    const storedSettings = localStorage.getItem(STORAGE_KEY);

    if (!storedSettings) {
      return structuredClone(DEFAULT_SETTINGS);
    }

    return {
      ...structuredClone(DEFAULT_SETTINGS),
      ...JSON.parse(storedSettings),
    };
  } catch (error) {
    console.error("Could not load business settings:", error);
    return structuredClone(DEFAULT_SETTINGS);
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
    brandValues: Array.isArray(settings.brandValues)
      ? settings.brandValues
      : structuredClone(DEFAULT_SETTINGS.brandValues),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));

  return updatedSettings;
}

export function resetBusinessSettings() {
  localStorage.removeItem(STORAGE_KEY);
  return structuredClone(DEFAULT_SETTINGS);
}
