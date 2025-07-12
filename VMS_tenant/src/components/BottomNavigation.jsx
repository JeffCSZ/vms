import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      icon: '🏠',
      label: 'Home',
    },
    {
      path: '/requests',
      icon: '📋',
      label: 'Requests',
    },
    {
      path: '/add-request',
      icon: '➕',
      label: 'Add',
    },
    {
      path: '/profile',
      icon: '👤',
      label: 'Profile',
    },
  ];

  return (
    <Nav className="bottom-nav justify-content-around">
      {navItems.map((item) => (
        <Nav.Item key={item.path}>
          <Nav.Link
            as={Link}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <div className="nav-icon">{item.icon}</div>
            <div>{item.label}</div>
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default BottomNavigation;
