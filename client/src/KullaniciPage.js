import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Badge, Button, Offcanvas, Form, Table, Row, Col, Alert } from "react-bootstrap";

import Axios from 'axios';
import { sha256 } from 'js-sha256';
import { getCurrentUser } from './services/auth.service';


function KullaniciPage() {
  const [newRow, setNewRow] = useState({
    KullaniciAdi: "", Sifre: ""
  });
  const [searchRow, setSearchRow] = useState({
    KullaniciAdi: "", Sifre: ""
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
    if(!isPasswordValid(newRow["Sifre"])){
      setShowToast(true);
      return;
    }
    Axios.post("http://localhost:3001/api/Kullanicilar/", { KullaniciAdi: newRow.KullaniciAdi, Sifre: sha256(newRow.Sifre)})
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
    if(!isPasswordValid(selectedRow["Sifre"])){
      setShowToast(true);
      return;
    }
    Axios.put("http://localhost:3001/api/Kullanicilar", { KullaniciAdi: selectedRow.KullaniciAdi, Sifre: sha256(selectedRow.Sifre)})
      .then((response) => {
        if(response.data === ""){
          setShowToast(true);
          return;
        }
        setUpdate(!update);
        togglePanel();
      });
  }

  const deleteRow = () => {
    Axios.delete("http://localhost:3001/api/Kullanicilar", { data: { KullaniciAdi: selectedRow["KullaniciAdi"] } })
      .then((response) => {
        setUpdate(!update);
        togglePanel();

      });
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/api/Kullanicilar/")
      .then((response) => {
        setRows(response.data);
      });
  }, [update]);

  const isPasswordValid = (password) => {
    if(password.length < 8 || password.toLowerCase() === password || !password.match(/[.,:!?]/)){
      return false;
    }
    return true;
  }

  if(!getCurrentUser() || getCurrentUser().role !== "Admin"){
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
              KullaniciAdi: "", Sifre: ""
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
            <th>Şifre<Badge bg="success" pill>Encrypted</Badge></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                KullaniciAdi: "", Sifre: ""
              });
            }}><CgPlayListRemove /></Button></td>
            <td><Form.Control size="sm" type="text" value={searchRow["KullaniciAdi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["KullaniciAdi"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} />
            </td>
            <td><Form.Control size="sm" type="text" value={searchRow["Sifre"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["Sifre"] = e.target.value;
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
                <td>{value.KullaniciAdi}</td>
                <td>{value.Sifre}</td>
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
                  <Form.Control type="text" value={selectedRow["KullaniciAdi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["KullaniciAdi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control type="text" onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["Sifre"] = e.target.value;
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
                  <Form.Control type="text" value={newRow["KullaniciAdi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["KullaniciAdi"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control type="text" value={newRow["Sifre"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["Sifre"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required/>
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

export default KullaniciPage;
