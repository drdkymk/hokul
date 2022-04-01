import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Button, Offcanvas, Form, Table, Row, Col, Alert, ButtonGroup, ToggleButton } from "react-bootstrap";

import Axios from 'axios';
import { getCurrentUser } from './services/auth.service';

function ProblemDurumDegerlendirmePage() {
  const [problemSelect, setProblemSelect] = useState([]);
  const [kullaniciSelect, setKullaniciSelect] = useState([]);

  const [newRow, setNewRow] = useState({
    ProblemID: "", YeniProblemID: "", YeniProblemTanimi: "", YeniHedef: "", OncekiProblemSkoru: "", TahminEdilenProblemSkoru: "", DegerlendirmeTarihi: "", DegerlendirenKullaniciAdi: ""
  });
  const [searchRow, setSearchRow] = useState({
    ProblemID: "", YeniProblemID: "", YeniProblemTanimi: "", YeniHedef: "", OncekiProblemSkoru: "", TahminEdilenProblemSkoru: "", DegerlendirmeTarihi: "", DegerlendirenKullaniciAdi: ""
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
    Axios.post("http://localhost:3001/api/ProblemDurumDegerlendirme/", newRow)
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
    Axios.put("http://localhost:3001/api/ProblemDurumDegerlendirme", selectedRow)
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
    Axios.delete("http://localhost:3001/api/ProblemDurumDegerlendirme", { data: { ProblemID: selectedRow["YeniProblemID"], YeniProblemID: selectedRow["YeniProblemID"] } })
      .then((response) => {
        setUpdate(!update);
        togglePanel();
      });
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/api/ProblemDurumDegerlendirme/")
      .then((response) => {
        setRows(response.data);
      });
  }, [update]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/Problem/BirimID/" + getCurrentUser().department)
      .then((response) => {
        setProblemSelect(response.data);
      });
    Axios.get("http://localhost:3001/api/Personel/")
      .then((response) => {
        setKullaniciSelect(response.data);
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
          </Form.Group></Col>
        <Col><h3> Problem Durum Değerlendirme </h3></Col>
        <Col>
          <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
            setNewRow({
              ProblemID: "", YeniProblemID: "", YeniProblemTanimi: "", YeniHedef: "", OncekiProblemSkoru: "", TahminEdilenProblemSkoru: "", DegerlendirmeTarihi: "", DegerlendirenKullaniciAdi: ""
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
            <th>Yeni Problem ID</th>
            <th>Yeni Problem Tanımı</th>
            <th>Yeni Hedef</th>
            <th>Önceki Problem Skoru</th>
            <th>Tahmin Edilen Problem Skoru</th>
            <th>Değerlendirme Tarihi</th>
            <th>Değerlendiren Kullanıcı Adı</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                ProblemID: "", YeniProblemID: "", YeniProblemTanimi: "", YeniHedef: "", OncekiProblemSkoru: "", TahminEdilenProblemSkoru: "", DegerlendirmeTarihi: "", DegerlendirenKullaniciAdi: ""
              });
            }}><CgPlayListRemove /></Button></td>
            <td><Form.Control size="sm" type="text" value={searchRow["YeniProblemID"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["YeniProblemID"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["YeniProblemTanimi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["YeniProblemTanimi"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["YeniHedef"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["YeniHedef"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["OncekiProblemSkoru"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["OncekiProblemSkoru"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["TahminEdilenProblemSkoru"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["TahminEdilenProblemSkoru"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["DegerlendirmeTarihi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["DegerlendirmeTarihi"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["DegerlendirenKullaniciAdi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["DegerlendirenKullaniciAdi"] = e.target.value;
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
                <td>{value.YeniProblemID}</td>
                <td>{value.YeniProblemTanimi}</td>
                <td>{value.YeniHedef}</td>
                <td>{value.OncekiProblemSkoru}</td>
                <td>{value.TahminEdilenProblemSkoru}</td>
                <td>{value.DegerlendirmeTarihi}</td>
                <td>{value.DegerlendirenKullaniciAdi}</td>
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "Problem Durum Değerlendirmeyi Düzenle" : "Yeni Problem Durum Değerlendirme"}</Offcanvas.Title>
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
                  <Form.Label>Yeni Problem ID</Form.Label>
                  <Form.Select value={selectedRow["YeniProblemID"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["YeniProblemID"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled>
                    <option value="" disabled>Seçiniz...</option>
                    {problemSelect.map((value, index) => {
                      return <option key={index} value={value.ProblemTipiID}>{value.ProblemTipiID + ": " + value.ProblemTanimi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Yeni Problem Tanımı</Form.Label>
                  <Form.Control type="text" value={selectedRow["YeniProblemTanimi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["YeniProblemTanimi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Yeni Hedef</Form.Label>
                  <Form.Control type="text" value={selectedRow["YeniHedef"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["YeniHedef"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Önceki Problem Skoru</Form.Label>
                  <Row>
                    <ButtonGroup name="toggleIsNew" value={selectedRow["OncekiProblemSkoru"]} onChange={() => { }}>
                      <ToggleButton
                        type="radio" name="1" value={"1"} checked={selectedRow["OncekiProblemSkoru"] === "1"}
                        variant={selectedRow["OncekiProblemSkoru"] !== "1" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["OncekiProblemSkoru"] = "1";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >1</ToggleButton>
                      <ToggleButton
                        type="radio" name="2" value={"2"} checked={selectedRow["OncekiProblemSkoru"] === "2"}
                        variant={selectedRow["OncekiProblemSkoru"] !== "2" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["OncekiProblemSkoru"] = "2";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >2</ToggleButton>
                      <ToggleButton
                        type="radio" name="3" value={"3"} checked={selectedRow["OncekiProblemSkoru"] === "3"}
                        variant={selectedRow["OncekiProblemSkoru"] !== "3" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["OncekiProblemSkoru"] = "3";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >3</ToggleButton>
                      <ToggleButton
                        type="radio" name="4" value={"4"} checked={selectedRow["OncekiProblemSkoru"] === "4"}
                        variant={selectedRow["OncekiProblemSkoru"] !== "4" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["OncekiProblemSkoru"] = "4";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >4</ToggleButton>
                      <ToggleButton
                        type="radio" name="5" value={"5"} checked={selectedRow["OncekiProblemSkoru"] === "5"}
                        variant={selectedRow["OncekiProblemSkoru"] !== "5" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["OncekiProblemSkoru"] = "5";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >5</ToggleButton>
                    </ButtonGroup>
                  </Row>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tahmin Edilen Problem Skoru</Form.Label>
                  <Row>
                    <ButtonGroup name="toggleIsNew" value={selectedRow["TahminEdilenProblemSkoru"]} onChange={() => { }}>
                      <ToggleButton
                        type="radio" name="1" value={"1"} checked={selectedRow["TahminEdilenProblemSkoru"] === "1"}
                        variant={selectedRow["TahminEdilenProblemSkoru"] !== "1" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["TahminEdilenProblemSkoru"] = "1";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >1</ToggleButton>
                      <ToggleButton
                        type="radio" name="2" value={"2"} checked={selectedRow["TahminEdilenProblemSkoru"] === "2"}
                        variant={selectedRow["TahminEdilenProblemSkoru"] !== "2" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["TahminEdilenProblemSkoru"] = "2";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >2</ToggleButton>
                      <ToggleButton
                        type="radio" name="3" value={"3"} checked={selectedRow["TahminEdilenProblemSkoru"] === "3"}
                        variant={selectedRow["TahminEdilenProblemSkoru"] !== "3" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["TahminEdilenProblemSkoru"] = "3";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >3</ToggleButton>
                      <ToggleButton
                        type="radio" name="4" value={"4"} checked={selectedRow["TahminEdilenProblemSkoru"] === "4"}
                        variant={selectedRow["TahminEdilenProblemSkoru"] !== "4" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["TahminEdilenProblemSkoru"] = "4";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >4</ToggleButton>
                      <ToggleButton
                        type="radio" name="5" value={"5"} checked={selectedRow["TahminEdilenProblemSkoru"] === "5"}
                        variant={selectedRow["TahminEdilenProblemSkoru"] !== "5" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempSelectedRow = { ...selectedRow };
                          tempSelectedRow["TahminEdilenProblemSkoru"] = "5";
                          setSelectedRow(tempSelectedRow);
                        }}
                      >5</ToggleButton>
                    </ButtonGroup>
                  </Row>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Değerlendirme Tarihi</Form.Label>
                  <Form.Control type="text" value={selectedRow["DegerlendirmeTarihi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["DegerlendirmeTarihi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Değerlendiren Kullanıcı Adı</Form.Label>
                  <Form.Select value={selectedRow["DegerlendirenKullaniciAdi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["DegerlendirenKullaniciAdi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {kullaniciSelect.map((value, index) => {
                      return <option key={index} value={value.KullaniciAdi}>{value.KullaniciAdi}</option>
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
                  <Form.Label>Yeni Problem ID</Form.Label>
                  <Form.Select value={newRow["YeniProblemID"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["YeniProblemID"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {problemSelect.map((value, index) => {
                      return <option key={index} value={value.ProblemTipiID}>{value.ProblemTipiID + ": " + value.ProblemTanimi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Yeni Problem Tanımı</Form.Label>
                  <Form.Control type="text" value={newRow["YeniProblemTanimi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["YeniProblemTanimi"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Yeni Hedef</Form.Label>
                  <Form.Control type="text" value={newRow["YeniHedef"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["YeniHedef"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Önceki Problem Skoru</Form.Label>
                  <Row>
                    <ButtonGroup name="toggleIsNew" defaultValue={"1"} onChange={() => { }}>
                      <ToggleButton
                        type="radio" name="1" value={"1"} checked={newRow["OncekiProblemSkoru"] === "1"}
                        variant={newRow["OncekiProblemSkoru"] !== "1" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["OncekiProblemSkoru"] = "1";
                          setNewRow(tempNewRow);
                        }}
                      >1</ToggleButton>
                      <ToggleButton
                        type="radio" name="2" value={"2"} checked={newRow["OncekiProblemSkoru"] === "2"}
                        variant={newRow["OncekiProblemSkoru"] !== "2" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["OncekiProblemSkoru"] = "2";
                          setNewRow(tempNewRow);
                        }}
                      >2</ToggleButton>
                      <ToggleButton
                        type="radio" name="3" value={"3"} checked={newRow["OncekiProblemSkoru"] === "3"}
                        variant={newRow["OncekiProblemSkoru"] !== "3" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["OncekiProblemSkoru"] = "3";
                          setNewRow(tempNewRow);
                        }}
                      >3</ToggleButton>
                      <ToggleButton
                        type="radio" name="4" value={"4"} checked={newRow["OncekiProblemSkoru"] === "4"}
                        variant={newRow["OncekiProblemSkoru"] !== "4" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["OncekiProblemSkoru"] = "4";
                          setNewRow(tempNewRow);
                        }}
                      >4</ToggleButton>
                      <ToggleButton
                        type="radio" name="5" value={"5"} checked={newRow["OncekiProblemSkoru"] === "5"}
                        variant={newRow["OncekiProblemSkoru"] !== "5" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["OncekiProblemSkoru"] = "5";
                          setNewRow(tempNewRow);
                        }}
                      >5</ToggleButton>
                    </ButtonGroup>
                  </Row>                    
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tahmin Edilen Problem Skoru</Form.Label>
                  <Row>
                    <ButtonGroup name="toggleIsNew" defaultValue={"1"} onChange={() => { }}>
                      <ToggleButton
                        type="radio" name="1" value={"1"} checked={newRow["TahminEdilenProblemSkoru"] === "1"}
                        variant={newRow["TahminEdilenProblemSkoru"] !== "1" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["TahminEdilenProblemSkoru"] = "1";
                          setNewRow(tempNewRow);
                        }}
                      >1</ToggleButton>
                      <ToggleButton
                        type="radio" name="2" value={"2"} checked={newRow["TahminEdilenProblemSkoru"] === "2"}
                        variant={newRow["TahminEdilenProblemSkoru"] !== "2" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["TahminEdilenProblemSkoru"] = "2";
                          setNewRow(tempNewRow);
                        }}
                      >2</ToggleButton>
                      <ToggleButton
                        type="radio" name="3" value={"3"} checked={newRow["TahminEdilenProblemSkoru"] === "3"}
                        variant={newRow["TahminEdilenProblemSkoru"] !== "3" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["TahminEdilenProblemSkoru"] = "3";
                          setNewRow(tempNewRow);
                        }}
                      >3</ToggleButton>
                      <ToggleButton
                        type="radio" name="4" value={"4"} checked={newRow["TahminEdilenProblemSkoru"] === "4"}
                        variant={newRow["TahminEdilenProblemSkoru"] !== "4" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["TahminEdilenProblemSkoru"] = "4";
                          setNewRow(tempNewRow);
                        }}
                      >4</ToggleButton>
                      <ToggleButton
                        type="radio" name="5" value={"5"} checked={newRow["TahminEdilenProblemSkoru"] === "5"}
                        variant={newRow["TahminEdilenProblemSkoru"] !== "5" ? 'outline-dark' : 'dark'}
                        onClick={() => {
                          let tempNewRow = { ...newRow };
                          tempNewRow["TahminEdilenProblemSkoru"] = "5";
                          setNewRow(tempNewRow);
                        }}
                      >5</ToggleButton>
                    </ButtonGroup>
                  </Row>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Değerlendiren Kullanıcı Adı</Form.Label>
                  <Form.Select value={newRow["DegerlendirenKullaniciAdi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["DegerlendirenKullaniciAdi"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {kullaniciSelect.map((value, index) => {
                      return <option key={index} value={value.KullaniciAdi}>{value.KullaniciAdi}</option>
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

export default ProblemDurumDegerlendirmePage;
