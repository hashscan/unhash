/** @type {import('next').NextConfig} */
module.exports = {
  i18n: {
    // Setting locales explicitly ensures that the proper "lang" attribute is set on the <html />
    locales: ['en-US'],

    // Read more about I18n routing:
    // https://nextjs.org/docs/advanced-features/i18n-routing
    defaultLocale: 'en-US'
  }
}
