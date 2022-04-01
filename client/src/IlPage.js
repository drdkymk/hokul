import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Button, Offcanvas, Form, Table, Row, Col, Alert } from "react-bootstrap";

import Axios from 'axios';
import { getCurrentUser } from './services/auth.service';

function IlPage() {
  const [newRow, setNewRow] = useState({
    IlKodu: "", IlAdi: ""
  });
  const [searchRow, setSearchRow] = useState({
    IlKodu: "", IlAdi: ""
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
    Axios.post("http://localhost:3001/api/Iller/", newRow)
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
    Axios.put("http://localhost:3001/api/Iller", selectedRow)
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
    Axios.delete("http://localhost:3001/api/Iller", { data: { IlKodu: selectedRow["IlKodu"] } })
      .then((response) => {
        setUpdate(!update);
        togglePanel();
      });
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/api/Iller/")
      .then((response) => {
        setRows(response.data);
      });
  }, [update]);

  if(!getCurrentUser() || getCurrentUser().role !== "Admin"){
    return <></>;
  }
  return (
    <div className="App">
      <Row>
        <Col></Col>
        <Col><h3> İl </h3></Col>
        <Col>
          <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
            setNewRow({
              IlKodu: "", IlAdi: ""
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
            <th>İl Kodu</th>
            <th>İl Adı</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                IlKodu: "", IlAdi: ""
              });
            }}><CgPlayListRemove /></Button></td>
            <td><Form.Control size="sm" type="text" value={searchRow["IlKodu"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["IlKodu"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} />
            </td>
            <td><Form.Control size="sm" type="text" value={searchRow["IlAdi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["IlAdi"] = e.target.value;
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
                <td>{value.IlKodu}</td>
                <td>{value.IlAdi}</td>
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "İli Düzenle" : "Yeni İl"}</Offcanvas.Title>
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
                  <Form.Label>İl Kodu</Form.Label>
                  <Form.Control type="text" value={selectedRow["IlKodu"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["IlKodu"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>İl Adı</Form.Label>
                  <Form.Control type="text" value={selectedRow["IlAdi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["IlAdi"] = e.target.value;
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
                  <Form.Label>İl Kodu</Form.Label>
                  <Form.Control type="text" value={newRow["IlKodu"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["IlKodu"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>İl Adı</Form.Label>
                  <Form.Control type="text" value={newRow["IlAdi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["IlAdi"] = e.target.value;
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

export default IlPage;
