/**
 * Date formatting utilities for the application
 */

/**
 * Convert date from YYYY-MM-DD format to DD-MM-YYYY format
 * @param dateStr - Date string in YYYY-MM-DD format
 * @returns Date string in DD-MM-YYYY format
 */
export const convertToApiDateFormat = (dateStr: string): string => {
  if (!dateStr) return "";
  
  // If already in DD-MM-YYYY format, return as is
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Convert from YYYY-MM-DD to DD-MM-YYYY
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  }
  
  return dateStr;
};

/**
 * Convert date from DD-MM-YYYY format to YYYY-MM-DD format
 * @param dateStr - Date string in DD-MM-YYYY format
 * @returns Date string in YYYY-MM-DD format
 */
export const convertFromApiDateFormat = (dateStr: string): string => {
  if (!dateStr) return "";
  
  // If already in YYYY-MM-DD format, return as is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Convert from DD-MM-YYYY to YYYY-MM-DD
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
  }
  
  return dateStr;
};

/**
 * Format date for display (DD-MM-YYYY)
 * @param dateStr - Date string in any format
 * @returns Formatted date string in DD-MM-YYYY format
 */
export const formatDateForDisplay = (dateStr: string): string => {
  if (!dateStr) return "";
  
  try {
    // Try to parse the date
    let date: Date;
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      // YYYY-MM-DD format
      date = new Date(dateStr);
    } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      // DD-MM-YYYY format
      const [day, month, year] = dateStr.split("-");
      date = new Date(`${year}-${month}-${day}`);
    } else {
      date = new Date(dateStr);
    }
    
    if (isNaN(date.getTime())) return dateStr;
    
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch {
    return dateStr;
  }
};

/**
 * Get default date range (last 30 days) in YYYY-MM-DD format
 * @returns Object with from and to dates in YYYY-MM-DD format
 */
export const getDefaultDateRange = (): { from: string; to: string } => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    from: formatDate(thirtyDaysAgo),
    to: formatDate(today),
  };
};

