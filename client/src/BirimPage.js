import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Button, Offcanvas, Form, Table, Row, Col, Alert } from "react-bootstrap";

import Axios from 'axios';
import { getCurrentUser } from './services/auth.service';


function BirimPage() {
  const [illerSelect, setIllerSelect] = useState([]);
  const [ilcelerSelect, setIlcelerSelect] = useState([]);
  const [kullanicilarSelect, setKullanicilarSelect] = useState([]);

  const [newRow, setNewRow] = useState({
    BirimKodu: "", BirimAdi: "", UstBirimKodu: "", BulunduguAdres: "",
    IlKodu: "", IlceKodu: "", PostaKodu: "", BirimMudurKullaniciAdi: ""
  });
  const [searchRow, setSearchRow] = useState({
    BirimKodu: "", BirimAdi: "", UstBirimKodu: "", BulunduguAdres: "",
    IlKodu: "", IlceKodu: "", PostaKodu: "", BirimMudurKullaniciAdi: ""
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
    Axios.post("http://localhost:3001/api/Birimler/", newRow)
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
    Axios.put("http://localhost:3001/api/Birimler", selectedRow)
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
    Axios.delete("http://localhost:3001/api/Birimler", { data: { BirimKodu: selectedRow["BirimKodu"] } })
      .then((response) => {
        setUpdate(!update);
        togglePanel();

      });
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/api/Birimler/")
      .then((response) => {
        setRows(response.data);
      });
  }, [update]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/Iller/")
      .then((response) => {
        setIllerSelect(response.data);
      });
    Axios.get("http://localhost:3001/api/Ilceler/")
      .then((response) => {
        setIlcelerSelect(response.data);
      });
    Axios.get("http://localhost:3001/api/Personel/")
      .then((response) => {
        setKullanicilarSelect(response.data);
      });
  }, []);

  if(!getCurrentUser() || getCurrentUser().role !== "Admin"){
    return <></>;
  }
  return (
    <div className="App">
      <Row>
        <Col></Col>
        <Col><h3> Birim </h3></Col>
        <Col>
          <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
            setNewRow({
              BirimKodu: "", BirimAdi: "", UstBirimKodu: "", BulunduguAdres: "",
              IlKodu: "", IlceKodu: "", PostaKodu: "", BirimMudurKullaniciAdi: ""
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
            <th>Birim Kodu</th>
            <th>Birim Adı</th>
            <th>Üst Birim Kodu</th>
            <th>Bulunduğu Adres</th>
            <th>İl Kodu</th>
            <th>İlçe Kodu</th>
            <th>Posta Kodu</th>
            <th>Birim Müdür Kullanıcı Adı</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                BirimKodu: "", BirimAdi: "", UstBirimKodu: "", BulunduguAdres: "",
                IlKodu: "", IlceKodu: "", PostaKodu: "", BirimMudurKullaniciAdi: ""
              });
            }}><CgPlayListRemove /></Button></td>
            <td><Form.Control size="sm" type="text" value={searchRow["BirimKodu"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["BirimKodu"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} />
            </td>
            <td><Form.Control size="sm" type="text" value={searchRow["BirimAdi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["BirimAdi"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["UstBirimKodu"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["UstBirimKodu"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["BulunduguAdres"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["BulunduguAdres"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["IlKodu"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["IlKodu"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["IlceKodu"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["IlceKodu"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["PostaKodu"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["PostaKodu"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["BirimMudurKullaniciAdi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["BirimMudurKullaniciAdi"] = e.target.value;
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
                <td>{value.BirimKodu}</td>
                <td>{value.BirimAdi}</td>
                <td>{value.UstBirimKodu}</td>
                <td>{value.BulunduguAdres}</td>
                <td>{value.IlKodu}</td>
                <td>{value.IlceKodu}</td>
                <td>{value.PostaKodu}</td>
                <td>{value.BirimMudurKullaniciAdi}</td>
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "Birimi Düzenle" : "Yeni Birim"}</Offcanvas.Title>
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
                  <Form.Label>Birim Kodu</Form.Label>
                  <Form.Control type="text" value={selectedRow["BirimKodu"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["BirimKodu"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Birim Adı</Form.Label>
                  <Form.Control type="text" value={selectedRow["BirimAdi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["BirimAdi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Üst Birim Kodu</Form.Label>
                  <Form.Select value={selectedRow["UstBirimKodu"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["UstBirimKodu"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    <option value="">-</option>
                    {rows.map((value, index) => {
                      return <option key={index} value={value.BirimKodu}>{value.BirimKodu + ": " + value.BirimAdi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Bulunduğu Adres</Form.Label>
                  <Form.Control type="text" value={selectedRow["BulunduguAdres"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["BulunduguAdres"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>İl Kodu</Form.Label>
                  <Form.Select value={selectedRow["IlKodu"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["IlKodu"] = e.target.value;
                    tempSelectedRow["IlceKodu"] = "";
                    setSelectedRow(tempSelectedRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {illerSelect.map((value, index) => {
                      return <option key={index} value={value.IlKodu}>{value.IlKodu + ": " + value.IlAdi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>İlçe Kodu</Form.Label>
                  <Form.Select value={selectedRow["IlceKodu"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["IlceKodu"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {ilcelerSelect.map((value, index) => {
                      // eslint-disable-next-line
                      return value.IlKodu == selectedRow["IlKodu"] && <option key={index} value={value.IlceKodu}>{value.IlceKodu + ": " + value.IlceAdi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Posta Kodu</Form.Label>
                  <Form.Control type="text" value={selectedRow["PostaKodu"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["PostaKodu"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Birim Müdür Kullanıcı Adı</Form.Label>
                  <Form.Select value={selectedRow["BirimMudurKullaniciAdi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["BirimMudurKullaniciAdi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    <option value="-">-</option>
                    {kullanicilarSelect.map((value, index) => {
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
                  <Form.Label>Birim Kodu</Form.Label>
                  <Form.Control type="text" value={newRow["BirimKodu"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["BirimKodu"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Birim Adı</Form.Label>
                  <Form.Control type="text" value={newRow["BirimAdi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["BirimAdi"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Üst Birim Kodu</Form.Label>
                  <Form.Select value={newRow["UstBirimKodu"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["UstBirimKodu"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    <option value="-">-</option>
                    {rows.map((value, index) => {
                      return <option key={index} value={value.BirimKodu}>{value.BirimKodu + ": " + value.BirimAdi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Bulunduğu Adres</Form.Label>
                  <Form.Control type="text" value={newRow["BulunduguAdres"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["BulunduguAdres"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>İl Kodu</Form.Label>
                  <Form.Select value={newRow["IlKodu"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["IlKodu"] = e.target.value;
                    tempNewRow["IlceKodu"] = "";
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {illerSelect.map((value, index) => {
                      return <option key={index} value={value.IlKodu}>{value.IlKodu + ": " + value.IlAdi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>İlçe Kodu</Form.Label>
                  <Form.Select value={newRow["IlceKodu"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["IlceKodu"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    {ilcelerSelect.map((value, index) => {
                      // eslint-disable-next-line
                      return value.IlKodu == newRow["IlKodu"] && <option key={index} value={value.IlceKodu}>{value.IlceKodu + ": " + value.IlceAdi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Posta Kodu</Form.Label>
                  <Form.Control type="text" value={newRow["PostaKodu"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["PostaKodu"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Birim Müdür Kullanıcı Adı</Form.Label>
                  <Form.Select value={newRow["BirimMudurKullaniciAdi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["BirimMudurKullaniciAdi"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    <option value="-">-</option>
                    {kullanicilarSelect.map((value, index) => {
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

export default BirimPage;
