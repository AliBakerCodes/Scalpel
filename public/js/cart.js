// const deleteCartItem = async (event) => {
//   event.preventDefault();
//   console.log('click');
//   if (event.target.hasAttribute('item-id')) {
//     const id = event.target.getAttribute('item-id');
//     const response = await fetch(`/api/cart/${id}`, {
//       method: 'DELETE',
//     });

//     if (response.ok) {
//       window.location.reload();
//     } else {
//       alert('Failed to delete cart item');
//     }
//   }
// };

// const deleteBtn = document.querySelector('.cart-item');

// deleteBtn.addEventListener('click', deleteCartItem);
