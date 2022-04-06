import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Badge, Button, ToggleButton, ButtonGroup, Offcanvas, Form, Table, Row, Col, Alert } from "react-bootstrap";

import Axios from 'axios';
import { sha256 } from 'js-sha256';
import { getCurrentUser } from './services/auth.service';


function AccountPage() {
  const [newRow, setNewRow] = useState({
    username: "", name: "", lastname: "", password: "", role: ""
  });
  const [searchRow, setSearchRow] = useState({
    username: "", name: "", lastname: "", password: "", role: ""
  });
  const [selectedRow, setSelectedRow] = useState({});
  const [rows, setRows] = useState([]);
  const [update, setUpdate] = useState(false);

  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isInstructor, setIsInstructor] = useState(true);
  const [editVisibilityIndex, setEditVisibilityIndex] = useState(-1);

  const [showToast, setShowToast] = useState(false);

  const togglePanel = () => {
    setShowToast(false);
    setShow(!show)
  };

  const addRow = () => {
    if (!isPasswordValid(newRow["password"])) {
      setShowToast(true);
      return;
    }
    try {
      Axios.post("http://localhost:8000/api/account/create", { username: newRow.username, name: newRow.name, lastname: newRow.lastname, password: sha256(newRow.password), role: isInstructor ? "Öğretmen" : "Admin" })
        .catch(function (error) {
          setShowToast(true);

        }).then((response) => {
          if (response) {
            if (response.data === "") {
              setShowToast(true);
              return;
            }
            setUpdate(!update);
            togglePanel();
          }

        });
    } catch (e) {
      setShowToast(true);
    }

  }

  const updateRow = () => {
    if (!isPasswordValid(selectedRow["password"])) {
      setShowToast(true);
      return;
    }
    Axios.post("http://localhost:8000/api/account/update", { username: selectedRow.username, name: selectedRow.name, lastname: selectedRow.lastname, password: sha256(selectedRow.password), role: selectedRow.role })
      .then((response) => {
        if (response.data === "") {
          setShowToast(true);
          return;
        }
        setUpdate(!update);
        togglePanel();
      });
  }

  const deleteRow = () => {
    Axios.post("http://localhost:8000/api/account/delete", { username: selectedRow["username"] })
      .then((response) => {
        setUpdate(!update);
        togglePanel();

      });
  }

  useEffect(() => {
    Axios.get("http://localhost:8000/api/account/")
      .then((response) => {
        setRows(response.data);
      });
  }, [update]);

  const isPasswordValid = (password) => {
    // if(password.length < 8 || password.toLowerCase() === password || !password.match(/[.,:!?]/)){
    //   return false;
    // }
    return true;
  }

  if (!getCurrentUser() || getCurrentUser().role !== "Admin") {
    return <></>;
  }

  return (
    <div className="App">
      <Row>
        <Col></Col>
        <Col><h3> Kullanıcı </h3></Col>
        <Col>
          <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
            setNewRow({
              username: "", name: "", lastname: "", password: "", role: isInstructor ? "Öğretmen" : "Admin"
            });
            setIsEdit(false);
            togglePanel();
          }}><FaPlus /></Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: "4%" }}>#</th>
            <th>Kullanıcı Adı</th>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Şifre<Badge bg="success" pill>Encrypted</Badge></th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                username: "", name: "", lastname: "", password: "", role: ""
              });
            }}><CgPlayListRemove /></Button></td>
            <td><Form.Control size="sm" type="text" value={searchRow["username"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["username"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} />
            </td>
            <td><Form.Control size="sm" type="text" value={searchRow["name"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["name"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} />
            </td>
            <td><Form.Control size="sm" type="text" value={searchRow["lastname"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["lastname"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} />
            </td>
            <td><Form.Control size="sm" type="text" value={searchRow["password"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["password"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["role"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["role"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
          </tr>
          {rows.map((value, index) => {
            let isEqual = true;
            Object.keys(searchRow).forEach((key) => {
              if (searchRow[key].toString().length > 0 && !value[key].toString().includes(searchRow[key])) {
                isEqual = false;
              }
            });
            return isEqual &&
              <tr key={index}
                onMouseEnter={() => { setEditVisibilityIndex(index); }}
                onMouseLeave={() => { setEditVisibilityIndex(-1); }}
                onClick={() => {
                  setSelectedRow(value);
                  setIsEdit(true);
                  togglePanel();
                }}>
                <td>{editVisibilityIndex === index ? <BiEditAlt /> : index + 1}</td>
                <td>{value.username}</td>
                <td>{value.name}</td>
                <td>{value.lastname}</td>
                <td>{value.password}</td>
                <td>{value.role}</td>
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı"}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Alert show={showToast} variant="danger" onClose={() => setShowToast(false)} dismissible>
            Bu kullanıcı adı sistemde zaten kullanılmaktadır.
          </Alert>
          {
            isEdit ?
              <div><Form onSubmit={(e) => {
                e.preventDefault();
                updateRow();
              }}>
                {/* <div style={{ textAlign: "center", justifyContent: "center" }}>
                  <Form.Group className="mb-3">
                    <ButtonGroup name="toggleisInstructor" disabled defaultValue={"new"} onChange={() => {
                      // setIsInstructor(!isInstructor);
                    }}>
                      <ToggleButton
                        type="radio" name="existed" value={true} checked={(selectedRow["role"] !== "Admin") === true}
                        variant={selectedRow["role"] !== "Admin" ? 'dark' : 'outline-dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["role"] = "Öğretmen";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >Öğretmen</ToggleButton>
                      <ToggleButton
                        type="radio" name="new" value={false} checked={(selectedRow["role"] !== "Admin") === false}
                        variant={selectedRow["role"] !== "Admin" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["role"] = "Admin";
                          setSelectedRow(tempSelectedRow);
                        }}
                      > Admin </ToggleButton>
                    </ButtonGroup>
                  </Form.Group>
                </div> */}
                <Form.Group className="mb-3">
                  <Form.Label>Kullanıcı Adı</Form.Label>
                  <Form.Control type="text" value={selectedRow["username"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["username"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control type="text" onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["password"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ad</Form.Label>
                  <Form.Control type="text" value={selectedRow["name"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["name"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Soyad</Form.Label>
                  <Form.Control type="text" value={selectedRow["lastname"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["lastname"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <div style={{ textAlign: "center", justifyContent: "center" }}>
                  <Button style={{ width: "15%" }} className="mt-3" variant="danger" onClick={() => { deleteRow() }}><MdDelete /></Button>
                  {" "}
                  <Button style={{ width: "80%" }} className="mt-3" variant="dark" type="submit">Düzenle</Button>
                </div>
              </Form>
              </div>
              : <div><Form onSubmit={(e) => {
                e.preventDefault();
                addRow();
              }}>
                <div style={{ textAlign: "center", justifyContent: "center" }}>
                  <Form.Group className="mb-3">
                    <ButtonGroup name="toggleisInstructor" defaultValue={"new"} onChange={() => {
                      setIsInstructor(!isInstructor);
                    }}>
                      <ToggleButton
                        type="radio" name="existed" value={true} checked={isInstructor === true}
                        variant={isInstructor ? 'dark' : 'outline-dark'}
                        onClick={() => {
                          setIsInstructor(true);
                          let tempNewRow = { ...newRow };
                          tempNewRow["role"] = "Öğretmen";
                          setNewRow(tempNewRow);
                        }}
                      >Öğretmen</ToggleButton>
                      <ToggleButton
                        type="radio" name="new" value={false} checked={isInstructor === false}
                        variant={isInstructor ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          setIsInstructor(false);
                          let tempNewRow = { ...newRow };
                          tempNewRow["role"] = "Admin";
                          setNewRow(tempNewRow);
                        }}
                      > Admin </ToggleButton>
                    </ButtonGroup>
                  </Form.Group>
                </div>
                <Form.Group className="mb-3">
                  <Form.Label>Kullanıcı Adı</Form.Label>
                  <Form.Control type="text" value={newRow["username"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["username"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control type="text" value={newRow["password"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["password"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ad</Form.Label>
                  <Form.Control type="text" value={newRow["name"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["name"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Soyad</Form.Label>
                  <Form.Control type="text" value={newRow["lastname"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["lastname"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <div style={{ textAlign: "center", justifyContent: "center" }}>
                  <Button style={{ width: "95%" }} className="mt-3" variant="dark" type="submit">Ekle</Button>
                </div>
              </Form>
              </div>
          }
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default AccountPage;
