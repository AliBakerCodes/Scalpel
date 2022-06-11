const loginFormHandler = async (event) => {
  event.preventDefault();

  // Collect values from the login form
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    // Send a POST request to the API endpoint
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.replace('/profile');
    } else {
      alert(response.statusText);
    }
  }
};

const signupFormHandler = async (event) => {
  event.preventDefault();

  const first_name = document.querySelector('#firstname-signup').value.trim();
  const last_name = document.querySelector('#lastname-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  const address1 = document.querySelector('#address1-signup').value.trim();
  const address2 = document.querySelector('#address2-signup').value.trim();
  const city = document.querySelector('#city-signup').value.trim();
  const state = document.querySelector('#state-signup').value.trim();
  const zip = document.querySelector('#zip-signup').value.trim();
  const birthdate = document.querySelector('#birthdate-signup').value.trim();
  const phone = document.querySelector('#phonenumber-signup').value.trim();

  if (
    first_name &&
    last_name &&
    email &&
    password &&
    address1 &&
    city &&
    state &&
    zip &&
    birthdate &&
    phone
  ) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        phone,
        birthdate,
        address1,
        address2,
        city,
        state,
        zip,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert(response.statusText);
    }
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);
