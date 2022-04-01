import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Button, Offcanvas, Form, Table, Row, Col, Alert, ButtonGroup, ToggleButton } from "react-bootstrap";

import Axios from 'axios';
import { getCurrentUser } from './services/auth.service';


function ProblemCiktiDegerlendirmePage() {
  const [problemSelect, setProblemSelect] = useState([]);
  const [belirtecSelect, setBelirtecSelect] = useState([]);

  const [newRow, setNewRow] = useState({
    ProblemID: "", BelirtecID: "", Skor: "", SkorTarihi: ""
  });
  const [searchRow, setSearchRow] = useState({
    ProblemID: "", BelirtecID: "", Skor: "", SkorTarihi: ""
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
    Axios.post("http://localhost:3001/api/ProblemCiktiDegerlendirme/", newRow)
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
    Axios.put("http://localhost:3001/api/ProblemCiktiDegerlendirme", selectedRow)
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
    Axios.delete("http://localhost:3001/api/ProblemCiktiDegerlendirme", {
      data: {
        ProblemID: selectedRow["ProblemID"],
        BelirtecID: selectedRow["BelirtecID"],
      }
    })
      .then((response) => {
        setUpdate(!update);
        togglePanel();
      });
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/api/ProblemCiktiDegerlendirme/")
      .then((response) => {
        setRows(response.data);
      });
  }, [update]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/Problem/BirimID/" + getCurrentUser().department)
      .then((response) => {
        setProblemSelect(response.data);
      });
    Axios.get("http://localhost:3001/api/Belirtecler/")
      .then((response) => {
        setBelirtecSelect(response.data);
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
        <Col><h3> Problem Çıktı Değerlendirme </h3></Col>
        <Col>
          <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
            setNewRow({
              ProblemID: "", BelirtecID: "", Skor: "", SkorTarihi: ""
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
            <th>Belirteç ID</th>
            <th>Skor</th>
            <th>Skor Tarihi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                ProblemID: "", BelirtecID: "", Skor: "", SkorTarihi: ""
              });
            }}><CgPlayListRemove /></Button></td>
            <td><Form.Control size="sm" type="text" value={searchRow["BelirtecID"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["BelirtecID"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["Skor"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["Skor"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["SkorTarihi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["SkorTarihi"] = e.target.value;
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
                <td>{value.BelirtecID}</td>
                <td>{value.Skor}</td>
                <td>{value.SkorTarihi}</td>
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "Problem Çıktı Değerlendirmeyi Düzenle" : "Yeni Problem Çıktı Değerlendirme"}</Offcanvas.Title>
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
                  <Form.Label>Belirteç ID</Form.Label>
                  <Form.Select value={selectedRow["BelirtecID"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["BelirtecID"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled>
                    <option value="" disabled>Seçiniz...</option>
                    {belirtecSelect.map((value, index) => {
                      return <option key={index} value={value.BelirtecID}>{value.BelirtecID + ": " + value.BelirtecTanimi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Skor</Form.Label>
                  <Row>
                    <ButtonGroup name="toggleIsNew" value={selectedRow["Skor"]} onChange={() => { }}>
                      <ToggleButton
                        type="radio" name="1" value={"1"} checked={selectedRow["Skor"] === "1"}
                        variant={selectedRow["Skor"] !== "1" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["Skor"] = "1";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >1</ToggleButton>
                      <ToggleButton
                        type="radio" name="2" value={"2"} checked={selectedRow["Skor"] === "2"}
                        variant={selectedRow["Skor"] !== "2" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["Skor"] = "2";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >2</ToggleButton>
                      <ToggleButton
                        type="radio" name="3" value={"3"} checked={selectedRow["Skor"] === "3"}
                        variant={selectedRow["Skor"] !== "3" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["Skor"] = "3";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >3</ToggleButton>
                      <ToggleButton
                        type="radio" name="4" value={"4"} checked={selectedRow["Skor"] === "4"}
                        variant={selectedRow["Skor"] !== "4" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["Skor"] = "4";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >4</ToggleButton>
                      <ToggleButton
                        type="radio" name="5" value={"5"} checked={selectedRow["Skor"] === "5"}
                        variant={selectedRow["Skor"] !== "5" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["Skor"] = "5";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >5</ToggleButton>
                    </ButtonGroup>
                  </Row>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Skor Tarihi</Form.Label>
                  <Form.Control type="text" value={selectedRow["SkorTarihi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["SkorTarihi"] = e.target.value;
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
                  <Form.Label>Belirteç ID</Form.Label>
                  <Form.Select value={newRow["BelirtecID"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["BelirtecID"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {belirtecSelect.map((value, index) => {
                      return <option key={index} value={value.BelirtecID}>{value.BelirtecID + ": " + value.BelirtecTanimi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Skor</Form.Label>
                  <Row>
                    <ButtonGroup name="toggleIsNew" defaultValue={"1"} onChange={() => { }}>
                      <ToggleButton
                        type="radio" name="1" value={"1"} checked={newRow["Skor"] === "1"}
                        variant={newRow["Skor"] !== "1" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["Skor"] = "1";
                          setNewRow(tempNewRow);
                        }}
                      >1</ToggleButton>
                      <ToggleButton
                        type="radio" name="2" value={"2"} checked={newRow["Skor"] === "2"}
                        variant={newRow["Skor"] !== "2" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["Skor"] = "2";
                          setNewRow(tempNewRow);
                        }}
                      >2</ToggleButton>
                      <ToggleButton
                        type="radio" name="3" value={"3"} checked={newRow["Skor"] === "3"}
                        variant={newRow["Skor"] !== "3" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["Skor"] = "3";
                          setNewRow(tempNewRow);
                        }}
                      >3</ToggleButton>
                      <ToggleButton
                        type="radio" name="4" value={"4"} checked={newRow["Skor"] === "4"}
                        variant={newRow["Skor"] !== "4" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["Skor"] = "4";
                          setNewRow(tempNewRow);
                        }}
                      >4</ToggleButton>
                      <ToggleButton
                        type="radio" name="5" value={"5"} checked={newRow["Skor"] === "5"}
                        variant={newRow["Skor"] !== "5" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["Skor"] = "5";
                          setNewRow(tempNewRow);
                        }}
                      >5</ToggleButton>
                    </ButtonGroup>
                  </Row>
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

export default ProblemCiktiDegerlendirmePage;
