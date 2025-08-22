// No import needed, we will use the native fetch API provided by the Netlify environment.

exports.handler = async function(event, context) {
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
    
    // Add a tag to easily identify these submissions in Shopify
    formData.append('contact[tags]', 'custom-quote');
    
    // Match the field names from the live Shopify theme (e.g., contact[Name], contact[Email])
    formData.append('contact[Email]', data.email);
    formData.append('contact[Name]', data.name);
    formData.append('contact[Phone Number]', data.phone || '');
    
    // Combine remaining details into the main message body/comment field
    const commentBody = `
Project Description:
${data.description}

Company: ${data.company || 'N/A'}
${data.fileName ? `File Reference: ${data.fileName}` : 'No file provided.'}
    `;
    formData.append('contact[Comment]', commentBody);
    
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