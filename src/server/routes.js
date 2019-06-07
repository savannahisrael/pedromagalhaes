const routes = require('next-routes')

module.exports = routes()
  .add('/', '/')
  .add('/login', '/public/authentication/login')
  .add('/register', '/public/authentication/register')
  .add('/about', '/public/about')
  .add('/projects', '/public/projects')
  .add('/services', '/public/services')
  .add('/blog', '/public/blog')
  .add('/contact', '/public/contact')
  .add('/privacy', '/public/legal/privacy')
  .add('/terms', '/public/legal/terms')
  .add('/templates/colors', '/public/templates/colors')
  .add('/activate', '/public/authentication/activate')
  .add('/changepassword', '/public/authentication/changepassword')
  .add('/forgotpassword', '/public/authentication/forgotpassword')
  .add('/search', '/public/search')
  .add('/dashboard', '/dashboard')
  .add('/dashboard/profile', '/dashboard/profile')
