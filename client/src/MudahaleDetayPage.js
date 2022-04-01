import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Button, Offcanvas, Form, Table, Row, Col, Alert } from "react-bootstrap";

import Axios from 'axios';
import { getCurrentUser } from './services/auth.service';


function MudahaleDetayPage() {
  // const [alanSelect, setAlanSelect] = useState([]);
  // const [sinifSelect, setSinifSelect] = useState([]);
  const [mudahaleSelect, setMudahaleSelect] = useState([]);
  const [aktiviteSelect, setAktiviteSelect] = useState([]);

  const [newRow, setNewRow] = useState({
    AlanID: "", SinifID: "", MudahaleID: "", AktiviteID: "", Sira: ""
  });
  const [searchRow, setSearchRow] = useState({
    AlanID: "", SinifID: "", MudahaleID: "", AktiviteID: "", Sira: ""
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
    Axios.post("http://localhost:3001/api/MudahaleDetay/", newRow)
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
    Axios.put("http://localhost:3001/api/MudahaleDetay", selectedRow)
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
    Axios.delete("http://localhost:3001/api/MudahaleDetay", {
      data: {
        AlanID: selectedRow["AlanID"],
        SinifID: selectedRow["SinifID"],
        MudahaleID: selectedRow["MudahaleID"],
        AktiviteID: selectedRow["AktiviteID"]
      }
    })
      .then((response) => {
        setUpdate(!update);
        togglePanel();

      });
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/api/MudahaleDetay/")
      .then((response) => {
        setRows(response.data);
      });
  }, [update]);

  useEffect(() => {
    // Axios.get("http://localhost:3001/api/Alanlar/")
    //   .then((response) => {
    //     setAlanSelect(response.data);
    //   });
    // Axios.get("http://localhost:3001/api/Siniflar/")
    //   .then((response) => {
    //     setSinifSelect(response.data);
    //   });
    Axios.get("http://localhost:3001/api/Mudahale/")
      .then((response) => {
        setMudahaleSelect(response.data);
      });
    Axios.get("http://localhost:3001/api/Aktiviteler/")
      .then((response) => {
        setAktiviteSelect(response.data);
      });
  }, []);

  if (!getCurrentUser() || getCurrentUser().role !== "Admin") {
    return <></>;
  }
  return (
    <div className="App">
      <Row>
        <Col></Col>
        <Col><h3> Müdahale Detay </h3></Col>
        <Col>
          <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
            setNewRow({
              AlanID: "", SinifID: "", MudahaleID: "", AktiviteID: "", Sira: ""
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
            <th>Aktivite ID</th>
            <th>Sıra</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                AlanID: "", SinifID: "", MudahaleID: "", AktiviteID: "", Sira: ""
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
            <td><Form.Control size="sm" type="text" value={searchRow["AktiviteID"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["AktiviteID"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["Sira"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["Sira"] = e.target.value;
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
                <td>{value.AktiviteID}</td>
                <td>{value.Sira}</td>
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "Müdahale Detayı Düzenle" : "Yeni Müdahale Detay"}</Offcanvas.Title>
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
                {/* <Form.Group className="mb-3">
                  <Form.Label>Alan ID</Form.Label>
                  <Form.Select value={selectedRow["AlanID"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["AlanID"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled>
                    <option value="" disabled>Seçiniz...</option>
                    {alanSelect.map((value, index) => {
                      return <option key={index} value={value.AlanID}>{value.AlanID + ": " + value.AlanAdi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Sınıf ID</Form.Label>
                  <Form.Select value={selectedRow["SinifID"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["SinifID"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled>
                    <option value="" disabled>Seçiniz...</option>
                    {sinifSelect.map((value, index) => {
                      return <option key={index} value={value.SinifID}>{value.SinifID + ": " + value.SinifAdi}</option>
                    })}
                  </Form.Select>
                </Form.Group> */}
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
                <Form.Group className="mb-3">
                  <Form.Label>Aktivite ID</Form.Label>
                  <Form.Select value={selectedRow["AktiviteID"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["AktiviteID"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled>
                    <option value="" disabled>Seçiniz...</option>
                    {aktiviteSelect.map((value, index) => {
                      return <option key={index} value={value.AktiviteID}>{value.AktiviteID + ": " + value.AktiviteTanimi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Sıra</Form.Label>
                  <Form.Control type="text" value={selectedRow["Sira"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["Sira"] = e.target.value;
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
                {/* <Form.Group className="mb-3">
                  <Form.Label>Alan ID</Form.Label>
                  <Form.Select value={newRow["AlanID"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["AlanID"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {alanSelect.map((value, index) => {
                      return <option key={index} value={value.AlanID}>{value.AlanID + ": " + value.AlanAdi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Sınıf ID</Form.Label>
                  <Form.Select value={newRow["SinifID"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["SinifID"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {sinifSelect.map((value, index) => {
                      return <option key={index} value={value.SinifID}>{value.SinifID + ": " + value.SinifAdi}</option>
                    })}
                  </Form.Select>
                </Form.Group> */}
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
                <Form.Group className="mb-3">
                  <Form.Label>Aktivite ID</Form.Label>
                  <Form.Select value={newRow["AktiviteID"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["AktiviteID"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {aktiviteSelect.map((value, index) => {
                      return <option key={index} value={value.AktiviteID}>{value.AktiviteID + ": " + value.AktiviteTanimi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Sıra</Form.Label>
                  <Form.Control type="text" value={newRow["Sira"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["Sira"] = e.target.value;
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

export default MudahaleDetayPage;
