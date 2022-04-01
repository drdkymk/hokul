import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Button, Offcanvas, Form, Table, Row, Col, Alert } from "react-bootstrap";

import Axios from 'axios';
import { getCurrentUser } from './services/auth.service';


function AlanPage() {
  const [newRow, setNewRow] = useState({
    AlanID: "", AlanAdi: "", AlanTipi: ""
  });
  const [searchRow, setSearchRow] = useState({
    AlanID: "", AlanAdi: "", AlanTipi: ""
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
    Axios.post("http://localhost:3001/api/Alanlar/", newRow)
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
    Axios.put("http://localhost:3001/api/Alanlar", selectedRow)
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
    Axios.delete("http://localhost:3001/api/Alanlar", { data: { AlanID: selectedRow["AlanID"] } })
      .then((response) => {
        setUpdate(!update);
        togglePanel();

      });
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/api/Alanlar/")
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
        <Col><h3> Alan </h3></Col>
        <Col>
          <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
            setNewRow({
              AlanID: "", AlanAdi: "", AlanTipi: ""
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
            <th>Alan ID</th>
            <th>Alan Adı</th>
            <th>Alan Tipi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                AlanID: "", AlanAdi: "", AlanTipi: ""
              });
            }}><CgPlayListRemove /></Button></td>
            <td><Form.Control size="sm" type="text" value={searchRow["AlanID"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["AlanID"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} />
            </td>
            <td><Form.Control size="sm" type="text" value={searchRow["AlanAdi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["AlanAdi"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["AlanTipi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["AlanTipi"] = e.target.value;
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
                <td>{value.AlanID}</td>
                <td>{value.AlanAdi}</td>
                <td>{value.AlanTipi === 0 ? "Müdahale" : "Çıktı"}</td>
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "Alanı Düzenle" : "Yeni Alan"}</Offcanvas.Title>
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
                  <Form.Label>Alan ID</Form.Label>
                  <Form.Control type="text" value={selectedRow["AlanID"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["AlanID"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Alan Adı</Form.Label>
                  <Form.Control type="text" value={selectedRow["AlanAdi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["AlanAdi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Alan Tipi</Form.Label>
                  <Form.Select value={selectedRow["AlanTipi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["AlanTipi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    <option value="0">Müdahale</option>
                    <option value="1">Çıktı</option>
                  </Form.Select>
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
                {/* <Form.Group className="mb-3">
                  <Form.Label>Alan ID</Form.Label>
                  <Form.Control type="text" value={newRow["AlanID"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["AlanID"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group> */}
                <Form.Group className="mb-3">
                  <Form.Label>Alan Adı</Form.Label>
                  <Form.Control type="text" value={newRow["AlanAdi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["AlanAdi"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Alan Tipi</Form.Label>
                  <Form.Select value={newRow["AlanTipi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["AlanTipi"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    <option value="0">Müdahale</option>
                    <option value="1">Çıktı</option>
                  </Form.Select>
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

export default AlanPage;
