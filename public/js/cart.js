
const deleteButton= document.querySelectorAll('.delete-btn');
const addDays= document.querySelectorAll('.rental-days');
console.log(addDays)
const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-cart-id')) {
    const id = event.target.getAttribute('data-cart-id');
    console.log(id)
    const response = await fetch(`/cart/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/cart');
    } else {
      alert('Failed to cart item');
    }
  }
};

const addDaysHandler = async (event) => {
  console.log(event.target)
  if (event.target.hasAttribute('data-cart-id')) {
    const id = event.target.getAttribute('data-cart-id');
    console.log(id)
    const response = await fetch(`/cart/days/${id}`, {
      method: 'POST',
        body: JSON.stringify({
          rental_days: event.target.value
        }),
        headers: {
          'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
      document.location.replace('/cart');
    } else {
      alert('Failed to cart item');
    }
  }
};

const checkoutHandler = async (event) => {
  document.location.replace('/checkout');
};

document.querySelector('#checkout').addEventListener('click', checkoutHandler);
// console.log(deleteButton)
if(deleteButton){
  deleteButton.forEach(button => {
    button.addEventListener('click', delButtonHandler);
  })
};

if(addDays){
  addDays.forEach(input => {
    input.addEventListener('input', addDaysHandler);
  })
};

