
import { getBusinessSettings } from '../../admin/services/businessSettingsService'
import { buildWhatsAppEnquiryMessage } from '../utilities/buildWhatsAppEnquiryMessage'

/**
 * Prepares a WhatsApp enquiry using the latest saved business settings.
 *
 * Does not open WhatsApp or send a message.
 */
export function prepareWhatsAppEnquiry({ product, variant = null } = {}) {
  const settings = getBusinessSettings()

  const whatsappNumber = String(settings.whatsappNumber ?? '')
    .replace(/\D/g, '')

  if (!whatsappNumber) {
    return {
      success: false,
      reason: 'missing_whatsapp_number',
      message: 'WhatsApp contact details have not been configured.',
    }
  }

  if (!/^\d{7,15}$/.test(whatsappNumber)) {
    return {
      success: false,
      reason: 'invalid_whatsapp_number',
      message: 'The configured WhatsApp number is invalid.',
    }
  }

  let enquiryMessage

  try {
    enquiryMessage = buildWhatsAppEnquiryMessage({
      product,
      variant,
      businessName: settings.businessName,
    })
  } catch (error) {
    return {
      success: false,
      reason: 'invalid_product',
      message: error.message,
    }
  }

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enquiryMessage)}`

  return {
    success: true,
    url,
    message: enquiryMessage,
  }
}
