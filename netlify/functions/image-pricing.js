/**
 * Netlify serverless function to calculate engraving price for an image.
 *
 * This function receives image data (base64 PNG string or an SVG string)
 * and returns a calculated price based on its complexity and size.
 */
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { imageData } = JSON.parse(event.body);

    if (!imageData || typeof imageData !== 'string' || imageData.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'imageData is required and must be a non-empty string.' }),
      };
    }

    // ===================================================================================
    // Dynamic Image Engraving Pricing Model
    // ===================================================================================
    // Calculates a price based on the following logic:
    // 1. A base fee is applied to every image.
    // 2. A dynamic fee is added based on the image data size, which serves as a
    //    proxy for complexity.
    //
    // Formula: totalPrice = baseFee + ((dataSizeInKB / 10) * feePer10KB)
    // ===================================================================================

    const BASE_FEE = 10.00; // A flat fee for any image engraving.
    const FEE_PER_10KB = 2.00; // The fee for each 10 kilobyte block of data.

    const dataSizeInBytes = imageData.length;
    const dataSizeInKB = dataSizeInBytes / 1024;
    
    const dynamicFee = (dataSizeInKB / 10) * FEE_PER_10KB;
    
    const totalPrice = BASE_FEE + dynamicFee;
    
    // Round to two decimal places to represent currency.
    const finalPrice = Math.round(totalPrice * 100) / 100;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ price: finalPrice }),
    };

  } catch (error) {
    console.error('Error in image-pricing function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred.' }),
    };
  }
};
