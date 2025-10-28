/**
 * API Retry Utility
 * Handles network failures and retries with exponential backoff
 */

export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 API Retry attempt ${attempt}/${maxRetries}`);
      const result = await apiCall();
      console.log(`✅ API call successful on attempt ${attempt}`);
      return result;
    } catch (error) {
      lastError = error;
      console.log(`❌ API call failed on attempt ${attempt}:`, error.message);
      
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  console.log(`💥 All ${maxRetries} attempts failed`);
  throw lastError;
};

export const safeApiCall = async (apiCall, fallback = null) => {
  try {
    return await apiCall();
  } catch (error) {
    console.log('⚠️ API call failed, using fallback:', error.message);
    return fallback;
  }
};

export const isNetworkError = (error) => {
  return error && (
    error.message?.includes('Network request failed') ||
    error.message?.includes('fetch') ||
    error.message?.includes('timeout') ||
    error.message?.includes('connection')
  );
};
