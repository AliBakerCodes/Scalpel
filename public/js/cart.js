const deleteCartItem = async (event) => {
  event.preventDefault();
  
    const id = $('.delete-btn').attr('item-id');
    console.log(id)
    const response = await fetch(`/cart/${id}`, {
      method: 'DELETE',
      body:JSON.stringify({id}),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {

      window.location.reload();
    } else {
      alert('Failed to delete cart item');
    }
  
};

document
.querySelector('.cart-item')
.addEventListener('submit', deleteCartItem)
