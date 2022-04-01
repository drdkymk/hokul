const express = require("express");
const app = express();
//const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root1234",
    database: "hokul_db"
})

app.listen(3001, () => {
    console.log("running on port 3001");
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(bodyParser.urlencoded({extended:true}));

app.get("/api/", (req, res) => {
    res.send("***Company API***");
});

/***************** Tablo: Kullanicilar *****************/

app.post("/api/auth/", (req, res) => {
    const kullaniciAdi = req.body.username;
    const sifre = req.body.password;

    const sql = "SELECT * FROM Kullanicilar WHERE KullaniciAdi=? AND Sifre=?;";
    db.query(sql, [kullaniciAdi, sifre], (err, result) => {
        if (result.length > 0) {
            const sql2 = "SELECT * FROM Birimler WHERE BirimMudurKullaniciAdi=?";
            db.query(sql2, [kullaniciAdi], (err, result) => {
                if (result.length > 0) {
                    res.send({ username: kullaniciAdi, role: "Yönetici", department: result[0]["BirimKodu"] });
                }
                else {
                    const sql3 = "SELECT * FROM Personel WHERE KullaniciAdi=?";
                    db.query(sql3, [kullaniciAdi], (err, result) => {
                        if (result.length > 0) {
                            res.send({ username: kullaniciAdi, role: "Personel" });
                        }
                        else {
                            res.send({ username: kullaniciAdi, role: "Admin" });
                        }
                    });
                }
            });
        }
        else {
            res.send({});
        }
    });
});


/***************** Tablo: Kullanicilar *****************/

app.post("/api/Kullanicilar/", (req, res) => {
    const kullaniciAdi = req.body.KullaniciAdi;
    const sifre = req.body.Sifre;

    const sql = "INSERT INTO Kullanicilar (KullaniciAdi, Sifre) VALUES (?,?);";
    db.query(sql, [kullaniciAdi, sifre], (err, result) => {
        res.send(result);
    });
});

app.get("/api/Kullanicilar/", (req, res) => {
    const sql = "SELECT * FROM Kullanicilar;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/Kullanicilar/", (req, res) => {
    const kullaniciAdi = req.body.KullaniciAdi;
    const sifre = req.body.Sifre;

    const sql = "UPDATE Kullanicilar SET Sifre = ? WHERE KullaniciAdi = ?;";
    db.query(sql, [sifre, kullaniciAdi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/Kullanicilar/", (req, res) => {
    const kullaniciAdi = req.body.KullaniciAdi;
    const sql = "DELETE FROM Kullanicilar WHERE KullaniciAdi = ?;";
    db.query(sql, [kullaniciAdi], (err, result) => {
        res.send(result);
    });
});

/***************** Tablo: Personel *****************/

app.post("/api/Personel/", (req, res) => {
    const kullaniciAdi = req.body.KullaniciAdi;
    const email = req.body.Email;
    const ad = req.body.Ad;
    const soyad = req.body.Soyad;
    const sicilNo = req.body.SicilNo;
    const cep = req.body.Cep;
    const evAdresi = req.body.EvAdresi;
    const ilKodu = req.body.IlKodu;
    const ilceKodu = req.body.IlceKodu;
    const postaKodu = req.body.PostaKodu;
    const ustKullaniciAdi = req.body.UstKullaniciAdi === "-" ? null : req.body.UstKullaniciAdi;
    const calistigiBirimKodu = req.body.CalistigiBirimKodu === "-" ? null : req.body.CalistigiBirimKodu;

    const sql = "INSERT INTO Personel (KullaniciAdi, Email, Ad, Soyad, SicilNo, Cep, EvAdresi, IlKodu, IlceKodu, PostaKodu, UstKullaniciAdi, CalistigiBirimKodu) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);";
    db.query(sql, [kullaniciAdi, email, ad, soyad, sicilNo, cep, evAdresi, ilKodu, ilceKodu, postaKodu, ustKullaniciAdi, calistigiBirimKodu], (err, result) => {
        res.send(result);
    });
});

app.get("/api/Personel/", (req, res) => {
    const sql = "SELECT * FROM Personel;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/Personel/", (req, res) => {
    const kullaniciAdi = req.body.KullaniciAdi;
    const email = req.body.Email;
    const ad = req.body.Ad;
    const soyad = req.body.Soyad;
    const sicilNo = req.body.SicilNo;
    const cep = req.body.Cep;
    const evAdresi = req.body.EvAdresi;
    const ilKodu = req.body.IlKodu;
    const ilceKodu = req.body.IlceKodu;
    const postaKodu = req.body.PostaKodu;
    const ustKullaniciAdi = req.body.UstKullaniciAdi === "-" ? null : req.body.UstKullaniciAdi;
    const calistigiBirimKodu = req.body.CalistigiBirimKodu === "-" ? null : req.body.CalistigiBirimKodu;

    const sql = "UPDATE Personel SET Email = ?, Ad = ?, Soyad = ?, SicilNo = ?, Cep = ?, EvAdresi = ?, IlKodu = ?, IlceKodu = ?, PostaKodu = ?, UstKullaniciAdi = ?, CalistigiBirimKodu = ? WHERE KullaniciAdi = ?;";
    db.query(sql, [email, ad, soyad, sicilNo, cep, evAdresi, ilKodu, ilceKodu, postaKodu, ustKullaniciAdi, calistigiBirimKodu, kullaniciAdi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/Personel/", (req, res) => {
    const kullaniciAdi = req.body.KullaniciAdi;
    const sql = "DELETE FROM Personel WHERE KullaniciAdi = ?;";
    db.query(sql, [kullaniciAdi], (err, result) => {
        res.send(result);
    });
});


/***************** Tablo: Iller *****************/

app.post("/api/Iller/", (req, res) => {
    const ilKodu = req.body.IlKodu;
    const ilAdi = req.body.IlAdi;

    const sql = "INSERT INTO Iller (IlKodu, IlAdi) VALUES (?,?);";
    db.query(sql, [ilKodu, ilAdi], (err, result) => {
        res.send(result);
    });
});

app.get("/api/Iller/", (req, res) => {
    const sql = "SELECT * FROM Iller;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/Iller/", (req, res) => {
    const ilKodu = req.body.IlKodu;
    const ilAdi = req.body.IlAdi;

    const sql = "UPDATE Iller SET IlAdi = ? WHERE IlKodu = ?;";
    db.query(sql, [ilAdi, ilKodu], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/Iller/", (req, res) => {
    const ilKodu = req.body.IlKodu;
    const sql = "DELETE FROM Iller WHERE IlKodu = ?;";
    db.query(sql, [ilKodu], (err, result) => {
        res.send(result);
    });
});


/***************** Tablo: Ilceler *****************/

app.post("/api/Ilceler/", (req, res) => {
    const ilKodu = req.body.IlKodu;
    const ilceKodu = req.body.IlceKodu;
    const ilceAdi = req.body.IlceAdi;

    const sql = "INSERT INTO Ilceler (IlKodu, IlceKodu, IlceAdi) VALUES (?,?,?);";
    db.query(sql, [ilKodu, ilceKodu, ilceAdi], (err, result) => {
        res.send(result);
    });
});

app.get("/api/Ilceler/", (req, res) => {
    const sql = "SELECT * FROM Ilceler;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/Ilceler/", (req, res) => {
    const ilKodu = req.body.IlKodu;
    const ilceKodu = req.body.IlceKodu;
    const ilceAdi = req.body.IlceAdi;

    const sql = "UPDATE Ilceler SET IlceAdi = ? WHERE IlKodu = ? AND IlceKodu = ?;";
    db.query(sql, [ilceAdi, ilKodu, ilceKodu], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/Ilceler/", (req, res) => {
    const ilKodu = req.body.IlKodu;
    const ilceKodu = req.body.IlceKodu;
    const sql = "DELETE FROM Ilceler WHERE IlKodu = ? AND IlceKodu = ?;";
    db.query(sql, [ilKodu, ilceKodu], (err, result) => {
        res.send(result);
    });
});



/***************** Tablo: Birimler *****************/

app.post("/api/Birimler/", (req, res) => {
    const birimKodu = req.body.BirimKodu;
    const birimAdi = req.body.BirimAdi;
    const ustBirimKodu = req.body.UstBirimKodu === "-" ? null : req.body.UstBirimKodu;
    const bulunduguAdres = req.body.BulunduguAdres;
    const ilKodu = req.body.IlKodu;
    const ilceKodu = req.body.IlceKodu;
    const postaKodu = req.body.PostaKodu;
    const birimMudurKullaniciAdi = req.body.BirimMudurKullaniciAdi === "-" ? null : req.body.BirimMudurKullaniciAdi;

    const sql = "INSERT INTO Birimler (BirimKodu, BirimAdi, UstBirimKodu, BulunduguAdres, IlKodu, IlceKodu, PostaKodu, BirimMudurKullaniciAdi) VALUES (?,?,?,?,?,?,?,?);";
    db.query(sql, [birimKodu, birimAdi, ustBirimKodu, bulunduguAdres, ilKodu, ilceKodu, postaKodu, birimMudurKullaniciAdi], (err, result) => {
        res.send(result);
    });
});

app.get("/api/Birimler/", (req, res) => {
    const sql = "SELECT * FROM Birimler;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/Birimler/", (req, res) => {
    const birimKodu = req.body.BirimKodu;
    const birimAdi = req.body.BirimAdi;
    const ustBirimKodu = req.body.UstBirimKodu === "-" ? null : req.body.UstBirimKodu;
    const bulunduguAdres = req.body.BulunduguAdres;
    const ilKodu = req.body.IlKodu;
    const ilceKodu = req.body.IlceKodu;
    const postaKodu = req.body.PostaKodu;
    const birimMudurKullaniciAdi = req.body.BirimMudurKullaniciAdi === "-" ? null : req.body.BirimMudurKullaniciAdi;

    const sql = "UPDATE Birimler SET BirimAdi = ?, UstBirimKodu = ?, BulunduguAdres = ?, IlKodu = ?, IlceKodu = ?, PostaKodu = ?, BirimMudurKullaniciAdi = ? WHERE BirimKodu = ?;";
    db.query(sql, [birimAdi, ustBirimKodu, bulunduguAdres, ilKodu, ilceKodu, postaKodu, birimMudurKullaniciAdi, birimKodu], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/Birimler/", (req, res) => {
    const birimKodu = req.body.BirimKodu;
    const sql = "DELETE FROM Birimler WHERE BirimKodu = ?;";
    db.query(sql, [birimKodu], (err, result) => {
        res.send(result);
    });
});


/***************** Tablo: Problem *****************/

app.post("/api/Problem/", (req, res) => {
    const problemTanimi = req.body.ProblemTanimi;
    const problemiTanimlayiciAdi = req.body.ProblemiTanimlayiciAdi;
    const problemiTanimlayiciSoyadi = req.body.ProblemiTanimlayiciSoyadi;
    const problemiTanimlayiciTCNoPasaportNo = req.body.ProblemiTanimlayiciTCNoPasaportNo;
    const hedeflenenAmacTanimi = req.body.HedeflenenAmacTanimi;

    const sql = "INSERT INTO Problem (ProblemTanimi, ProblemiTanimlayiciAdi, ProblemiTanimlayiciSoyadi, ProblemiTanimlayiciTCNoPasaportNo, HedeflenenAmacTanimi) VALUES (?,?,?,?,?);";
    db.query(sql, [problemTanimi, problemiTanimlayiciAdi, problemiTanimlayiciSoyadi, problemiTanimlayiciTCNoPasaportNo, hedeflenenAmacTanimi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/Problem/", (req, res) => {
    let sql = "SELECT * FROM Problem;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.get("/api/Problem/BirimID/:id", (req, res) => {
    const birimID = req.params.id;
    const sql = "SELECT * FROM Problem,ProblemBirim WHERE ProblemTipiID = ProblemID AND BirimID = ?";
    db.query(sql, [birimID], (err, result) => {
        res.send(result);
    });
});

app.get("/api/Problem/KullaniciAdi/:id", (req, res) => {
    const kullaniciAdi = req.params.id;
    const sql = "SELECT * FROM Problem,PersonelProblem WHERE ProblemTipiID = ProblemID AND KullaniciAdi = ?";
    db.query(sql, [kullaniciAdi], (err, result) => {
        res.send(result);
    });
});

app.put("/api/Problem/", (req, res) => {
    const problemTipiID = req.body.ProblemTipiID;
    const problemTanimi = req.body.ProblemTanimi;
    const problemiTanimlayiciAdi = req.body.ProblemiTanimlayiciAdi;
    const problemiTanimlayiciSoyadi = req.body.ProblemiTanimlayiciSoyadi;
    const problemiTanimlayiciTCNoPasaportNo = req.body.ProblemiTanimlayiciTCNoPasaportNo;
    const hedeflenenAmacTanimi = req.body.HedeflenenAmacTanimi;

    const sql = "UPDATE Problem SET ProblemTanimi = ?, ProblemiTanimlayiciAdi = ?, ProblemiTanimlayiciSoyadi = ?, ProblemiTanimlayiciTCNoPasaportNo = ?, HedeflenenAmacTanimi = ? WHERE ProblemTipiID = ?;";
    db.query(sql, [problemTanimi, problemiTanimlayiciAdi, problemiTanimlayiciSoyadi, problemiTanimlayiciTCNoPasaportNo, hedeflenenAmacTanimi, problemTipiID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/Problem/", (req, res) => {
    const problemTipiID = req.body.ProblemTipiID;
    const sql = "DELETE FROM Problem WHERE ProblemTipiID = ?;";
    db.query(sql, [problemTipiID], (err, result) => {
        res.send(result);
    });
});



/***************** Tablo: ProblemBirim *****************/

app.post("/api/ProblemBirim/", (req, res) => {
    const problemID = req.body.ProblemID;
    const birimID = req.body.BirimID;

    const sql = "INSERT INTO ProblemBirim (ProblemID, BirimID) VALUES (?,?);";
    db.query(sql, [problemID, birimID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/ProblemBirim/", (req, res) => {
    const sql = "SELECT * FROM ProblemBirim;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/ProblemBirim/", (req, res) => {
    const problemID = req.body.ProblemID;
    const birimID = req.body.BirimID;
    const eslesmeTarihi = req.body.EslesmeTarihi

    const sql = "UPDATE ProblemBirim SET EslesmeTarihi = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.000Z') WHERE ProblemID = ? AND BirimID = ?;";
    db.query(sql, [eslesmeTarihi, problemID, birimID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/ProblemBirim/", (req, res) => {
    const problemID = req.body.ProblemID;
    const birimID = req.body.BirimID;
    const sql = "DELETE FROM ProblemBirim WHERE ProblemID = ? AND BirimID = ?;";
    db.query(sql, [problemID, birimID], (err, result) => {
        res.send(result);
    });
});


/***************** Tablo: Alanlar *****************/

app.post("/api/Alanlar/", (req, res) => {
    const alanAdi = req.body.AlanAdi;
    const alanTipi = req.body.AlanTipi;

    const sql = "INSERT INTO Alanlar (AlanAdi, AlanTipi) VALUES (?,?);";
    db.query(sql, [alanAdi, alanTipi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/Alanlar/", (req, res) => {
    const sql = "SELECT * FROM Alanlar;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/Alanlar/", (req, res) => {
    const alanID = req.body.AlanID;
    const alanAdi = req.body.AlanAdi;
    const alanTipi = req.body.AlanTipi;

    const sql = "UPDATE Alanlar SET AlanAdi = ?, AlanTipi = ? WHERE AlanID = ?;";
    db.query(sql, [alanAdi, alanTipi, alanID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/Alanlar/", (req, res) => {
    const alanID = req.body.AlanID;
    const sql = "DELETE FROM Alanlar WHERE AlanID = ?;";
    db.query(sql, [alanID], (err, result) => {
        res.send(result);
    });
});


/***************** Tablo: Siniflar *****************/

app.post("/api/Siniflar/", (req, res) => {
    const sinifAdi = req.body.SinifAdi;
    const sinifTipi = req.body.SinifTipi;

    const sql = "INSERT INTO Siniflar (SinifAdi, SinifTipi) VALUES (?,?);";
    db.query(sql, [sinifAdi, sinifTipi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/Siniflar/", (req, res) => {
    const sql = "SELECT * FROM Siniflar;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/Siniflar/", (req, res) => {
    const sinifID = req.body.SinifID;
    const sinifAdi = req.body.SinifAdi;
    const sinifTipi = req.body.SinifTipi;

    const sql = "UPDATE Siniflar SET SinifAdi = ?, SinifTipi = ? WHERE SinifID = ?;";
    db.query(sql, [sinifAdi, sinifTipi, sinifID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/Siniflar/", (req, res) => {
    const sinifID = req.body.SinifID;
    const sql = "DELETE FROM Siniflar WHERE SinifID = ?;";
    db.query(sql, [sinifID], (err, result) => {
        res.send(result);
    });
});

/***************** Tablo: Mudahale *****************/

app.post("/api/Mudahale/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    //const mudahaleID = req.body.MudahaleID;
    const mudahaleAdi = req.body.MudahaleAdi;

    const sql = "INSERT INTO Mudahale (AlanID, SinifID, MudahaleAdi) VALUES (?,?,?);";
    db.query(sql, [alanID, sinifID, mudahaleAdi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/Mudahale/", (req, res) => {
    const sql = "SELECT * FROM Mudahale;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/Mudahale/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const mudahaleID = req.body.MudahaleID;
    const mudahaleAdi = req.body.MudahaleAdi;

    const sql = "UPDATE Mudahale SET AlanID = ?, SinifID = ?, MudahaleAdi = ? WHERE MudahaleID = ?;";
    db.query(sql, [alanID, sinifID, mudahaleAdi, mudahaleID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/Mudahale/", (req, res) => {
    const mudahaleID = req.body.MudahaleID;
    const sql = "DELETE FROM Mudahale WHERE MudahaleID = ?;";
    db.query(sql, [mudahaleID], (err, result) => {
        res.send(result);
    });
});


/***************** Tablo: Aktiviteler *****************/

app.post("/api/Aktiviteler/", (req, res) => {
    const aktiviteTanimi = req.body.AktiviteTanimi;

    const sql = "INSERT INTO Aktiviteler (AktiviteTanimi) VALUES (?);";
    db.query(sql, [aktiviteTanimi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/Aktiviteler/", (req, res) => {
    const sql = "SELECT * FROM Aktiviteler;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/Aktiviteler/", (req, res) => {
    const aktiviteID = req.body.AktiviteID;
    const aktiviteTanimi = req.body.AktiviteTanimi;

    const sql = "UPDATE Aktiviteler SET aktiviteTanimi = ? WHERE AktiviteID = ?;";
    db.query(sql, [aktiviteTanimi, aktiviteID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/Aktiviteler/", (req, res) => {
    const aktiviteID = req.body.AktiviteID;
    const sql = "DELETE FROM Aktiviteler WHERE AktiviteID = ?;";
    db.query(sql, [aktiviteID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});


/***************** Tablo: MudahaleDetay *****************/

app.post("/api/MudahaleDetay/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const mudahaleID = req.body.MudahaleID;
    const aktiviteID = req.body.AktiviteID;
    const sira = req.body.Sira;

    const sql = "INSERT INTO MudahaleDetay (AlanID, SinifID, MudahaleID, AktiviteID, Sira) VALUES (?,?,?,?,?);";
    db.query(sql, [alanID, sinifID, mudahaleID, aktiviteID, sira], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/MudahaleDetay/", (req, res) => {
    const sql = "SELECT * FROM MudahaleDetay;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/MudahaleDetay/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const mudahaleID = req.body.MudahaleID;
    const aktiviteID = req.body.AktiviteID;
    const sira = req.body.Sira;

    const sql = "UPDATE MudahaleDetay SET Sira = ? WHERE AlanID = ? AND SinifID = ? AND MudahaleID = ? AND AktiviteID = ?;";
    db.query(sql, [sira, alanID, sinifID, mudahaleID, aktiviteID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/MudahaleDetay/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const mudahaleID = req.body.MudahaleID;
    const aktiviteID = req.body.AktiviteID;
    const sql = "DELETE FROM MudahaleDetay WHERE AlanID = ? AND SinifID = ? AND MudahaleID = ? AND AktiviteID = ?;";
    db.query(sql, [alanID, sinifID, mudahaleID, aktiviteID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});


/***************** Tablo: Cikti *****************/

app.post("/api/Cikti/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    //const ciktiID = req.body.CiktiID;
    const ciktiAdi = req.body.CiktiAdi;

    const sql = "INSERT INTO Cikti (AlanID, SinifID, CiktiAdi) VALUES (?,?,?);";
    db.query(sql, [alanID, sinifID, ciktiAdi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/Cikti/", (req, res) => {
    const sql = "SELECT * FROM Cikti;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/Cikti/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const ciktiID = req.body.CiktiID;
    const ciktiAdi = req.body.CiktiAdi;

    const sql = "UPDATE Cikti SET AlanID = ?, SinifID = ?, CiktiAdi = ? WHERE CiktiID = ?;";
    db.query(sql, [alanID, sinifID, ciktiAdi, ciktiID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/Cikti/", (req, res) => {
    const ciktiID = req.body.CiktiID;
    const sql = "DELETE FROM Cikti WHERE CiktiID = ?;";
    db.query(sql, [ciktiID], (err, result) => {
        res.send(result);
    });
});


/***************** Tablo: Belirtecler *****************/

app.post("/api/Belirtecler/", (req, res) => {
    const belirtecTanimi = req.body.BelirtecTanimi;

    const sql = "INSERT INTO Belirtecler (BelirtecTanimi) VALUES (?);";
    db.query(sql, [belirtecTanimi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/Belirtecler/", (req, res) => {
    const sql = "SELECT * FROM Belirtecler;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/Belirtecler/", (req, res) => {
    const belirtecID = req.body.BelirtecID;
    const belirtecTanimi = req.body.BelirtecTanimi;

    const sql = "UPDATE Belirtecler SET belirtecTanimi = ? WHERE BelirtecID = ?;";
    db.query(sql, [belirtecTanimi, belirtecID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/Belirtecler/", (req, res) => {
    const belirtecID = req.body.BelirtecID;
    const sql = "DELETE FROM Belirtecler WHERE BelirtecID = ?;";
    db.query(sql, [belirtecID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});


/***************** Tablo: CiktiDetay *****************/

app.post("/api/CiktiDetay/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const ciktiID = req.body.CiktiID;
    const belirtecID = req.body.BelirtecID;
    const sira = req.body.Sira;

    const sql = "INSERT INTO CiktiDetay (AlanID, SinifID, CiktiID, BelirtecID, Sira) VALUES (?,?,?,?,?);";
    db.query(sql, [alanID, sinifID, ciktiID, belirtecID, sira], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/CiktiDetay/", (req, res) => {
    const sql = "SELECT * FROM CiktiDetay;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/CiktiDetay/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const ciktiID = req.body.CiktiID;
    const belirtecID = req.body.BelirtecID;
    const sira = req.body.Sira;

    const sql = "UPDATE CiktiDetay SET Sira = ? WHERE AlanID = ? AND SinifID = ? AND CiktiID = ? AND BelirtecID = ?;";
    db.query(sql, [sira, alanID, sinifID, ciktiID, belirtecID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/CiktiDetay/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const ciktiID = req.body.CiktiID;
    const belirtecID = req.body.BelirtecID;
    const sql = "DELETE FROM CiktiDetay WHERE AlanID = ? AND SinifID = ? AND CiktiID = ? AND BelirtecID = ?;";
    db.query(sql, [alanID, sinifID, ciktiID, belirtecID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});


/////////////////////////////////////////////////////

/***************** Tablo: ProblemMudahale *****************/

app.post("/api/ProblemMudahale/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const mudahaleID = req.body.MudahaleID;
    const problemID = req.body.ProblemID;

    const sql = "INSERT INTO ProblemMudahale (AlanID, SinifID, MudahaleID, ProblemID) VALUES (?,?,?,?);";
    db.query(sql, [alanID, sinifID, mudahaleID, problemID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/ProblemMudahale/", (req, res) => {
    const sql = "SELECT * FROM ProblemMudahale;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/ProblemMudahale/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const mudahaleID = req.body.MudahaleID;
    const problemID = req.body.ProblemID;

    const sql = "UPDATE ProblemMudahale SET AlanID = ?, SinifID = ?, ProblemID = ? WHERE MudahaleID = ?;";
    db.query(sql, [alanID, sinifID, problemID, mudahaleID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/ProblemMudahale/", (req, res) => {
    const mudahaleID = req.body.MudahaleID;
    const problemID = req.body.ProblemID;
    const sql = "DELETE FROM ProblemMudahale WHERE MudahaleID = ? AND ProblemID = ?;";
    db.query(sql, [mudahaleID, problemID], (err, result) => {
        res.send(result);
    });
});


/***************** Tablo: ProblemCikti *****************/

app.post("/api/ProblemCikti/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const ciktiID = req.body.CiktiID;
    const problemID = req.body.ProblemID;

    const sql = "INSERT INTO ProblemCikti (AlanID, SinifID, CiktiID, ProblemID) VALUES (?,?,?,?);";
    db.query(sql, [alanID, sinifID, ciktiID, problemID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/ProblemCikti/", (req, res) => {
    const sql = "SELECT * FROM ProblemCikti;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/ProblemCikti/", (req, res) => {
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const ciktiID = req.body.CiktiID;
    const problemID = req.body.ProblemID;

    const sql = "UPDATE ProblemCikti SET AlanID = ?, SinifID = ?, ProblemID = ? WHERE CiktiID = ?;";
    db.query(sql, [alanID, sinifID, problemID, ciktiID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/ProblemCikti/", (req, res) => {
    const ciktiID = req.body.CiktiID;
    const problemID = req.body.ProblemID;
    const sql = "DELETE FROM ProblemCikti WHERE CiktiID = ? AND ProblemID = ?;";
    db.query(sql, [ciktiID, problemID], (err, result) => {
        res.send(result);
    });
});


/***************** Tablo: IlaveMudahaleDetay *****************/

app.post("/api/IlaveMudahaleDetay/", (req, res) => {
    const problemID = req.body.ProblemID;
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const mudahaleID = req.body.MudahaleID;
    const aktiviteID = req.body.AktiviteID;
    const sira = req.body.Sira;
    const ekleyenKullaniciAdi = req.body.EkleyenKullaniciAdi;

    const sql = "INSERT INTO IlaveMudahaleDetay (ProblemID, AlanID, SinifID, MudahaleID, AktiviteID, Sira, EkleyenKullaniciAdi) VALUES (?,?,?,?,?,?,?);";
    db.query(sql, [problemID, alanID, sinifID, mudahaleID, aktiviteID, sira, ekleyenKullaniciAdi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/IlaveMudahaleDetay/", (req, res) => {
    const sql = "SELECT * FROM IlaveMudahaleDetay;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/IlaveMudahaleDetay/", (req, res) => {
    const problemID = req.body.ProblemID;
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const mudahaleID = req.body.MudahaleID;
    const aktiviteID = req.body.AktiviteID;
    const sira = req.body.Sira;
    const ekleyenKullaniciAdi = req.body.EkleyenKullaniciAdi;
    const eklenmeTarihi = req.body.EklenmeTarihi;

    const sql = "UPDATE IlaveMudahaleDetay SET Sira = ?, EkleyenKullaniciAdi = ?, EklenmeTarihi = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.000Z') WHERE ProblemID = ? AND AlanID = ? AND SinifID = ? AND MudahaleID = ? AND AktiviteID = ?;";
    db.query(sql, [sira, ekleyenKullaniciAdi, eklenmeTarihi, problemID, alanID, sinifID, mudahaleID, aktiviteID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/IlaveMudahaleDetay/", (req, res) => {
    const problemID = req.body.ProblemID;
    const mudahaleID = req.body.MudahaleID;
    const aktiviteID = req.body.AktiviteID;
    const sql = "DELETE FROM IlaveMudahaleDetay WHERE ProblemID = ? AND MudahaleID = ? AND AktiviteID = ?;";
    db.query(sql, [problemID, mudahaleID, aktiviteID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});


/***************** Tablo: IlaveCiktiDetay *****************/

app.post("/api/IlaveCiktiDetay/", (req, res) => {
    const problemID = req.body.ProblemID;
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const ciktiID = req.body.CiktiID;
    const belirtecID = req.body.BelirtecID;
    const sira = req.body.Sira;
    const ekleyenKullaniciAdi = req.body.EkleyenKullaniciAdi;

    const sql = "INSERT INTO IlaveCiktiDetay (ProblemID, AlanID, SinifID, CiktiID, BelirtecID, Sira, EkleyenKullaniciAdi) VALUES (?,?,?,?,?,?,?);";
    db.query(sql, [problemID, alanID, sinifID, ciktiID, belirtecID, sira, ekleyenKullaniciAdi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/IlaveCiktiDetay/", (req, res) => {
    const sql = "SELECT * FROM IlaveCiktiDetay;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/IlaveCiktiDetay/", (req, res) => {
    const problemID = req.body.ProblemID;
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const ciktiID = req.body.CiktiID;
    const belirtecID = req.body.BelirtecID;
    const sira = req.body.Sira;
    const ekleyenKullaniciAdi = req.body.EkleyenKullaniciAdi;
    const eklenmeTarihi = req.body.EklenmeTarihi;

    const sql = "UPDATE IlaveCiktiDetay SET Sira = ?, EkleyenKullaniciAdi = ?, EklenmeTarihi = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.000Z') WHERE ProblemID = ? AND AlanID = ? AND SinifID = ? AND CiktiID = ? AND BelirtecID = ?;";
    db.query(sql, [sira, ekleyenKullaniciAdi, eklenmeTarihi, problemID, alanID, sinifID, ciktiID, belirtecID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/IlaveCiktiDetay/", (req, res) => {
    const problemID = req.body.ProblemID;
    const ciktiID = req.body.CiktiID;
    const belirtecID = req.body.BelirtecID;
    const sql = "DELETE FROM IlaveCiktiDetay WHERE ProblemID = ? AND CiktiID = ? AND BelirtecID = ?;";
    db.query(sql, [problemID, ciktiID, belirtecID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

/***************** Tablo: PersonelProblem *****************/

app.post("/api/PersonelProblem/", (req, res) => {
    const problemID = req.body.ProblemID;
    const kullaniciAdi = req.body.KullaniciAdi;

    const sql = "INSERT INTO PersonelProblem (ProblemID, KullaniciAdi) VALUES (?,?);";
    db.query(sql, [problemID, kullaniciAdi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/PersonelProblem/", (req, res) => {
    const sql = "SELECT * FROM PersonelProblem;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/PersonelProblem/", (req, res) => {
    const problemID = req.body.ProblemID;
    const kullaniciAdi = req.body.KullaniciAdi;

    const sql = "UPDATE PersonelProblem SET ProblemID = ? WHERE ProblemID = ? AND KullaniciAdi = ?;";
    db.query(sql, [problemID, problemID, kullaniciAdi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/PersonelProblem/", (req, res) => {
    const problemID = req.body.ProblemID;
    const kullaniciAdi = req.body.KullaniciAdi;
    const sql = "DELETE FROM PersonelProblem WHERE ProblemID = ? AND KullaniciAdi = ?;";
    db.query(sql, [problemID, kullaniciAdi], (err, result) => {
        res.send(result);
    });
});



/***************** Tablo: ProblemDurumDegerlendirme *****************/

app.post("/api/ProblemDurumDegerlendirme/", (req, res) => {
    const problemID = req.body.ProblemID;
    const yeniProblemID = req.body.YeniProblemID;
    const yeniProblemTanimi = req.body.YeniProblemTanimi;
    const yeniHedef = req.body.YeniHedef;
    const oncekiProblemSkoru = req.body.OncekiProblemSkoru;
    const tahminEdilenProblemSkoru = req.body.TahminEdilenProblemSkoru;
    const degerlendirenKullaniciAdi = req.body.DegerlendirenKullaniciAdi;

    const sql = "INSERT INTO ProblemDurumDegerlendirme (ProblemID, YeniProblemID, YeniProblemTanimi, YeniHedef, OncekiProblemSkoru, TahminEdilenProblemSkoru, DegerlendirenKullaniciAdi) VALUES (?,?,?,?,?,?,?);";
    db.query(sql, [problemID, yeniProblemID, yeniProblemTanimi, yeniHedef, oncekiProblemSkoru, tahminEdilenProblemSkoru, degerlendirenKullaniciAdi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/ProblemDurumDegerlendirme/", (req, res) => {
    const sql = "SELECT * FROM ProblemDurumDegerlendirme;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/ProblemDurumDegerlendirme/", (req, res) => {
    const problemID = req.body.ProblemID;
    const yeniProblemID = req.body.YeniProblemID;
    const yeniProblemTanimi = req.body.YeniProblemTanimi;
    const yeniHedef = req.body.YeniHedef;
    const oncekiProblemSkoru = req.body.OncekiProblemSkoru;
    const tahminEdilenProblemSkoru = req.body.TahminEdilenProblemSkoru;
    const degerlendirmeTarihi = req.body.DegerlendirmeTarihi;
    const degerlendirenKullaniciAdi = req.body.DegerlendirenKullaniciAdi;

    const sql = "UPDATE ProblemDurumDegerlendirme SET YeniProblemTanimi = ?, YeniHedef = ?, OncekiProblemSkoru = ?, TahminEdilenProblemSkoru = ?, DegerlendirmeTarihi = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.000Z'), DegerlendirenKullaniciAdi = ? WHERE ProblemID = ? AND YeniProblemID = ?;";
    db.query(sql, [yeniProblemTanimi, yeniHedef, oncekiProblemSkoru, tahminEdilenProblemSkoru, degerlendirmeTarihi, degerlendirenKullaniciAdi, problemID, yeniProblemID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/ProblemDurumDegerlendirme/", (req, res) => {
    const problemID = req.body.ProblemID;
    const yeniProblemID = req.body.YeniProblemID;
    const sql = "DELETE FROM ProblemDurumDegerlendirme WHERE ProblemID = ? AND YeniProblemID = ?;";
    db.query(sql, [problemID, yeniProblemID], (err, result) => {
        res.send(result);
    });
});



/***************** Tablo: ProblemCiktiDegerlendirme *****************/

app.post("/api/ProblemCiktiDegerlendirme/", (req, res) => {
    const problemID = req.body.ProblemID;
    const belirtecID = req.body.BelirtecID;
    const skor = req.body.Skor;

    const sql = "INSERT INTO ProblemCiktiDegerlendirme (ProblemID, BelirtecID, Skor) VALUES (?,?,?);";
    db.query(sql, [problemID, belirtecID, skor], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/ProblemCiktiDegerlendirme/", (req, res) => {
    const sql = "SELECT * FROM ProblemCiktiDegerlendirme;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.put("/api/ProblemCiktiDegerlendirme/", (req, res) => {
    const problemID = req.body.ProblemID;
    const belirtecID = req.body.BelirtecID;
    const skor = req.body.Skor;
    const skorTarihi = req.body.SkorTarihi;

    const sql = "UPDATE ProblemCiktiDegerlendirme SET Skor = ?, SkorTarihi = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.000Z') WHERE ProblemID = ? AND BelirtecID = ?;";
    db.query(sql, [skor, skorTarihi, problemID, belirtecID], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/ProblemCiktiDegerlendirme/", (req, res) => {
    const problemID = req.body.ProblemID;
    const belirtecID = req.body.BelirtecID;
    const sql = "DELETE FROM ProblemCiktiDegerlendirme WHERE ProblemID = ? AND BelirtecID = ?;";
    db.query(sql, [problemID, belirtecID], (err, result) => {
        res.send(result);
    });
});



/***************** Tablo: CalisanProblem *****************/

app.post("/api/CalisanProblem/", (req, res) => {
    const problemID = req.body.ProblemID;
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const mudahaleID = req.body.MudahaleID;
    const aktiviteID = req.body.AktiviteID;
    const aktiviteAciklama = req.body.AktiviteAciklama;
    const kullaniciAdi = req.body.KullaniciAdi;

    const sql = "INSERT INTO CalisanProblem (ProblemID, AlanID, SinifID, MudahaleID, AktiviteID, AktiviteAciklama, KullaniciAdi) VALUES (?,?,?,?,?,?,?);";
    db.query(sql, [problemID, alanID, sinifID, mudahaleID, aktiviteID, aktiviteAciklama, kullaniciAdi], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.get("/api/CalisanProblem/", (req, res) => {
    const sql = "SELECT * FROM CalisanProblem;";
    db.query(sql, (err, result) => {
        res.send(result);
    });
});

app.get("/api/CalisanProblem/BirimID/:id", (req, res) => {
    const birimID = req.params.id;
    const sql = "SELECT * FROM CalisanProblem,ProblemBirim WHERE CalisanProblem.ProblemID = ProblemBirim.ProblemID AND BirimID = ?;";
    db.query(sql, [birimID], (err, result) => {
        res.send(result);
    });
});

app.get("/api/CalisanProblem/KullaniciAdi/:id", (req, res) => {
    const kullaniciAdi = req.params.id;
    const sql = "SELECT * FROM CalisanProblem WHERE KullaniciAdi = ?;";
    db.query(sql, [kullaniciAdi], (err, result) => {
        res.send(result);
    });
});

app.put("/api/CalisanProblem/", (req, res) => {
    const problemID = req.body.ProblemID;
    const alanID = req.body.AlanID;
    const sinifID = req.body.SinifID;
    const mudahaleID = req.body.MudahaleID;
    const aktiviteID = req.body.AktiviteID;
    const aktiviteAciklama = req.body.AktiviteAciklama;
    const kullaniciAdi = req.body.KullaniciAdi;
    const tarih = req.body.Tarih;

    const sql = "UPDATE CalisanProblem SET AktiviteAciklama = ?, KullaniciAdi = ? WHERE ProblemID = ? AND AlanID = ? AND SinifID = ? AND MudahaleID = ? AND AktiviteID = ? AND Tarih = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.000Z');";
    db.query(sql, [aktiviteAciklama, kullaniciAdi, problemID, alanID, sinifID, mudahaleID, aktiviteID, tarih], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

app.delete("/api/CalisanProblem/", (req, res) => {
    const problemID = req.body.ProblemID;
    const kullaniciAdi = req.body.KullaniciAdi;
    const aktiviteAciklama = req.body.AktiviteAciklama;
    const sql = "DELETE FROM CalisanProblem WHERE ProblemID = ? AND KullaniciAdi = ? AND AktiviteAciklama = ?;";
    db.query(sql, [problemID, kullaniciAdi, aktiviteAciklama], (err, result) => {
        console.log(err);
        res.send(result);
    });
});

