const deleteCheckoutItem = async (event) => {
    event.preventDefault();
    console.log('click');
    if (event.target.hasAttribute('checkout-id')) {
      const id = event.target.getAttribute('checkout-id');
      const response = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete cart item');
      }
    }
  };

  const checkoutHandler = async (event) => {
    event.preventDefault();
  
    const cardRadio = document.querySelector('.payment-radio');
    const shipRadio= document.querySelector('.ship-address-radio');
    const billRadio= document.querySelector('.bill-address-radio');

    if(!cardRadio.checked){
      window.alert('Please select a payment method')
      return;
    }

    if(!shipRadio.checked){
      window.alert('Please select a shipping address for this order')
            return;
    };

    if(!billRadio.checked){
      window.alert('Please select a billing address for this card')
      return;
    };

    const ship_to_addr_id = shipRadio.getAttribute('data-ship-id');
    let bill_to_addr_id = billRadio.getAttribute('data-bill-id');
    const payment_id = cardRadio.getAttribute('data-payment-id');
    if (bill_to_addr_id==0){
      bill_to_addr_id=ship_to_addr_id;
    };

      const response = await fetch(`/api/checkout`, {
        method: 'POST',
        body: JSON.stringify({
          ship_to_addr_id: ship_to_addr_id,
          bill_to_addr_id: bill_to_addr_id,
          payment_id: payment_id,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
   };

   document.querySelector('.checkout-form').addEventListener('submit', checkoutHandler);

const deleteBtn = document.querySelector('.checkout-item');
if(deleteBtn){
deleteBtn.addEventListener('click', deleteCheckoutItem);
};