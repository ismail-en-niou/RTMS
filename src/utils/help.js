export const fetchOrders = async () => {
    const token = localStorage.getItem("authToken")
  try {
    const response = await fetch('https://team-api.robixe.online/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};