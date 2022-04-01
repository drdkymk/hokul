import { useState, useEffect } from 'react';
import './App.css';
import { FaPlus } from 'react-icons/fa';
import { BiEditAlt } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { CgPlayListRemove } from 'react-icons/cg';

import { Button, ToggleButton, ButtonGroup, Offcanvas, Form, Table, Row, Col, Alert } from "react-bootstrap";

import Axios from 'axios';
import { sha256 } from 'js-sha256';
import { getCurrentUser } from './services/auth.service';



function PersonelPage() {
  const [isNew, setIsNew] = useState(false);
  const [illerSelect, setIllerSelect] = useState([]);
  const [ilcelerSelect, setIlcelerSelect] = useState([]);
  const [birimlerSelect, setBirimlerSelect] = useState([]);
  const [kullanicilarSelect, setKullanicilarSelect] = useState([]);

  const [newRow, setNewRow] = useState({
    KullaniciAdi: "", Sifre: "", Email: "", Ad: "", Soyad: "", SicilNo: "", Cep: "",
    EvAdresi: "", IlKodu: "", IlceKodu: "", PostaKodu: "", UstKullaniciAdi: "", CalistigiKullaniciAdi: ""
  });
  const [searchRow, setSearchRow] = useState({
    KullaniciAdi: "", Sifre: "", Email: "", Ad: "", Soyad: "", SicilNo: "", Cep: "",
    EvAdresi: "", IlKodu: "", IlceKodu: "", PostaKodu: "", UstKullaniciAdi: "", CalistigiKullaniciAdi: ""
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
    if (isNew) {
      if(!isPasswordValid(newRow["Sifre"])){
        setShowToast(true);
        return;
      }
      Axios.post("http://localhost:3001/api/Kullanicilar/", { KullaniciAdi: newRow.KullaniciAdi, Sifre: sha256(newRow.Sifre)})
      .then((response) => {
          if (response.data === "") {
            setShowToast(true);
            return;
          }
          Axios.post("http://localhost:3001/api/Personel/", newRow)
            .then((response) => {
              if (response.data === "") {
                setShowToast(true);
                return;
              }
              setUpdate(!update);
              togglePanel();
            });
        });
    }
    else {
      Axios.post("http://localhost:3001/api/Personel/", newRow)
        .then((response) => {
          if (response.data === "") {
            setShowToast(true);
            return;
          }
          setUpdate(!update);
          togglePanel();
        });
    }
  }

  const updateRow = () => {
    Axios.put("http://localhost:3001/api/Personel", selectedRow)
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
    Axios.delete("http://localhost:3001/api/Personel", { data: { KullaniciAdi: selectedRow["KullaniciAdi"] } })
      .then((response) => {
        setUpdate(!update);
        togglePanel();

      });
  }

  useEffect(() => {
    Axios.get("http://localhost:3001/api/Personel/")
      .then((response) => {
        setRows(response.data);
      });
      Axios.get("http://localhost:3001/api/Kullanicilar/") // her crud isleminde guncellenmeli
      .then((response) => {
        setKullanicilarSelect(response.data);
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
    Axios.get("http://localhost:3001/api/Birimler/")
      .then((response) => {
        setBirimlerSelect(response.data);
      });
  }, []);

  const isPasswordValid = (password) => {
    if(password.length < 8 || password.toLowerCase() === password || !password.match(/[.,:!?]/)){
      return false;
    }
    return true;
  }

  if(!getCurrentUser() || getCurrentUser().role !== "Admin"){
    return <></>;
  }
  return (
    <div className="App">
      <Row>
        <Col></Col>
        <Col><h3> Personel </h3></Col>
        <Col>
          <Button className="float-end mt-1 me-4 mb-1" size="sm" variant="dark" onClick={() => {
            setNewRow({
              KullaniciAdi: "", Sifre: "", Email: "", Ad: "", Soyad: "", SicilNo: "", Cep: "",
              EvAdresi: "", IlKodu: "", IlceKodu: "", PostaKodu: "", UstKullaniciAdi: "", CalistigiKullaniciAdi: ""
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
            <th>Kullanıcı Adı</th>
            <th>Email</th>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Sicil No</th>
            <th>Cep</th>
            <th>Ev Adresi</th>
            <th>İl Kodu</th>
            <th>İlçe Kodu</th>
            <th>Posta Kodu</th>
            <th>Üst Kullanıcı Adı</th>
            <th>Çalıştığı Birim Kodu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><Button size="sm" variant="light" onClick={() => {
              setSearchRow({
                KullaniciAdi: "", Sifre: "", Email: "", Ad: "", Soyad: "", SicilNo: "", Cep: "",
                EvAdresi: "", IlKodu: "", IlceKodu: "", PostaKodu: "", UstKullaniciAdi: "", CalistigiKullaniciAdi: ""
              });
            }}><CgPlayListRemove /></Button></td>
            <td><Form.Control size="sm" type="text" value={searchRow["KullaniciAdi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["KullaniciAdi"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} />
            </td>
            <td><Form.Control size="sm" type="text" value={searchRow["Email"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["Email"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["Ad"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["Ad"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["Soyad"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["Soyad"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["SicilNo"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["SicilNo"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["Cep"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["Cep"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["EvAdresi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["EvAdresi"] = e.target.value;
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
            <td><Form.Control size="sm" type="text" value={searchRow["UstKullaniciAdi"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["UstKullaniciAdi"] = e.target.value;
              setSearchRow(tempSearchRow);
            }} /></td>
            <td><Form.Control size="sm" type="text" value={searchRow["CalistigiBirimKodu"]} onChange={(e) => {
              let tempSearchRow = { ...searchRow };
              tempSearchRow["CalistigiBirimKodu"] = e.target.value;
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
                <td>{value.KullaniciAdi}</td>
                <td>{value.Email}</td>
                <td>{value.Ad}</td>
                <td>{value.Soyad}</td>
                <td>{value.SicilNo}</td>
                <td>{value.Cep}</td>
                <td>{value.EvAdresi}</td>
                <td>{value.IlKodu}</td>
                <td>{value.IlceKodu}</td>
                <td>{value.PostaKodu}</td>
                <td>{value.UstKullaniciAdi}</td>
                <td>{value.CalistigiBirimKodu}</td>
              </tr>
          })}
        </tbody>
      </Table>

      <Offcanvas show={show} placement="end" onHide={togglePanel}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{isEdit ? "Personeli Düzenle" : "Yeni Personel"}</Offcanvas.Title>
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
                  <Form.Label>Kullanıcı Adı</Form.Label>
                  <Form.Control type="text" value={selectedRow["KullaniciAdi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["KullaniciAdi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} disabled />
                </Form.Group>
                {/* <Form.Group className="mb-3">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control type="text" value={selectedRow["Sifre"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["Sifre"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group> */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="text" value={selectedRow["Email"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["Email"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ad</Form.Label>
                  <Form.Control type="text" value={selectedRow["Ad"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["Ad"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Soyad</Form.Label>
                  <Form.Control type="text" value={selectedRow["Soyad"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["Soyad"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Sicil No</Form.Label>
                  <Form.Control type="text" value={selectedRow["SicilNo"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["SicilNo"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Cep</Form.Label>
                  <Form.Control type="text" value={selectedRow["Cep"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["Cep"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ev Adresi</Form.Label>
                  <Form.Control type="text" value={selectedRow["EvAdresi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["EvAdresi"] = e.target.value;
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
                  <Form.Label>Üst Kullanıcı Adı</Form.Label>
                  <Form.Select value={selectedRow["UstKullaniciAdi"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["UstKullaniciAdi"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    <option value="-">-</option>
                    {rows.map((value, index) => {
                      return <option key={index} value={value.KullaniciAdi}>{value.KullaniciAdi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Çalıştığı Birim Kodu</Form.Label>
                  <Form.Select value={selectedRow["CalistigiBirimKodu"]} onChange={(e) => {
                    let tempSelectedRow = { ...selectedRow };
                    tempSelectedRow["CalistigiBirimKodu"] = e.target.value;
                    setSelectedRow(tempSelectedRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    <option value="-">-</option>
                    {birimlerSelect.map((value, index) => {
                      return <option key={index} value={value.BirimKodu}>{value.BirimKodu + ":" + value.BirimAdi}</option>
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
                <div style={{ textAlign: "center", justifyContent: "center" }}>
                  <Form.Group className="mb-3">
                    <ButtonGroup name="toggleIsNew" defaultValue={"new"} onChange={() => {
                      setIsNew(!isNew);
                    }}>
                      <ToggleButton
                        type="radio" name="existed" value={false} checked={isNew === false}
                        variant={isNew ? 'outline-dark' : 'dark'}
                        onClick={() => { setIsNew(false); }}
                      >Var Olan Kullanıcı</ToggleButton>
                      <ToggleButton
                        type="radio" name="new" value={true} checked={isNew === true}
                        variant={isNew ? 'dark' : 'outline-dark'}
                        onClick={() => { setIsNew(true); }}
                      > Yeni Kullanıcı </ToggleButton>
                    </ButtonGroup>
                  </Form.Group>
                </div>
                {isNew
                  ? <div><Form.Group className="mb-3">
                    <Form.Label>Kullanıcı Adı</Form.Label>
                    <Form.Control type="text" value={newRow["KullaniciAdi"]} onChange={(e) => {
                      let tempNewRow = { ...newRow };
                      tempNewRow["KullaniciAdi"] = e.target.value;
                      setNewRow(tempNewRow);
                    }} required />
                  </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Şifre</Form.Label>
                      <Form.Control type="text" value={newRow["Sifre"]} onChange={(e) => {
                        let tempNewRow = { ...newRow };
                        tempNewRow["Sifre"] = e.target.value;
                        setNewRow(tempNewRow);
                      }} required />
                    </Form.Group> </div>
                  : <Form.Group className="mb-3">
                    <Form.Label>Kullanıcı Adı</Form.Label>
                    <Form.Select value={newRow["KullaniciAdi"]} onChange={(e) => {
                      let tempNewRow = { ...newRow };
                      tempNewRow["KullaniciAdi"] = e.target.value;
                      setNewRow(tempNewRow);
                    }} required>
                      <option value="" disabled>Seçiniz...</option>
                      {kullanicilarSelect.map((value, index) => {
                        return !rows.map((value) => value.KullaniciAdi).includes(value.KullaniciAdi) && <option key={index} value={value.KullaniciAdi}>{value.KullaniciAdi}</option>
                      })}
                    </Form.Select>
                  </Form.Group>}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="text" value={newRow["Email"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["Email"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ad</Form.Label>
                  <Form.Control type="text" value={newRow["Ad"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["Ad"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Soyad</Form.Label>
                  <Form.Control type="text" value={newRow["Soyad"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["Soyad"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Sicil No</Form.Label>
                  <Form.Control type="text" value={newRow["SicilNo"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["SicilNo"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Cep</Form.Label>
                  <Form.Control type="text" value={newRow["Cep"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["Cep"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Ev Adresi</Form.Label>
                  <Form.Control type="text" value={newRow["EvAdresi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["EvAdresi"] = e.target.value;
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
                  <Form.Label>Üst Kullanıcı Adı</Form.Label>
                  <Form.Select value={newRow["UstKullaniciAdi"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["UstKullaniciAdi"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    <option value="-">-</option>
                    {rows.map((value, index) => {
                      return <option key={index} value={value.KullaniciAdi}>{value.KullaniciAdi}</option>
                    })}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Çalıştığı Birim Kodu</Form.Label>
                  <Form.Select value={newRow["CalistigiBirimKodu"]} onChange={(e) => {
                    let tempNewRow = { ...newRow };
                    tempNewRow["CalistigiBirimKodu"] = e.target.value;
                    setNewRow(tempNewRow);
                  }} required>
                    <option value="" disabled>Seçiniz...</option>
                    <option value="-">-</option>
                    {birimlerSelect.map((value, index) => {
                      return <option key={index} value={value.BirimKodu}>{value.BirimKodu + ":" + value.BirimAdi}</option>
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

export default PersonelPage;
