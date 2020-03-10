// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  authenticate: false,
  production: false,
  awlWebApiUrl: 'http://localhost/WaitingList/api',
  liveAddressUrl: 'https://us-street.api.smartystreets.com/street-address',
  liveAddressAuthId: '4062685541923528'
}
