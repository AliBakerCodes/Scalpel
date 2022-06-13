const deleteCheckoutItem = async (event) => {
    event.preventDefault();
    console.log('click');
    if (event.target.hasAttribute('checkout-id')) {
      const id = event.target.getAttribute('checkout-id');
      const response = await fetch(`/api/checkout/${id}`, {
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
  
    const card = document.querySelector('#savedCard').value.trim();
    const address = document.querySelector('#inputAddress').value.trim();
    const city = document.querySelector('#inputCity').value.trim();
    const state = document.querySelector('#inputState').value.trim();
    const zip = document.querySelector('#inputZip').value.trim();
    if(!address, !city, !state, !zip){
         address = document.querySelector('#address').value.trim();
         city = document.querySelector('#city').value.trim();
         state = document.querySelector('#state').value.trim();
         zip = document.querySelector('#zip').value.trim();
    }
    const ship_to_addr_id = address + " " + city + "" + state + "" + zip
    
    if (address && state && city && zip) {
      const response = await fetch(`/api/orderheader`, {
        method: 'POST',
        body: JSON.stringify({ship_to_addr_id}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.replace('/api/profile/address');
        
      } else {
        alert('Failed to create project');
      }
    }
  };
  
















  document
  .querySelector('.checkout-form')
  .addEventListener('submit', checkoutHandler);


  const deleteBtn = document.querySelector('.checkout-item');
deleteBtn.addEventListener('click', deleteCheckoutItem);