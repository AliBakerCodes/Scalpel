const delButtonHandler = async (event) => {
    event.preventDefault();
    console.log('click');
    if (event.target.hasAttribute('checkout-id')) {
      const id = event.target.getAttribute('checkout-id');
      const response = await fetch(`/cart/${id}`, {
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
  
    const cardRadio = document.querySelectorAll('input[name="payment-radio"]');
    const shipRadio= document.querySelectorAll('input[name="ship-address-radio"]');
    const billRadio= document.querySelectorAll('input[name="bill-address-radio"]');
   
    let ship_to_addr_id;
    let bill_to_addr_id;
    let payment_id;

    for(const radio of shipRadio) {
      if(radio.checked){
        ship_to_addr_id = radio.value;
      }
    };

    for(const radio of billRadio) {
      if(radio.checked){
        bill_to_addr_id = radio.value;
      }
    };
    
    if (bill_to_addr_id==0){
      bill_to_addr_id=ship_to_addr_id;
    };

    
    for(const radio of cardRadio) {
      if(radio.checked){
        payment_id = radio.value;
      }
    };
    console.log(payment_id, ship_to_addr_id,bill_to_addr_id)
    if(!payment_id){
      window.alert('Please select a payment method')
      return;
    }

    if(!ship_to_addr_id){
      window.alert('Please select a shipping address for this order')
            return;
    };

    if(!bill_to_addr_id){
      window.alert('Please select a billing address for this card')
      return;
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

   const deleteButton= document.querySelectorAll('.delete-btn')
   console.log(deleteButton)
   if(deleteButton){
     deleteButton.forEach(button => {
       button.addEventListener('click', delButtonHandler);
     })
   }