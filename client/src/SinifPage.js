import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Button, Offcanvas, Form, Table, Row, Col, Alert } from "react-bootstrap";

import Axios from 'axios';
import { getCurrentUser } from './services/auth.service';


function SinifPage() {
  const [newRow, setNewRow] = useState({
    SinifID: "", SinifAdi: "", SinifTipi: ""
  });
  const [searchRow, setSearchRow] = useState({
    SinifID: "", SinifAdi: "", SinifTipi: ""
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
    Axios.post("http://localhost:3001/api/Siniflar/", newRow)
      .then((response) => {
        if(response.data === ""){
          setShowToast(true);
          return;
        }
        setUpdate(!update);
        setShow(!show);
      });
  }

  const updateRow = () => {
    Axios.put("http://localhost:3001/api/Siniflar", selectedRow)
      .then((response) => {
        if(response.data === ""){
          setShowToast(true);
          return;
        }
        setUpdate(!update);
        setShow(!show);
      });
  }

  const deleteRow = () => {
    Axios.delete("http://localhost:3001/api/Siniflar", { data: { SinifID: selectedRow["SinifID"] } })
      .then((response) => {
        setUpdate(!update);
        togglePanel();

      });
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/api/Siniflar/")
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
        <Col><h3> Sınıf </h3></Col>
        <Col>
          <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
            setNewRow({
              SinifID: "", SinifAdi: "", SinifTipi: ""
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
            <th>Sınıf ID</th>
            <th>Sınıf Adı</th>
            <th>Sınıf Tipi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                SinifID: "", SinifAdi: "", SinifTipi: ""
              });
            }}><CgPlayListRemove /></Button></td>
            <td><Form.Control size="sm" type="text" value={searchRow["SinifID"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["SinifID"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} />
            </td>
            <td><Form.Control size="sm" type="text" value={searchRow["SinifAdi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["SinifAdi"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["SinifTipi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["SinifTipi"] = e.target.value;
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
                <td>{value.SinifID}</td>
                <td>{value.SinifAdi}</td>
                <td>{value.SinifTipi === 0 ? "Müdahale" : "Çıktı"}</td>
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "Sinifı Düzenle" : "Yeni Sinif"}</Offcanvas.Title>
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
                  <Form.Label>Sınıf ID</Form.Label>
                  <Form.Control type="text" value={selectedRow["SinifID"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["SinifID"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Sınıf Adı</Form.Label>
                  <Form.Control type="text" value={selectedRow["SinifAdi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["SinifAdi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Sınıf Tipi</Form.Label>
                  <Form.Select value={selectedRow["SinifTipi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["SinifTipi"] = e.target.value;
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
                  <Form.Label>Sınıf ID</Form.Label>
                  <Form.Control type="text" value={newRow["SinifID"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["SinifID"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group> */}
                <Form.Group className="mb-3">
                  <Form.Label>Sınıf Adı</Form.Label>
                  <Form.Control type="text" value={newRow["SinifAdi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["SinifAdi"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Sınıf Tipi</Form.Label>
                  <Form.Select value={newRow["SinifTipi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["SinifTipi"] = e.target.value;
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

export default SinifPage;
