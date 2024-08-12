import { useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="navbar overflow-hidden p-10">
      <Button variant="primary" onClick={handleShow} className="mb-3 py-2 px-3">
        <i className="bi bi-list"></i>
      </Button>

      <Offcanvas show={show} onHide={handleClose} className="bg-dark text-white">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-2xl text-white font-mono border-r-2 border-white whitespace-nowrap m-0 tracking-wide overflow-hidden animate-typing animate-blink-caret">
            Auth INC
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="nav flex flex-col space-y-1">
            <li className="nav-item">
              <Link className="nav-link text-white hover:bg-gray-700 p-2 text-xl" to="/" onClick={handleClose}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white hover:bg-gray-700 p-2 text-xl" to="/superAdmin" onClick={handleClose}>SuperAdmin</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white hover:bg-gray-700 p-2 text-xl" to="/um" onClick={handleClose}>User Management</Link>
            </li>
            {/* <li>          <Link to="/albums" className="text-gray-300 hover:text-white">
                    Album
                  </Link></li> */}


            <li>
              <Link className="nav-link text-white hover:bg-gray-700 p-2 text-xl" to="/galleries" onClick={handleClose}>Gallery</Link>

            </li>
            <li className="nav-item relative group">
              <Link className="nav-link text-white hover:bg-gray-700 p-2 text-xl" to="/s" onClick={handleClose}>
                Site
              </Link>
              <div className="subnav-content hidden group-hover:flex flex-col bg-gray-800 text-white z-10 mt-1 w-full absolute left-0 top-full">
                <ul className="sub-navbar nav flex flex-col space-y-1">
                  <li className="nav-item">
                    <Link className="nav-link text-white hover:bg-gray-400 p-2" to="/s/u" onClick={handleClose}>User</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white hover:bg-gray-400 p-2" to="/s/grp" onClick={handleClose}>Group</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-white hover:bg-gray-400 p-2" to="/s/p" onClick={handleClose}>Profile</Link>
                  </li>


                </ul>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white hover:bg-gray-700 p-2 text-xl" to="/stng" onClick={handleClose}>Settings</Link>
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Navbar;
