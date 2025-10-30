/**
 * Phone number utilities for parsing, validating, and initiating calls
 */

/**
 * Represents a phone number with its type
 */
export interface PhoneNumber {
  number: string;
  type: "mobile" | "whatsapp" | "other";
  label: string;
}

/**
 * Parse phone numbers from customer data
 * Handles single numbers, comma-separated numbers, and multiple fields
 * 
 * @param mobileno - Mobile number field (can be single or comma-separated)
 * @param whatsappno - WhatsApp number field (can be single or comma-separated)
 * @returns Array of parsed phone numbers with types
 */
export const parsePhoneNumbers = (
  mobileno?: string | null,
  whatsappno?: string | null
): PhoneNumber[] => {
  const phoneNumbers: PhoneNumber[] = [];

  // Parse mobile numbers
  if (mobileno && mobileno.trim() && mobileno !== "0" && mobileno !== "N/A") {
    const mobileNumbers = mobileno
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num && num !== "0" && num !== "N/A");

    mobileNumbers.forEach((num, index) => {
      if (isValidPhoneNumber(num)) {
        phoneNumbers.push({
          number: num,
          type: "mobile",
          label: mobileNumbers.length > 1 ? `Mobile ${index + 1}` : "Mobile",
        });
      }
    });
  }

  // Parse WhatsApp numbers
  if (whatsappno && whatsappno.trim() && whatsappno !== "0" && whatsappno !== "N/A") {
    const whatsappNumbers = whatsappno
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num && num !== "0" && num !== "N/A");

    whatsappNumbers.forEach((num, index) => {
      if (isValidPhoneNumber(num)) {
        phoneNumbers.push({
          number: num,
          type: "whatsapp",
          label: whatsappNumbers.length > 1 ? `WhatsApp ${index + 1}` : "WhatsApp",
        });
      }
    });
  }

  return phoneNumbers;
};

/**
 * Validate if a string is a valid phone number
 * Accepts numbers with or without country code, spaces, dashes, etc.
 * 
 * @param phoneNumber - Phone number to validate
 * @returns true if valid, false otherwise
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return false;
  }

  // Remove common formatting characters
  const cleaned = phoneNumber.replace(/[\s\-\(\)\.]/g, "");

  // Check if it contains only digits and optional + at the start
  const isNumeric = /^\+?\d{7,15}$/.test(cleaned);

  return isNumeric;
};

/**
 * Format phone number for display
 * 
 * @param phoneNumber - Phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return "";

  // Remove all non-digit characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, "");

  // If it's a 10-digit Indian number, format as +91-XXXXX-XXXXX
  if (cleaned.length === 10 && !cleaned.startsWith("+")) {
    return `+91-${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }

  // If it already has country code, format accordingly
  if (cleaned.startsWith("+91") && cleaned.length === 13) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 8)}-${cleaned.slice(8)}`;
  }

  // Return as-is if already formatted or different format
  return cleaned;
};

/**
 * Initiate a phone call using the tel: protocol
 * 
 * @param phoneNumber - Phone number to call
 * @returns true if call was initiated, false otherwise
 */
export const initiateCall = (phoneNumber: string): boolean => {
  if (!isValidPhoneNumber(phoneNumber)) {
    console.error("Invalid phone number:", phoneNumber);
    return false;
  }

  try {
    // Remove all non-digit characters except +
    const cleanedNumber = phoneNumber.replace(/[^\d+]/g, "");

    // Create tel: link and trigger it
    const telLink = `tel:${cleanedNumber}`;
    window.location.href = telLink;

    return true;
  } catch (error) {
    console.error("Error initiating call:", error);
    return false;
  }
};

/**
 * Get the best phone number to call (prioritize mobile over WhatsApp)
 * 
 * @param phoneNumbers - Array of phone numbers
 * @returns The best phone number to call, or null if none available
 */
export const getBestPhoneNumber = (phoneNumbers: PhoneNumber[]): PhoneNumber | null => {
  if (phoneNumbers.length === 0) return null;
  if (phoneNumbers.length === 1) return phoneNumbers[0];

  // Prioritize mobile numbers
  const mobileNumber = phoneNumbers.find((p) => p.type === "mobile");
  if (mobileNumber) return mobileNumber;

  // Fall back to first available
  return phoneNumbers[0];
};

/**
 * Get display text for a phone number
 *
 * @param phoneNumber - Phone number object
 * @returns Display text with type and number
 */
export const getPhoneNumberDisplay = (phoneNumber: PhoneNumber): string => {
  const formatted = formatPhoneNumber(phoneNumber.number);
  return `${phoneNumber.label}: ${formatted}`;
};

/**
 * Get the best WhatsApp number (prioritize whatsappno over mobileno)
 *
 * @param whatsappno - WhatsApp number field
 * @param mobileno - Mobile number field (fallback)
 * @returns The best WhatsApp number, or null if none available
 */
export const getWhatsAppNumber = (
  whatsappno?: string | null,
  mobileno?: string | null
): string | null => {
  // Try WhatsApp number first
  if (whatsappno && whatsappno.trim() && whatsappno !== "0" && whatsappno !== "N/A") {
    const numbers = whatsappno
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num && num !== "0" && num !== "N/A" && isValidPhoneNumber(num));

    if (numbers.length > 0) {
      return numbers[0]; // Return first valid number
    }
  }

  // Fall back to mobile number
  if (mobileno && mobileno.trim() && mobileno !== "0" && mobileno !== "N/A") {
    const numbers = mobileno
      .split(",")
      .map((num) => num.trim())
      .filter((num) => num && num !== "0" && num !== "N/A" && isValidPhoneNumber(num));

    if (numbers.length > 0) {
      return numbers[0]; // Return first valid number
    }
  }

  return null;
};

/**
 * Clean phone number for WhatsApp (remove all non-digit characters except +)
 *
 * @param phoneNumber - Phone number to clean
 * @returns Cleaned phone number suitable for WhatsApp URL
 */
export const cleanPhoneNumberForWhatsApp = (phoneNumber: string): string => {
  if (!phoneNumber) return "";

  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, "");

  // If it's a 10-digit number without country code, add +91 (India)
  if (cleaned.length === 10 && !cleaned.startsWith("+")) {
    cleaned = `91${cleaned}`;
  }

  // Remove + if present (WhatsApp API doesn't need it in the URL)
  cleaned = cleaned.replace(/\+/g, "");

  return cleaned;
};

/**
 * Open WhatsApp chat with a phone number
 *
 * @param phoneNumber - Phone number to chat with
 * @returns true if WhatsApp was opened, false otherwise
 */
export const openWhatsAppChat = (phoneNumber: string): boolean => {
  if (!isValidPhoneNumber(phoneNumber)) {
    console.error("Invalid phone number for WhatsApp:", phoneNumber);
    return false;
  }

  try {
    const cleanedNumber = cleanPhoneNumberForWhatsApp(phoneNumber);
    const whatsappUrl = `https://wa.me/${cleanedNumber}`;
    window.open(whatsappUrl, "_blank");
    return true;
  } catch (error) {
    console.error("Error opening WhatsApp:", error);
    return false;
  }
};

