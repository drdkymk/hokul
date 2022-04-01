import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Button, Offcanvas, Form, Table, Row, Col, Alert } from "react-bootstrap";

import Axios from 'axios';
import { getCurrentUser } from './services/auth.service';

function InstructorPage() {
  const [newRow, setNewRow] = useState({
    id:"", username: "", name: "", lastname:""
  });
  const [searchRow, setSearchRow] = useState({
    id:"", username: "", name: "", lastname:""
  });
  const [selectedRow, setSelectedRow] = useState({});
  const [rows, setRows] = useState([]);
  const [update, setUpdate] = useState(false);

  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editVisibilityIndex, setEditVisibilityIndex] = useState(-1);

  const [showToast, setShowToast] = useState(false);

  const togglePanel = () => {
    setShowToast(false);
    setShow(!show)
  };

  const addRow = () => {
    Axios.post("http://localhost:8000/api/instructor/create/", newRow)
      .then((response) => {
        if(response.data === ""){
          setShowToast(true);
          return;
        }
        setUpdate(!update);
        togglePanel();
      });
  }

  const updateRow = () => {
    Axios.post("http://localhost:8000/api/instructor/up", selectedRow)
      .then((response) => {
        console.log('response: ', response);
        if(response.data === ""){
          setShowToast(true);
          return;
        }
        setUpdate(!update);
        togglePanel();
      });
  }

  const deleteRow = () => {
    Axios.delete("http://localhost:8000/api/instructor", { data: { id: selectedRow["id"] } })
      .then((response) => {
        console.log('response: ', response);

        setUpdate(!update);
        togglePanel();
      });
  }

  useEffect(() => {
    Axios.get("http://localhost:8000/api/instructor/")
      .then((response) => {
        setRows(response.data);
      });
  }, [update]);

  console.log(rows);
//   if(!getCurrentUser() || getCurrentUser().role !== "Admin"){
//     return <></>;
//   }
  return (
    <div className="App">
      <Row>
        <Col></Col>
        <Col><h3> Öğretmen </h3></Col>
        <Col>
          <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
            setNewRow({
              id:"", username: "", name: "", lastname:""
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
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                id:"", username: "", name: "", lastname:""
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
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["lastname"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["lastname"] = e.target.value;
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
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "Öğretmeni Düzenle" : "Yeni Öğretmen"}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
        <Alert show={showToast} variant="danger" onClose={() => setShowToast(false)} dismissible>
            İşlem yapılırken hata oluştu.
          </Alert>
          {
            isEdit ?
              <div><Form onSubmit={(e) => {
                e.preventDefault();
                updateRow();
              }}>
                <Form.Group className="mb-3">
                  <Form.Label>Kullanıcı Adı</Form.Label>
                  <Form.Control type="text" value={selectedRow["username"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["username"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled />
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
                <Form.Group className="mb-3">
                  <Form.Label>Kullanıcı Adı</Form.Label>
                  <Form.Control type="text" value={newRow["username"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["username"] = e.target.value;
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

export default InstructorPage;
