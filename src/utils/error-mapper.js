const loginErrors = (error) => {
  switch (error) {
    case 'invalid_user':
    case 'invalid_password':
      return 'Invalid Credentials';
  }
};

export { loginErrors };
