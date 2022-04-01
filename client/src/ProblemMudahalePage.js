import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Button, Offcanvas, Form, Table, Row, Col, Alert } from "react-bootstrap";

import Axios from 'axios';
import { getCurrentUser } from './services/auth.service';


function ProblemMudahalePage() {
  const [problemSelect, setProblemSelect] = useState([]);
  const [mudahaleSelect, setMudahaleSelect] = useState([]);

  const [newRow, setNewRow] = useState({
    AlanID: "", SinifID: "", MudahaleID: "", ProblemID: ""
  });
  const [searchRow, setSearchRow] = useState({
    AlanID: "", SinifID: "", MudahaleID: "", ProblemID: ""
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
    Axios.post("http://localhost:3001/api/ProblemMudahale/", newRow)
      .then((response) => {
        if (response.data === "") {
          setShowToast(true);
          return;
        }
        setUpdate(!update);
        togglePanel();
      });
  }

  const updateRow = () => {
    Axios.put("http://localhost:3001/api/ProblemMudahale", selectedRow)
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
    Axios.delete("http://localhost:3001/api/ProblemMudahale", { data: { MudahaleID: selectedRow["MudahaleID"], ProblemID: selectedRow["ProblemID"] } })
      .then((response) => {
        setUpdate(!update);
        togglePanel();
      });
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/api/ProblemMudahale/")
      .then((response) => {
        setRows(response.data);
      });
  }, [update]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/Mudahale/")
      .then((response) => {
        setMudahaleSelect(response.data);
      });
    Axios.get("http://localhost:3001/api/Problem/BirimID/" + getCurrentUser().department)
      .then((response) => {
        setProblemSelect(response.data);
      });
  }, []);

  if (!getCurrentUser() || getCurrentUser().role !== "Yönetici") {
    return <></>;
  }
  return (
    <div className="App">
      <Row>
        <Col>
          <Form.Group className="mx-1 mb-2">
            <Form.Select value={selectedRow["ProblemID"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["ProblemID"] = e.target.value;
              setSearchRow(tempSearchRow);
            }}>
              <option value="">Problem Seçiniz...</option>
              {problemSelect.map((value, index) => {
                return <option key={index} value={value.ProblemTipiID}>{value.ProblemTipiID + ": " + value.ProblemTanimi}</option>
              })}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col><h3> Problem Müdahale </h3></Col>
        <Col>
          <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
            setNewRow({
              AlanID: "", SinifID: "", MudahaleID: "", ProblemID: ""
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
            <th>Sınıf ID</th>
            <th>Müdahale ID</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                AlanID: "", SinifID: "", MudahaleID: "", ProblemID: ""
              });
            }}><CgPlayListRemove /></Button></td>
            <td><Form.Control size="sm" type="text" value={searchRow["AlanID"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["AlanID"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} />
            </td>
            <td><Form.Control size="sm" type="text" value={searchRow["SinifID"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["SinifID"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["MudahaleID"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["MudahaleID"] = e.target.value;
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
                <td>{value.SinifID}</td>
                <td>{value.MudahaleID}</td>
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "Müdahaleyı Düzenle" : "Yeni Müdahale"}</Offcanvas.Title>
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
                  <Form.Select value={selectedRow["ProblemID"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["ProblemID"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled>
                    <option value="" disabled>Seçiniz...</option>
                    {problemSelect.map((value, index) => {
                      return <option key={index} value={value.ProblemTipiID}>{value.ProblemTipiID + ": " + value.ProblemTanimi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Müdahale ID</Form.Label>
                  <Form.Select value={selectedRow["MudahaleID"].length === 0 ? "" : selectedRow["MudahaleID"] + "," + selectedRow["AlanID"] + "," + selectedRow["SinifID"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    const values = e.target.value.split(",");
                    tempSelectedRow["MudahaleID"] = values[0];
                    tempSelectedRow["AlanID"] = values[1];
                    tempSelectedRow["SinifID"] = values[2];
                    setSelectedRow(tempSelectedRow);
                  }} disabled>
                    <option value="" disabled>Seçiniz...</option>
                    {mudahaleSelect.map((value, index) => {
                      return <option key={index} value={value.MudahaleID + "," + value.AlanID + "," + value.SinifID}>{value.MudahaleID + ": " + value.MudahaleAdi}</option>
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
                  <Form.Label>Problem ID</Form.Label>
                  <Form.Select value={newRow["ProblemID"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["ProblemID"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {problemSelect.map((value, index) => {
                      return <option key={index} value={value.ProblemTipiID}>{value.ProblemTipiID + ": " + value.ProblemTanimi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Müdahale ID</Form.Label>
                  <Form.Select value={newRow["MudahaleID"].length === 0 ? "" : newRow["MudahaleID"] + "," + newRow["AlanID"] + "," + newRow["SinifID"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    const values = e.target.value.split(",");
                    tempNewRow["MudahaleID"] = values[0];
                    tempNewRow["AlanID"] = values[1];
                    tempNewRow["SinifID"] = values[2];
                    setNewRow(tempNewRow);
                  }} required >
                    <option value="" disabled>Seçiniz...</option>
                    {mudahaleSelect.map((value, index) => {
                      return <option key={index} value={value.MudahaleID + "," + value.AlanID + "," + value.SinifID}>{value.MudahaleID + ": " + value.MudahaleAdi}</option>
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

export default ProblemMudahalePage;
