import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { IconContext } from "react-icons";
import { CgProfile } from 'react-icons/cg';


import './style/css/bootstrap.css';
import './App.css';

import { Button, Navbar, Container, Nav, Form, Alert, Offcanvas } from "react-bootstrap";
import { getCurrentUser, login, logout } from "./services/auth.service";
import Axios from 'axios';

import StudentPage from "./StudentPage";
import CoursePage from "./CoursePage";
import AccountPage from "./AccountPage";
import GradePage from "./GradePage";


function App() {

  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");

  const [assignedCourses, setAssignedCourses] = useState({});


  const togglePanel = () => {
    setShowToast(false);
    setShow(!show)
  };
  const currentPath = window.location.pathname;

  useEffect(() => {
    if(getCurrentUser() && getCurrentUser().role === "Öğretmen"){
      Axios.get("http://localhost:8000/api/course?instructor=" + getCurrentUser()["username"])
    .then((response) => {
      let tempAssignedCourses = {};
      response.data.forEach(course => {
        tempAssignedCourses[course.id] = course;
      });
      setAssignedCourses(tempAssignedCourses);
    });
    }
  } , []);

  return (
    <Router>
      <div>
        <Navbar bg="light" variant="light" expand="sm" style={{ marginBottom: "10px", textAlign:"center" }}>
          <Container>
            <Navbar.Brand href="/">Company</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="m-auto">
                {getCurrentUser() && getCurrentUser().role === "Öğretmen" ?
                  <>
                  { Object.keys(assignedCourses).map((courseID) => {
                    return <Nav.Link key={courseID} href={"/grade?course=" + courseID } active={currentPath === ("/grade?course=" + courseID) }>{assignedCourses[courseID]["courseName"]}</Nav.Link>

                  })  }
                   
                  </>
                  : getCurrentUser() && getCurrentUser().role === "Admin" ?
                    <>
                      <Nav.Link href="/account" active={currentPath === "/account"}>Kullanıcı</Nav.Link>
                      <Nav.Link href="/course" active={currentPath === "/course"}>Ders</Nav.Link>
                      <Nav.Link href="/student" active={currentPath === "/student"}>Öğrenci</Nav.Link>
                    </>
                    : <></>
                }

              </Nav>
            </Navbar.Collapse>
            <Button variant="light" onClick={() => {
              togglePanel();
            }}>{getCurrentUser() ? "Merhaba, " + getCurrentUser().username : "Giriş Yap"}</Button>
          </Container>
        </Navbar>

        <Switch>
          {<Route exact path="/">
            <div style={{ textAlign: "center", justifyContent: "center", marginTop: "20%" }}>
              <h1>Hoş Geldiniz</h1>
              <Button variant="dark" onClick={() => {
                togglePanel();
              }}>{getCurrentUser() ? "Profil" : "Giriş Yap"}</Button>
            </div>
          </Route>}
          <Route path="/student">
            <StudentPage />
          </Route>
          <Route path="/course">
            <CoursePage />
          </Route>
          <Route path="/account">
            <AccountPage />
          </Route>
          <Route path="/grade">
            <GradePage />
          </Route>
        </Switch>
        <Offcanvas show={show} placement="end" onHide={togglePanel}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{getCurrentUser() ? "Profil" : "Giriş Yap"}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {!getCurrentUser()
              ? <><Alert show={showToast} variant="danger" onClose={() => setShowToast(false)} dismissible>
                Kullanıcı adı veya şifre hatalı.
              </Alert>
                <div style={{ textAlign: "center", justifyContent: "center" }}>
                  <IconContext.Provider value={{ size: "7em" }}>
                    <div>
                      <CgProfile />
                    </div>
                  </IconContext.Provider>
                </div>
                <div><Form onSubmit={(e) => {
                  e.preventDefault();
                  login(kullaniciAdi, sifre).then((res) => {
                    if (res.username) {
                      togglePanel()
                    }
                    else {
                      setShowToast(true);
                    }
                  });
                }}>
                  <Form.Group className="mb-3">
                    <Form.Label>Kullanıcı Adı</Form.Label>
                    <Form.Control type="text" onChange={(e) => {
                      setKullaniciAdi(e.target.value)
                    }} required />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Şifre</Form.Label>
                    <Form.Control type="password" onChange={(e) => {
                      setSifre(e.target.value)
                    }} required />
                  </Form.Group>
                  <div style={{ textAlign: "center", justifyContent: "center" }}>
                    <Button style={{ width: "95%" }} className="mt-3" variant="dark" type="submit">Giriş</Button>
                  </div>
                </Form>
                </div></>
              :

              <div style={{ textAlign: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", justifyContent: "center" }}>
                  <IconContext.Provider value={{ size: "7em" }}>
                    <div>
                      <CgProfile />
                    </div>
                  </IconContext.Provider>
                </div>
                <h3>{getCurrentUser().username}</h3>
                <p style={{ color: "grey" }}>{getCurrentUser().role}</p>
                <Route render={({ history }) => (
                  <Button style={{ width: "95%" }} className="mt-3" variant="dark" onClick={() => {
                    logout();
                    togglePanel();
                    history.push("/");
                  }}>Çıkış Yap</Button>
                )} />
              </div>
            }
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </Router>
  );
}

export default App;
