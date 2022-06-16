const deleteAddress = async (event) => {
  event.preventDefault();
  console.log('click');
  if (event.target.hasAttribute('address-id')) {
    const id = event.target.getAttribute('address-id');
    const response = await fetch(`/profile/addresses/${id}`, {
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

  const addr1 = document.querySelector('#newAddress').value.trim();
  const city = document.querySelector('#selectedCity').value.trim();
  const state = document.querySelector('#selectedState').value.trim();
  const zip = document.querySelector('#newAddressZip').value.trim();
  const type = document.querySelector('#shippingAddress').value.trim();
 
  console.log(type);
  if (addr1 && state && city && zip && type) {
    const response = await fetch(`/profile/addresses`, {
      method: 'POST',
      body: JSON.stringify({ addr1, state, city, zip, type }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      document.location.replace('/profile/addresses');
    } else {
      alert('Failed to create address');
    }
  }
};

// const deleteBtn = document.querySelector('.address-block');
// deleteBtn.addEventListener('click', deleteAddress);

document
  .querySelector('.address-form')
  .addEventListener('submit', newAddressHandler);
const deleteBtn = document.querySelector('.address-block');

if (deleteAddress) {
  document
    .querySelector('.address-block')
    .addEventListener('click', deleteAddress);
}
