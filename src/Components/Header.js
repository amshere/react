import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Header({ loggedUser }){
    return(
        <header className="App-header">
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Container>
          <Link to="/" className='navbar-brand'>PublishQuotes</Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Link to="/" className='nav-link'>Home</Link>
            </Nav>
            
              {loggedUser ? 
              <Nav>
                <Link to={`/user/${loggedUser}`} className='nav-link'>Profile</Link>
                <Link to={`/dashboard`} className='nav-link'>Post Quote</Link>
                <Link to={`/logout`} className='nav-link'>Logout</Link>
              </Nav>
               :
              <Nav>
                <Link to="/login" className='nav-link'>Login</Link>
                <Link to="/signup" className='nav-link'>
                  Signup
                </Link>
              </Nav>
              }
            
          </Navbar.Collapse>
          </Container>
        </Navbar>
        </header>
    )
}