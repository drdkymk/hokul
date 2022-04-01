import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { IconContext } from "react-icons";
import { CgProfile } from 'react-icons/cg';


import './style/css/bootstrap.css';
import './App.css';

import { Button, Navbar, Container, Nav, NavDropdown, Form, Alert, Offcanvas } from "react-bootstrap";
import { getCurrentUser, login, logout } from "./services/auth.service";

import AktivitePage from "./AktivitePage";
import AlanPage from "./AlanPage";
import BelirtecPage from "./BelirtecPage";
import BirimPage from "./BirimPage";
import CiktiDetayPage from "./CiktiDetayPage";
import CiktiPage from "./CiktiPage";
import IlcePage from "./IlcePage";
import IlPage from "./IlPage";
import KullaniciPage from "./KullaniciPage";
import MudahaleDetayPage from "./MudahaleDetayPage";
import MudahalePage from "./MudahalePage";
import ProblemBirimPage from "./ProblemBirimPage";
import ProblemPage from "./ProblemPage";
import SinifPage from "./SinifPage";
import PersonelPage from "./PersonelPage";
import ProblemMudahalePage from "./ProblemMudahalePage";
import ProblemCiktiPage from "./ProblemCiktiPage";
import IlaveMudahaleDetayPage from "./IlaveMudahaleDetayPage";
import IlaveCiktiDetayPage from "./IlaveCiktiDetayPage";
import PersonelProblemPage from "./PersonelProblem";
import ProblemCiktiDegerlendirmePage from "./ProblemCiktiDegerlendirmePage";
import ProblemDurumDegerlendirmePage from "./ProblemDurumDegerlendirmePage";
import CalisanProblemPage from "./CalisanProblemPage";
import CalisanAktivitePage from "./CalisanAktivitePage";
import ProblemYoneticiPage from "./ProblemYoneticiPage";
import InstructorPage from "./InstructorPage";


