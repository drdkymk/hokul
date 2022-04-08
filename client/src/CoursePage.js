import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Button, Offcanvas, Form, Table, Row, Col, Alert } from "react-bootstrap";

import Axios from 'axios';
import { getCurrentUser } from './services/auth.service';

function CoursePage() {
  const [instructorsSelect, setInstructorsSelect] = useState([]);

  const [newRow, setNewRow] = useState({
    id: "", courseCode: "", courseName: "", instructorID: ""
  });
  const [searchRow, setSearchRow] = useState({
    id: "", courseCode: "", courseName: "", instructorID: ""
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
    Axios.post("http://localhost:8000/api/course/create/", newRow)
      .then((response) => {
        if (response.data === "") {
          setShowToast(true);
          return;
        }
        const courseID = response.data.id;
        let assignments = ["Yazılı 1", "Yazılı 2", "Yazılı 3", "Performans 1", "Performans 2", "Proje"];
        for (let i = 0; i < assignments.length; i++) {
          Axios.post("http://localhost:8000/api/assignment/create/", { courseID: courseID, assignmentName: assignments[i] })
            .then((response) => {
            });
        }
        setUpdate(!update);
        togglePanel();
      });
  }

  const updateRow = () => {
    Axios.post("http://localhost:8000/api/course/update", selectedRow)

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
    Axios.post("http://localhost:8000/api/course/delete", { id: selectedRow["id"] })
      .then((response) => {
        setUpdate(!update);
        togglePanel();
      });
  }

  useEffect(() => {
    Axios.get("http://localhost:8000/api/course/")
      .then((response) => {
        setRows(response.data);
      });
  }, [update]);

  useEffect(() => {

    Axios.get("http://localhost:8000/api/account?role=instructor")
      .then((response) => {
        setInstructorsSelect(response.data);
      });
  }, []);

    if(!getCurrentUser() || getCurrentUser().role !== "Admin"){
      return <></>;
    }
  return (
    <div className="App">
      <Row>
        <Col></Col>
        <Col><h3> Ders </h3></Col>
        <Col>
          <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
            setNewRow({
              id: "", courseCode: "", courseName: "", instructorID: ""
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
            <th>Ders Kodu</th>
            <th>Ders Adı</th>
            <th>Öğretmen</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                id: "", courseCode: "", courseName: "", instructorID: ""
              });
            }}><CgPlayListRemove /></Button></td>
            <td><Form.Control size="sm" type="text" value={searchRow["courseCode"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["courseCode"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} />
            </td>
            <td><Form.Control size="sm" type="text" value={searchRow["courseName"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["courseName"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["instructorID"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["instructorID"] = e.target.value;
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
                <td>{value.courseCode}</td>
                <td>{value.courseName}</td>
                <td>{value.instructorID}</td>
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "Dersi Düzenle" : "Yeni Ders"}</Offcanvas.Title>
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
                  <Form.Label>Ders Kodu</Form.Label>
                  <Form.Control type="text" value={selectedRow["courseCode"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["courseCode"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ders Adı</Form.Label>
                  <Form.Control type="text" value={selectedRow["courseName"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["courseName"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Öğretmen</Form.Label>
                  <Form.Select value={selectedRow["instructorID"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["instructorID"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {instructorsSelect.map((value, index) => {
                      return <option key={index} value={value.username}>{ value.name + " " + value.lastname}</option>
                    })}
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
                <Form.Group className="mb-3">
                  <Form.Label>Ders Kodu</Form.Label>
                  <Form.Control type="text" value={newRow["courseCode"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["courseCode"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ders Adı</Form.Label>
                  <Form.Control type="text" value={newRow["courseName"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["courseName"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Öğretmen</Form.Label>
                  <Form.Select value={newRow["instructorID"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["instructorID"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {instructorsSelect.map((value, index) => {
                      return <option key={index} value={value.username}>{ value.name + " " + value.lastname}</option>
                    })}
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

export default CoursePage;
