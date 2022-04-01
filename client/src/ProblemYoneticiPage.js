import { useState, useEffect } from 'react';
import './App.css';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Button, Offcanvas, Form, Table, Row, Col, Alert } from "react-bootstrap";

import Axios from 'axios';
import { getCurrentUser } from './services/auth.service';


function ProblemYoneticiPage() {
  const [newRow, setNewRow] = useState({
    ProblemTipiID: "", ProblemTanimi: "", ProblemiTanimlayiciAdi: "", ProblemiTanimlayiciSoyadi: "",
    ProblemiTanimlayiciTCNoPasaportNo: "", HedeflenenAmacTanimi: ""
  });
  const [searchRow, setSearchRow] = useState({
    ProblemTipiID: "", ProblemTanimi: "", ProblemiTanimlayiciAdi: "", ProblemiTanimlayiciSoyadi: "",
    ProblemiTanimlayiciTCNoPasaportNo: "", HedeflenenAmacTanimi: ""
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
    Axios.post("http://localhost:3001/api/Problem/", newRow)
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
    Axios.put("http://localhost:3001/api/Problem", selectedRow)
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
    Axios.delete("http://localhost:3001/api/Problem", { data: { ProblemTipiID: selectedRow["ProblemTipiID"] } })
      .then((response) => {
        setUpdate(!update);
        togglePanel();

      });
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/api/Problem/BirimID/" + getCurrentUser().department)
      .then((response) => {
        setRows(response.data);
      });
  }, [update]);

  if (!getCurrentUser() || getCurrentUser().role !== "Yönetici") {
    return <></>;
  }

  return (
    <div className="App">
      <Row>
        <Col></Col>
        <Col><h3> Problem </h3></Col>
        <Col>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: "4%" }}>#</th>
            <th>Problem ID</th>
            <th>Problem Tanımı</th>
            <th>Tanımlayan Adı</th>
            <th>Tanımlayan Soyadı</th>
            <th>Tanımlayan TC/Pasaport No</th>
            <th>Hedeflenen Amaç Tanımı</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                ProblemTipiID: "", ProblemTanimi: "", ProblemiTanimlayiciAdi: "", ProblemiTanimlayiciSoyadi: "",
                ProblemiTanimlayiciTCNoPasaportNo: "", HedeflenenAmacTanimi: ""
              });
            }}><CgPlayListRemove /></Button></td>
            <td><Form.Control size="sm" type="text" value={searchRow["ProblemTipiID"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["ProblemTipiID"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} />
            </td>
            <td><Form.Control size="sm" type="text" value={searchRow["ProblemTanimi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["ProblemTanimi"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["ProblemiTanimlayiciAdi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["ProblemiTanimlayiciAdi"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["ProblemiTanimlayiciSoyadi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["ProblemiTanimlayiciSoyadi"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["ProblemiTanimlayiciTCNoPasaportNo"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["ProblemiTanimlayiciTCNoPasaportNo"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["HedeflenenAmacTanimi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["HedeflenenAmacTanimi"] = e.target.value;
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
                <td>{value.ProblemTipiID}</td>
                <td>{value.ProblemTanimi}</td>
                <td>{value.ProblemiTanimlayiciAdi}</td>
                <td>{value.ProblemiTanimlayiciSoyadi}</td>
                <td>{value.ProblemiTanimlayiciTCNoPasaportNo}</td>
                <td>{value.HedeflenenAmacTanimi}</td>
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "Problemi Düzenle" : "Yeni Problem"}</Offcanvas.Title>
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
                  <Form.Label>Problem ID</Form.Label>
                  <Form.Control type="text" value={selectedRow["ProblemTipiID"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["ProblemTipiID"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Problem Tanımı</Form.Label>
                  <Form.Control type="text" value={selectedRow["ProblemTanimi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["ProblemTanimi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tanımlayan Adı</Form.Label>
                  <Form.Control type="text" value={selectedRow["ProblemiTanimlayiciAdi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["ProblemiTanimlayiciAdi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tanımlayan Soyadı</Form.Label>
                  <Form.Control type="text" value={selectedRow["ProblemiTanimlayiciSoyadi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["ProblemiTanimlayiciSoyadi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tanımlayan TC/Pasaport No</Form.Label>
                  <Form.Control type="text" value={selectedRow["ProblemiTanimlayiciTCNoPasaportNo"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["ProblemiTanimlayiciTCNoPasaportNo"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Hedeflenen Amaç Tanımı</Form.Label>
                  <Form.Control type="text" value={selectedRow["HedeflenenAmacTanimi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["HedeflenenAmacTanimi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} />
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
                  <Form.Label>Problem ID</Form.Label>
                  <Form.Control type="text" value={newRow["ProblemTipiID"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["ProblemTipiID"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} disabled />
                </Form.Group> */}
                <Form.Group className="mb-3">
                  <Form.Label>Problem Tanımı</Form.Label>
                  <Form.Control type="text" value={newRow["ProblemTanimi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["ProblemTanimi"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tanımlayan Adı</Form.Label>
                  <Form.Control type="text" value={newRow["ProblemiTanimlayiciAdi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["ProblemiTanimlayiciAdi"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tanımlayan Soyadı</Form.Label>
                  <Form.Control type="text" value={newRow["ProblemiTanimlayiciSoyadi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["ProblemiTanimlayiciSoyadi"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tanımlayan TC/Pasaport No</Form.Label>
                  <Form.Control type="text" value={newRow["ProblemiTanimlayiciTCNoPasaportNo"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["ProblemiTanimlayiciTCNoPasaportNo"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                {getCurrentUser() && getCurrentUser().role === "Admin" && 
                <Form.Group className="mb-3">
                  <Form.Label>Hedeflenen Amaç Tanımı</Form.Label>
                  <Form.Control type="text" value={newRow["HedeflenenAmacTanimi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["HedeflenenAmacTanimi"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} />
                </Form.Group>}

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

export default ProblemYoneticiPage;