function App() {

  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [sifre, setSifre] = useState("");

  const togglePanel = () => {
    setShowToast(false);
    setShow(!show)
  };
  const currentPath = window.location.pathname;

  return (
    <Router>
      <div>
        <Navbar bg="light" variant="light" expand="sm" style={{ marginBottom: "10px", textAlign:"center" }}>
          <Container>
            <Navbar.Brand href="/">Company</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="m-auto">
                {getCurrentUser() && getCurrentUser().role === "Admin" ?
                  <>
                    <Nav.Link href="/kullanici" active={currentPath === "/kullanici"}>Kullanıcı</Nav.Link>
                    <Nav.Link href="/personel" active={currentPath === "/personel"}>Personel</Nav.Link>
                    <Nav.Link href="/il" active={currentPath === "/il"}>İl</Nav.Link>
                    <Nav.Link href="/ilce" active={currentPath === "/ilce"}>İlçe</Nav.Link>
                    <Nav.Link href="/birim" active={currentPath === "/birim"} >Birim</Nav.Link>
                    <Nav.Link href="/problem" active={currentPath === "/problem"}>Problem</Nav.Link>
                    <Nav.Link href="/problemBirim" active={currentPath === "/problemBirim"}>Problem-Birim</Nav.Link>
                    <Nav.Link href="/alan" active={currentPath === "/alan"}>Alan</Nav.Link>
                    <Nav.Link href="/sinif" active={currentPath === "/sinif"}>Sınıf</Nav.Link>
                    <NavDropdown title="Müdahale" id="mudahale-dropdown" active={currentPath === "/mudahale" || currentPath === "/aktivite" || currentPath === "/mudahaleDetay"}>
                      <NavDropdown.Item href="/mudahale">Müdahale</NavDropdown.Item>
                      <NavDropdown.Item href="/aktivite">Aktivite</NavDropdown.Item>
                      <NavDropdown.Item href="/mudahaleDetay">Müdahale Detay</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Çıktı" id="cikti-dropdown" active={currentPath === "/cikti" || currentPath === "/belirtec" || currentPath === "/ciktiDetay"}>
                      <NavDropdown.Item href="/cikti">Çıktı</NavDropdown.Item>
                      <NavDropdown.Item href="/belirtec">Belirteç</NavDropdown.Item>
                      <NavDropdown.Item href="/ciktiDetay">Çıktı Detay</NavDropdown.Item>
                    </NavDropdown>
                  </>
                  : getCurrentUser() && getCurrentUser().role === "Yönetici" ?
                    <>
                      <Nav.Link href="/problemYonetici" active={currentPath === "/problemYonetici"}>Problem</Nav.Link>
                      <Nav.Link href="/problemMudahale" active={currentPath === "/problemMudahale"}>Problem Müdahale</Nav.Link>
                      <Nav.Link href="/problemCikti" active={currentPath === "/problemCikti"}>Problem Çıktı</Nav.Link>
                      <Nav.Link href="/ilaveMudahaleDetay" active={currentPath === "/ilaveMudahaleDetay"}>İlave Müdahale Detay</Nav.Link>
                      <Nav.Link href="/ilaveCiktiDetay" active={currentPath === "/ilaveCiktiDetay"}>İlave Çıktı Detay</Nav.Link>
                      <Nav.Link href="/personelProblem" active={currentPath === "/personelProblem"}>Personel-Problem</Nav.Link>
                      <Nav.Link href="/problemCiktiDegerlendirme" active={currentPath === "/problemCiktiDegerlendirme"}>Problem Çıktı Değerlendirme</Nav.Link>
                      <Nav.Link href="/problemDurumDegerlendirme" active={currentPath === "/problemDurumDegerlendirme"}>Problem Durum Değerlendirme</Nav.Link>
                      <Nav.Link href="/calisanAktivite" active={currentPath === "/calisanAktivite"}>Çalışan Aktiviteleri</Nav.Link>

                    </>
                    : getCurrentUser() && getCurrentUser().role === "Personel" ?
                      <Nav.Link href="/calisanProblem" active={currentPath === "/calisanProblem"}>Çalışan-Problem</Nav.Link>
                      : <Nav.Link href="/problem" active={currentPath === "/problem"}>Problem Bildir</Nav.Link>
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
          <Route path="/kullanici">
            <KullaniciPage />
          </Route>
          <Route path="/personel">
            <PersonelPage />
          </Route>
          <Route path="/il">
            <IlPage />
          </Route>
          <Route path="/ilce">
            <IlcePage />
          </Route>
          <Route path="/birim">
            <BirimPage />
          </Route>
          <Route path="/problem">
            <ProblemPage />
          </Route>
          <Route path="/problemBirim">
            <ProblemBirimPage />
          </Route>
          <Route path="/alan">
            <AlanPage />
          </Route>
          <Route path="/sinif">
            <SinifPage />
          </Route>
          <Route path="/mudahale">
            <MudahalePage />
          </Route>
          <Route path="/aktivite">
            <AktivitePage />
          </Route>
          <Route path="/mudahaleDetay">
            <MudahaleDetayPage />
          </Route>
          <Route path="/cikti">
            <CiktiPage />
          </Route>
          <Route path="/belirtec">
            <BelirtecPage />
          </Route>
          <Route path="/ciktiDetay">
            <CiktiDetayPage />
          </Route>
          <Route path="/problemYonetici">
            <ProblemYoneticiPage />
          </Route>
          <Route path="/problemMudahale">
            <ProblemMudahalePage />
          </Route>
          <Route path="/problemCikti">
            <ProblemCiktiPage />
          </Route>
          <Route path="/ilaveMudahaleDetay">
            <IlaveMudahaleDetayPage />
          </Route>
          <Route path="/ilaveCiktiDetay">
            <IlaveCiktiDetayPage />
          </Route>
          <Route path="/personelProblem">
            <PersonelProblemPage />
          </Route>
          <Route path="/problemCiktiDegerlendirme">
            <ProblemCiktiDegerlendirmePage />
          </Route>
          <Route path="/problemDurumDegerlendirme">
            <ProblemDurumDegerlendirmePage />
          </Route>
          <Route path="/calisanProblem">
            <CalisanProblemPage />
          </Route>
          <Route path="/calisanAktivite">
            <CalisanAktivitePage />
          </Route>
          <Route path="/instructor">
            <InstructorPage />
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
