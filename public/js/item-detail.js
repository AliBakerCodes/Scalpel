
const rentHandler = async (event) => {
    event.preventDefault();
      
    const item_id = $('#rentBtn').attr('data-attr')
    console.log(item_id)
    
    if (item_id) {
      const qty=1;
      const is_rental=true;
      const response = await fetch(`/cart`, {
        method: 'POST',
        body: JSON.stringify({item_id, qty, is_rental}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.replace('/cart');
      }
    }
  };

  const buyHandler = async (event) => {
    event.preventDefault();
    const item_id = $('#buyBtn').attr('data-attr')
   
    if (item_id) {
      const qty=1;
      const is_rental=false;
      const response = await fetch(`/cart`, {
        method: 'POST',
        body: JSON.stringify({item_id, qty, is_rental}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.replace('/cart');
      }
    }
  };

document
.querySelector('#rentBtn')
.addEventListener('click', rentHandler);

document
.querySelector('#buyBtn')
.addEventListener('click', buyHandler);