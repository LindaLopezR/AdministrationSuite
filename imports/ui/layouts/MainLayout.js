import React from 'react';
import { Container, Dropdown, Nav, Navbar, Row } from 'react-bootstrap';
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDashboard, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import { useAccount } from '/imports/startup/hooks';

export default MainLayout = props => {

  const { user } = useAccount();
  const navigate = useNavigate();

  const userName = user ? user.profile.name : '--';

  return (
    <div className="main-layout">
      <Navbar expand="lg" fixed="top">
        <Container fluid className="pe-5">
          <Navbar.Brand href="/">iGo&Suite</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link href="/" className="d-block d-md-none">
                <FontAwesomeIcon icon={faDashboard} />{' '}
                Dashboard
              </Nav.Link>
              <Dropdown>
                <Dropdown.Toggle
                  variant="link"
                  id="dropdown-user"
                  className="text-decoration-none"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2 icon-mainColor" />{' '}
                  {userName}
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight className="profile-notification">
                  {/* <Dropdown.Item href="/profile">
                    <FontAwesomeIcon icon={faUser} className="gray" />{' '}
                    Perfil
                  </Dropdown.Item> */}
                  <Dropdown.Item onClick={() => Meteor.logout()}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="icon-mainColor" />{' '}
                    Salir
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <SideNav
        onSelect={(selected) => {
          const to = `/${selected}`;
          navigate(to);
        }}
        className="d-none d-md-block"
      >
        <SideNav.Toggle />
        <SideNav.Nav defaultSelected="">
          <NavItem eventKey="">
            <NavIcon>
              <FontAwesomeIcon icon={faDashboard} />
            </NavIcon>
            <NavText>
              Dashboard
            </NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
      <Container className="container-general">
        <Outlet />
      </Container>
    </div>
  );
};
