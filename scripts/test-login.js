(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@hospital.gov', password: '12345678' }),
    });

    console.log('Status:', res.status);
    console.log('Content-Type:', res.headers.get('content-type'));
    const text = await res.text();
    console.log('Body:\n', text);
  } catch (err) {
    console.error('Request failed:', err);
    process.exit(1);
  }
})();
