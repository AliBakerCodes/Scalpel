const newPaymentHandler = async (event) => {
  event.preventDefault();
    console.log('payment click')
  const card_num = document.querySelector('#newCardNumber').value.trim();
  const exp_date = document.querySelector('#newCardExpiry').value.trim();
  const  cvc = document.querySelector('#newCardCVC').value.trim();
    const type='mastercard'
    const last4=card_num.slice(12)
  if (card_num && exp_date &&  cvc) {
    const response = await fetch(`/profile/payments`, {
      method: 'POST',
      body: JSON.stringify({ card_num, exp_date, cvc, type, last4 }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      document.location.replace('/profile/payments');
    } else {
      alert('Failed to create payment');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-payment-id')) {
    const id = event.target.getAttribute('data-payment-id');

    const response = await fetch(`/profile/payments/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile/payments');
    } else {
      alert('Failed to delete payment');
    }
  }
};

document
  .querySelector('#addPaymentMethod')
  .addEventListener('click', newPaymentHandler);

const deleteButton= document.querySelector('.deleteCard')
if(deleteButton){
document
  .querySelector('.deleteCard')
  .addEventListener('click', delButtonHandler);
}
