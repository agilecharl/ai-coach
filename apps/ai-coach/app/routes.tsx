import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('./app.tsx'),
  // Add a catch-all route for unmatched URLs
  route('*', './routes/not-found.tsx'),
  route('/config', './components/system/configPage.tsx'),
  route('/config/chatbots', './components/system/chatbots.tsx'),
  route('/config/models', './components/system/models.tsx'),
] satisfies RouteConfig;
