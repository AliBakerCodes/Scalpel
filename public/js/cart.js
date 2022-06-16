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

const checkoutHandler = async (event) => {
  document.location.replace('/checkout');
}
document
  .querySelector('#checkout')
  .addEventListener('click', checkoutHandler);

const deleteButton= document.querySelectorAll('.delete-btn')
console.log(deleteButton)
if(deleteButton){
  deleteButton.forEach(button => {
    button.addEventListener('click', delButtonHandler);
  })
}