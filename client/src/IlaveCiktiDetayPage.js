import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Button, Offcanvas, Form, Table, Row, Col, Alert } from "react-bootstrap";

import Axios from 'axios';
import { getCurrentUser } from './services/auth.service';


function IlaveCiktiDetayPage() {
  const [problemSelect, setProblemSelect] = useState([]);
  const [ciktiSelect, setCiktiSelect] = useState([]);
  const [belirtecSelect, setBelirtecSelect] = useState([]);
  const [kullaniciSelect, setKullaniciSelect] = useState([]);

  const [newRow, setNewRow] = useState({
    ProblemID: "", AlanID: "", SinifID: "", CiktiID: "", BelirtecID: "", Sira: "", EkleyenKullaniciAdi: "", EklenmeTarihi: ""
  });
  const [searchRow, setSearchRow] = useState({
    ProblemID: "", AlanID: "", SinifID: "", CiktiID: "", BelirtecID: "", Sira: "", EkleyenKullaniciAdi: "", EklenmeTarihi: ""
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
    Axios.post("http://localhost:3001/api/IlaveCiktiDetay/", newRow)
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
    Axios.put("http://localhost:3001/api/IlaveCiktiDetay", selectedRow)
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
    Axios.delete("http://localhost:3001/api/IlaveCiktiDetay", {
      data: {
        ProblemID: selectedRow["ProblemID"],
        AlanID: selectedRow["AlanID"],
        SinifID: selectedRow["SinifID"],
        CiktiID: selectedRow["CiktiID"],
        BelirtecID: selectedRow["BelirtecID"]
      }
    })
      .then((response) => {
        setUpdate(!update);
        togglePanel();

      });
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/api/IlaveCiktiDetay/")
      .then((response) => {
        setRows(response.data);
      });
  }, [update]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/Problem/BirimID/" + getCurrentUser().department)
      .then((response) => {
        setProblemSelect(response.data);
      });
    Axios.get("http://localhost:3001/api/Cikti/")
      .then((response) => {
        setCiktiSelect(response.data);
      });
    Axios.get("http://localhost:3001/api/Belirtecler/")
      .then((response) => {
        setBelirtecSelect(response.data);
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
          </Form.Group>
        </Col>
        <Col><h3> İlave Çıktı Detay </h3></Col>
        <Col>
          <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
            setNewRow({
              ProblemID: "", AlanID: "", SinifID: "", CiktiID: "", BelirtecID: "", Sira: "", EkleyenKullaniciAdi: "", EklenmeTarihi: ""
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
            <th>Çıktı ID</th>
            <th>Belirteç ID</th>
            <th>Sıra</th>
            <th>Ekleyen Kullanıcı</th>
            <th>Eklenme Tarihi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                ProblemID: "", AlanID: "", SinifID: "", CiktiID: "", BelirtecID: "", Sira: "", EkleyenKullaniciAdi: "", EklenmeTarihi: ""
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
            <td><Form.Control size="sm" type="text" value={searchRow["CiktiID"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["CiktiID"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["BelirtecID"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["BelirtecID"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["Sira"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["Sira"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["EkleyenKullaniciAdi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["EkleyenKullaniciAdi"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["EklenmeTarihi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["EklenmeTarihi"] = e.target.value;
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
                <td>{value.CiktiID}</td>
                <td>{value.BelirtecID}</td>
                <td>{value.Sira}</td>
                <td>{value.EkleyenKullaniciAdi}</td>
                <td>{value.EklenmeTarihi}</td>
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "İlave Çıktı Detayı Düzenle" : "Yeni İlave Çıktı Detay"}</Offcanvas.Title>
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
                  <Form.Label>Çıktı ID</Form.Label>
                  <Form.Select value={selectedRow["CiktiID"].length === 0 ? "" : selectedRow["CiktiID"] + "," + selectedRow["AlanID"] + "," + selectedRow["SinifID"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    const values = e.target.value.split(",");
                    tempSelectedRow["CiktiID"] = values[0];
                    tempSelectedRow["AlanID"] = values[1];
                    tempSelectedRow["SinifID"] = values[2];
                    setSelectedRow(tempSelectedRow);
                  }} disabled>
                    <option value="" disabled>Seçiniz...</option>
                    {ciktiSelect.map((value, index) => {
                      return <option key={index} value={value.CiktiID + "," + value.AlanID + "," + value.SinifID}>{value.CiktiID + ": " + value.CiktiAdi}</option>
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
                  <Form.Label>Sıra</Form.Label>
                  <Form.Control type="text" value={selectedRow["Sira"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["Sira"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ekleyen Kullanıcı Adı</Form.Label>
                  <Form.Select value={selectedRow["EkleyenKullaniciAdi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["EkleyenKullaniciAdi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled>
                    <option value="" disabled>Seçiniz...</option>
                    {kullaniciSelect.map((value, index) => {
                      return <option key={index} value={value.KullaniciAdi}>{value.KullaniciAdi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Eklenme Tarihi</Form.Label>
                  <Form.Control type="text" value={selectedRow["EklenmeTarihi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["EklenmeTarihi"] = e.target.value;
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
                  <Form.Label>Çıktı ID</Form.Label>
                  <Form.Select value={newRow["CiktiID"].length === 0 ? "" : newRow["CiktiID"] + "," + newRow["AlanID"] + "," + newRow["SinifID"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    const values = e.target.value.split(",");
                    tempNewRow["CiktiID"] = values[0];
                    tempNewRow["AlanID"] = values[1];
                    tempNewRow["SinifID"] = values[2];
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {ciktiSelect.map((value, index) => {
                      return <option key={index} value={value.CiktiID + "," + value.AlanID + "," + value.SinifID}>{value.CiktiID + ": " + value.CiktiAdi}</option>
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
                  <Form.Label>Sıra</Form.Label>
                  <Form.Control type="text" value={newRow["Sira"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["Sira"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ekleyen Kullanıcı Adı</Form.Label>
                  <Form.Select value={newRow["EkleyenKullaniciAdi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["EkleyenKullaniciAdi"] = e.target.value;
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

export default IlaveCiktiDetayPage;
