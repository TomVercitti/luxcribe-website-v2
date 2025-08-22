const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
const shopifyToken = process.env.SHOPIFY_ADMIN_API_TOKEN;

const data = JSON.parse(event.body);

// Create a customer
const customerBody = {
  customer: {
    first_name: data.name.split(" ")[0] || "N/A",
    last_name: data.name.split(" ")[1] || "N/A",
    email: data.email,
    phone: data.phone || "",
    tags: "custom-quote",
    note: `
Project Description:
${data.description}

${data.fileName ? `File Reference: ${data.fileName}` : 'No file provided.'}
    `
  }
};

const response = await fetch(`https://${shopifyDomain}/admin/api/2025-07/customers.json`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": shopifyToken
  },
  body: JSON.stringify(customerBody)
});

if (!response.ok) {
  const errorBody = await response.text();
  console.error(`Shopify submission failed (status ${response.status}): ${errorBody}`);
  throw new Error(`Failed to submit to Shopify (status: ${response.status})`);
}

return {
  statusCode: 200,
  body: JSON.stringify({ message: "Quote request submitted successfully!" })
};
