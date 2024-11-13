describe('Reservations', () => {
  beforeAll(async () => {
    const user = {
      email: 'test@gmail.com',
      password: 'Password123@',
    };
    await fetch('http://auth:3001/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const auth_res = await fetch('http://auth:3001/auth/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const jwt = await auth_res.text();
    console.log(jwt);
  });

  test('Create', () => {
    expect(true).toBeTruthy();
  });
});
