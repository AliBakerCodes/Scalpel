const deleteAddress = async (event) => {
    event.preventDefault();
    console.log('click');
    if (event.target.hasAttribute('address-id')) {
      const id = event.target.getAttribute('address-id');
      const response = await fetch(`/api/profile/address/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        window.location.reload();
      } else {
        alert('Failed to delete address');
      }
    }
  };


  const newAddressHandler = async (event) => {
    event.preventDefault();
  
    const address = document.querySelector('#newAddress').value.trim();
    const city = document.querySelector('#selectedCity').value.trim();
    const state = document.querySelector('#selectedState').value.trim();
    const zip = document.querySelector('#newAddressZip').value.trim();
    const email = document.querySelector('#newAddressEmail').value.trim();
    const type = document.querySelector('#shippingAddress').value.trim();
    if(type === false){
        type = "BILL"
    }else{
        type = "SHIP"
    }
    
    if (address && state && city && zip && email && type) {
      const response = await fetch(`/api/address`, {
        method: 'POST',
        body: JSON.stringify({address, state, city, zip, email, type}),
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
  



  const deleteBtn = document.querySelector('.address-block');
deleteBtn.addEventListener('click', deleteAddress);

document
  .querySelector('.address-form')
  .addEventListener('submit', newAddressHandler);
