import { NavLink } from 'react-router';

export function AppNav() {
  return (
    <nav>
      <ul
        style={{
          display: 'flex',
          gap: '1rem',
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
      >
        <li>
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
            })}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/config"
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : 'normal',
            })}
          >
            Config
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
