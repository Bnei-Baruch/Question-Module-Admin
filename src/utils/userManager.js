export const oidcConfig = {
  client_id: 'galaxy_wvc',
  redirect_uri: `${window.location.origin}/callback`,
  response_type: 'code',
  scope: 'openid profile',
  authority: 'https://accounts.kab.info/auth/realms/main',
  automaticSilentRenew: true,
  loadUserInfo: true,
};
