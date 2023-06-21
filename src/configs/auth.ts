export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/auth/login',
  registerEndpoint: '/auth/register',
  resetPwdEndpoint: '/auth/reset-password',
  sendSmsEndpoint: '/public/send-sms',
  sendEmailEndpoint: '/public/send-email',
  verifySmsEndpoint: '/auth/check-vcode',

  storedResetToken: 'resetToken',
  storedAccessToken: 'accessToken',
  storedRealAccessToken: 'realAccessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken,
}
