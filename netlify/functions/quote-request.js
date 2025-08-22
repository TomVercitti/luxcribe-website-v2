
import fetch from 'node-fetch';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  // Use the environment variable for the Shopify store domain
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN || 'dbrd1n-q5.myshopify.com';
  
  if (!shopifyDomain || shopifyDomain.includes('YOUR_STORE_NAME')) {
      console.error('SHOPIFY_STORE_DOMAIN environment variable is not set or is a placeholder.');
      return {
          statusCode: 500,
          body: JSON.stringify({ message: 'Server configuration error. The store domain is not set.' }),
      };
  }

  try {
    const data = JSON.parse(event.body);

    const formData = new URLSearchParams();
    formData.append('form_type', 'contact');
    formData.append('utf8', '✓');
    formData.append('contact[tags]', 'custom-quote');
    formData.append('contact[email]', data.email);
    formData.append('contact[name]', data.name); // CORRECTED from contact[first_name]
    formData.append('contact[phone]', data.phone || '');
    formData.append('contact[company]', data.company || '');
    formData.append('contact[body]', `
Project Description:
${data.description}

${data.fileName ? `File Reference: ${data.fileName}` : 'No file provided.'}
    `);
    
    const shopifyContactUrl = `https://${shopifyDomain}/contact`;

    const response = await fetch(shopifyContactUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Some Shopify themes/apps might check for a user-agent
        'User-Agent': 'Luxcribe-Quote-Function/1.0'
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Shopify submission failed with status ${response.status}: ${errorBody}`);
      // Don't expose detailed errorBody to the client for security
      throw new Error(`Failed to submit to Shopify (status: ${response.status})`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Quote request submitted successfully!' }),
    };
  } catch (err) {
    console.error('Error in Netlify function:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'There was an error submitting your request. Please try again.' }),
    };
  }
}
