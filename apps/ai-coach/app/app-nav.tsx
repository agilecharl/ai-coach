import { NavLink } from 'react-router';

export function AppNav() {
  return (
    <nav>
      <NavLink to="/" end>
        Home
      </NavLink>{' '}
      <NavLink to="/config">Config</NavLink>
    </nav>
  );
}
