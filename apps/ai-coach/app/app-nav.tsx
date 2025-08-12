import { NavLink } from 'react-router';

export function AppNav() {
  return (
    <nav
      style={{
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: '0.5rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <ul
        style={{
          display: 'flex',
          gap: '2rem',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          alignItems: 'center',
        }}
      >
        <li>
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : '500',
              color: isActive ? '#2563eb' : '#222',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent',
              transition: 'background 0.2s, color 0.2s',
              fontSize: '1.05rem',
            })}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/config"
            style={({ isActive }) => ({
              fontWeight: isActive ? 'bold' : '500',
              color: isActive ? '#2563eb' : '#222',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              background: isActive ? 'rgba(37,99,235,0.08)' : 'transparent',
              transition: 'background 0.2s, color 0.2s',
              fontSize: '1.05rem',
            })}
          >
            Config
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
