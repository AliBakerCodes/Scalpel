const newFormHandler = async (event) => {
  event.preventDefault();

  const card_num = document.querySelector('#newCardNumber').value.trim();
  const exp_date = document.querySelector('newCardExpiry').value.trim();
  const cvc = document.querySelector('#newCardCVC').value.trim();

  if (card_num && exp_date && C_V_C) {
    const response = await fetch(`/api/projects`, {
      method: 'POST',
      body: JSON.stringify({ card_num, exp_date, C_V_C }),
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

    const response = await fetch(`/api/payment/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete payment');
    }
  }
};

document
  .querySelector('#addPaymentMethod')
  .addEventListener('submit', newPaymentHandler);

document
  .querySelectorAll('.deleteCard')
  .addEventListener('click', delButtonHandler);
