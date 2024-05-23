Culqi.publicKey = 'pk_test_27f4fbc0ddc64976';

document.getElementById('buyButton').addEventListener('click', (e) => {
  Culqi.settings({
    title: 'Tu tienda',
    currency: 'PEN',
    description: 'Producto de prueba',
    amount: 5000,
  });
  Culqi.open();
  e.preventDefault();
});

function culqi() {
  if (Culqi.token) {
    const token = Culqi.token.id;
    fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        installments: 0
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.object === 'charge') {
        alert('Pago realizado con éxito');
      } else {
        alert('Error en el pago: ' + data.user_message);
      }
    })
    .catch(error => console.error('Error:', error));
  } else {
    console.log(Culqi.error);
  }
}
