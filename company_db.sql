CREATE TABLE `Aktiviteler` (
  `AktiviteID` int NOT NULL AUTO_INCREMENT,
  `AktiviteTanimi` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`AktiviteID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Alanlar` (
  `AlanID` int NOT NULL AUTO_INCREMENT,
  `AlanAdi` varchar(45) NOT NULL,
  `AlanTipi` tinyint(1) NOT NULL,
  PRIMARY KEY (`AlanID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Belirtecler` (
  `BelirtecID` int NOT NULL AUTO_INCREMENT,
  `BelirtecTanimi` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`BelirtecID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Birimler` (
  `BirimKodu` varchar(45) NOT NULL,
  `BirimAdi` varchar(45) NOT NULL,
  `UstBirimKodu` varchar(45) DEFAULT NULL,
  `BulunduguAdres` varchar(45) NOT NULL,
  `IlKodu` varchar(45) NOT NULL,
  `IlceKodu` varchar(45) NOT NULL,
  `PostaKodu` varchar(45) NOT NULL,
  `BirimMudurKullaniciAdi` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`BirimKodu`),
  KEY `fk1_idx` (`UstBirimKodu`),
  KEY `fk2_idx` (`BirimMudurKullaniciAdi`),
  CONSTRAINT `birimler_fk1` FOREIGN KEY (`UstBirimKodu`) REFERENCES `Birimler` (`BirimKodu`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `birimler_fk2` FOREIGN KEY (`BirimMudurKullaniciAdi`) REFERENCES `Kullanicilar` (`KullaniciAdi`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Cikti` (
  `CiktiID` int NOT NULL AUTO_INCREMENT,
  `AlanID` int DEFAULT NULL,
  `SinifID` int DEFAULT NULL,
  `CiktiAdi` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`CiktiID`),
  KEY `fk1_idx` (`AlanID`),
  KEY `cikti_fk2_idx` (`SinifID`),
  CONSTRAINT `cikti_fk1` FOREIGN KEY (`AlanID`) REFERENCES `Alanlar` (`AlanID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `cikti_fk2` FOREIGN KEY (`SinifID`) REFERENCES `Siniflar` (`SinifID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `CiktiDetay` (
  `AlanID` int NOT NULL,
  `SinifID` int NOT NULL,
  `CiktiID` int NOT NULL,
  `BelirtecID` int NOT NULL,
  `Sira` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`AlanID`,`SinifID`,`CiktiID`,`BelirtecID`),
  KEY `ciktidetay_fk2_idx` (`SinifID`),
  KEY `ciktidetay_fk3_idx` (`CiktiID`),
  KEY `ciktidetay_fk4_idx` (`BelirtecID`),
  CONSTRAINT `ciktidetay_fk1` FOREIGN KEY (`AlanID`) REFERENCES `Alanlar` (`AlanID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ciktidetay_fk2` FOREIGN KEY (`SinifID`) REFERENCES `Siniflar` (`SinifID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ciktidetay_fk3` FOREIGN KEY (`CiktiID`) REFERENCES `Cikti` (`CiktiID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ciktidetay_fk4` FOREIGN KEY (`BelirtecID`) REFERENCES `Belirtecler` (`BelirtecID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Ilceler` (
  `IlKodu` varchar(45) NOT NULL,
  `IlceKodu` varchar(45) NOT NULL,
  `IlceAdi` varchar(45) NOT NULL,
  PRIMARY KEY (`IlKodu`,`IlceKodu`),
  CONSTRAINT `ilceler_fk1` FOREIGN KEY (`IlKodu`) REFERENCES `Iller` (`IlKodu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Iller` (
  `IlKodu` varchar(45) NOT NULL,
  `IlAdi` varchar(45) NOT NULL,
  PRIMARY KEY (`IlKodu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Kullanicilar` (
  `KullaniciAdi` varchar(45) NOT NULL,
  `Sifre` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`KullaniciAdi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Mudahale` (
  `MudahaleID` int NOT NULL AUTO_INCREMENT,
  `AlanID` int DEFAULT NULL,
  `SinifID` int DEFAULT NULL,
  `MudahaleAdi` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`MudahaleID`),
  KEY `mudahale_fk1_idx` (`AlanID`),
  KEY `mudahale_fk2_idx` (`SinifID`),
  CONSTRAINT `mudahale_fk1` FOREIGN KEY (`AlanID`) REFERENCES `Alanlar` (`AlanID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mudahale_fk2` FOREIGN KEY (`SinifID`) REFERENCES `Siniflar` (`SinifID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `MudahaleDetay` (
  `AlanID` int NOT NULL,
  `SinifID` int NOT NULL,
  `MudahaleID` int NOT NULL,
  `AktiviteID` int NOT NULL,
  `Sira` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`AlanID`,`SinifID`,`MudahaleID`,`AktiviteID`),
  KEY `mudahaledetay_fk2_idx` (`SinifID`),
  KEY `mudahaledetay_fk_idx` (`MudahaleID`),
  KEY `mudahaledetay_fk4_idx` (`AktiviteID`),
  CONSTRAINT `mudahaledetay_fk1` FOREIGN KEY (`AlanID`) REFERENCES `Alanlar` (`AlanID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mudahaledetay_fk2` FOREIGN KEY (`SinifID`) REFERENCES `Siniflar` (`SinifID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mudahaledetay_fk3` FOREIGN KEY (`MudahaleID`) REFERENCES `Mudahale` (`MudahaleID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mudahaledetay_fk4` FOREIGN KEY (`AktiviteID`) REFERENCES `Aktiviteler` (`AktiviteID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Personel` (
  `KullaniciAdi` varchar(45) NOT NULL,
  `Email` varchar(45) NOT NULL,
  `Ad` varchar(45) NOT NULL,
  `Soyad` varchar(45) NOT NULL,
  `SicilNo` varchar(45) NOT NULL,
  `Cep` varchar(45) NOT NULL,
  `EvAdresi` varchar(45) NOT NULL,
  `IlKodu` varchar(45) DEFAULT NULL,
  `IlceKodu` varchar(45) NOT NULL,
  `PostaKodu` varchar(45) NOT NULL,
  `UstKullaniciAdi` varchar(45) DEFAULT NULL,
  `CalistigiBirimKodu` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`KullaniciAdi`),
  UNIQUE KEY `Email_UNIQUE` (`Email`),
  UNIQUE KEY `SicilNo_UNIQUE` (`SicilNo`),
  KEY `personel_fk1_idx` (`UstKullaniciAdi`),
  KEY `personel_fk2_idx` (`CalistigiBirimKodu`),
  KEY `personel_fk3_idx` (`IlKodu`),
  KEY `personel_fk4_idx` (`IlceKodu`),
  CONSTRAINT `personel_fk1` FOREIGN KEY (`UstKullaniciAdi`) REFERENCES `Kullanicilar` (`KullaniciAdi`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `personel_fk2` FOREIGN KEY (`CalistigiBirimKodu`) REFERENCES `Birimler` (`BirimKodu`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `personel_fk3` FOREIGN KEY (`IlKodu`) REFERENCES `Iller` (`IlKodu`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Problem` (
  `ProblemTipiID` int NOT NULL AUTO_INCREMENT,
  `ProblemTanimi` varchar(45) NOT NULL,
  `ProblemiTanimlayiciAdi` varchar(45) NOT NULL,
  `ProblemiTanimlayiciSoyadi` varchar(45) NOT NULL,
  `ProblemiTanimlayiciTCNoPasaportNo` varchar(45) NOT NULL,
  `HedeflenenAmacTanimi` varchar(45) NOT NULL,
  PRIMARY KEY (`ProblemTipiID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ProblemBirim` (
  `ProblemID` int NOT NULL,
  `BirimID` varchar(45) NOT NULL,
  `EslesmeTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ProblemID`,`BirimID`),
  KEY `problembirim_fk2_idx` (`BirimID`),
  CONSTRAINT `problembirim_fk1` FOREIGN KEY (`ProblemID`) REFERENCES `Problem` (`ProblemTipiID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `problembirim_fk2` FOREIGN KEY (`BirimID`) REFERENCES `Birimler` (`BirimKodu`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Siniflar` (
  `SinifID` int NOT NULL AUTO_INCREMENT,
  `SinifAdi` varchar(45) NOT NULL,
  `SinifTipi` varchar(45) NOT NULL,
  PRIMARY KEY (`SinifID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `CalisanProblem` (
  `ProblemID` int NOT NULL,
  `KullaniciAdi` varchar(45) NOT NULL,
  `AlanID` int DEFAULT NULL,
  `SinifID` int DEFAULT NULL,
  `MudahaleID` int DEFAULT NULL,
  `AktiviteID` int DEFAULT NULL,
  `AktiviteAciklama` varchar(45) DEFAULT NULL,
  `Tarih` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ProblemID`,`Tarih`,`KullaniciAdi`),
  KEY `calisanproblem_fk2_idx` (`KullaniciAdi`),
  KEY `calisanproblem_fk3_idx` (`AlanID`),
  KEY `calisanproblem_fk4_idx` (`SinifID`),
  KEY `calisanproblem_fk5_idx` (`MudahaleID`),
  KEY `calisanproblem_fk6_idx` (`AktiviteID`),
  CONSTRAINT `calisanproblem_fk1` FOREIGN KEY (`ProblemID`) REFERENCES `Problem` (`ProblemTipiID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `calisanproblem_fk2` FOREIGN KEY (`KullaniciAdi`) REFERENCES `Personel` (`KullaniciAdi`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `calisanproblem_fk3` FOREIGN KEY (`AlanID`) REFERENCES `Alanlar` (`AlanID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `calisanproblem_fk4` FOREIGN KEY (`SinifID`) REFERENCES `Siniflar` (`SinifID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `calisanproblem_fk5` FOREIGN KEY (`MudahaleID`) REFERENCES `Mudahale` (`MudahaleID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `calisanproblem_fk6` FOREIGN KEY (`AktiviteID`) REFERENCES `Aktiviteler` (`AktiviteID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `IlaveCiktiDetay` (
  `ProblemID` int NOT NULL,
  `AlanID` int NOT NULL,
  `SinifID` int NOT NULL,
  `CiktiID` int NOT NULL,
  `BelirtecID` int NOT NULL,
  `Sira` int DEFAULT NULL,
  `EkleyenKullaniciAdi` varchar(45) DEFAULT NULL,
  `EklenmeTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ProblemID`,`AlanID`,`SinifID`,`CiktiID`,`BelirtecID`),
  KEY `ilaveciktidetay_fk2_idx` (`AlanID`),
  KEY `ilaveciktidetay_fk3_idx` (`SinifID`),
  KEY `ilaveciktidetay_fk4_idx` (`CiktiID`),
  KEY `ilaveciktidetay_fk5_idx` (`BelirtecID`),
  KEY `ilaveciktidetay_fk6_idx` (`EkleyenKullaniciAdi`),
  CONSTRAINT `ilaveciktidetay_fk1` FOREIGN KEY (`ProblemID`) REFERENCES `Problem` (`ProblemTipiID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ilaveciktidetay_fk2` FOREIGN KEY (`AlanID`) REFERENCES `Alanlar` (`AlanID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ilaveciktidetay_fk3` FOREIGN KEY (`SinifID`) REFERENCES `Siniflar` (`SinifID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ilaveciktidetay_fk4` FOREIGN KEY (`CiktiID`) REFERENCES `Cikti` (`CiktiID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ilaveciktidetay_fk5` FOREIGN KEY (`BelirtecID`) REFERENCES `Belirtecler` (`BelirtecID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ilaveciktidetay_fk6` FOREIGN KEY (`EkleyenKullaniciAdi`) REFERENCES `Personel` (`KullaniciAdi`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `IlaveMudahaleDetay` (
  `ProblemID` int NOT NULL,
  `AlanID` int NOT NULL,
  `SinifID` int NOT NULL,
  `MudahaleID` int NOT NULL,
  `AktiviteID` int NOT NULL,
  `Sira` int DEFAULT NULL,
  `EkleyenKullaniciAdi` varchar(45) DEFAULT NULL,
  `EklenmeTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ProblemID`,`AlanID`,`SinifID`,`MudahaleID`,`AktiviteID`),
  KEY `ilavemudahaledetay_fk2_idx` (`AlanID`),
  KEY `ilavemudahaledetay_fk3_idx` (`SinifID`),
  KEY `ilavemudahaledetay_fk4_idx` (`MudahaleID`),
  KEY `ilavemudahaledetay_fk5_idx` (`AktiviteID`),
  KEY `ilavemudahaledetay_fk6_idx` (`EkleyenKullaniciAdi`),
  CONSTRAINT `ilavemudahaledetay_fk1` FOREIGN KEY (`ProblemID`) REFERENCES `Problem` (`ProblemTipiID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ilavemudahaledetay_fk2` FOREIGN KEY (`AlanID`) REFERENCES `Alanlar` (`AlanID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ilavemudahaledetay_fk3` FOREIGN KEY (`SinifID`) REFERENCES `Siniflar` (`SinifID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ilavemudahaledetay_fk4` FOREIGN KEY (`MudahaleID`) REFERENCES `Mudahale` (`MudahaleID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ilavemudahaledetay_fk5` FOREIGN KEY (`AktiviteID`) REFERENCES `Aktiviteler` (`AktiviteID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ilavemudahaledetay_fk6` FOREIGN KEY (`EkleyenKullaniciAdi`) REFERENCES `Personel` (`KullaniciAdi`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `PersonelProblem` (
  `ProblemID` int NOT NULL,
  `KullaniciAdi` varchar(45) NOT NULL,
  PRIMARY KEY (`ProblemID`,`KullaniciAdi`),
  KEY `personelproblem_fk2_idx` (`KullaniciAdi`),
  CONSTRAINT `personelproblem_fk1` FOREIGN KEY (`ProblemID`) REFERENCES `Problem` (`ProblemTipiID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `personelproblem_fk2` FOREIGN KEY (`KullaniciAdi`) REFERENCES `Personel` (`KullaniciAdi`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ProblemCikti` (
  `AlanID` int NOT NULL,
  `SinifID` int NOT NULL,
  `CiktiID` int NOT NULL,
  `ProblemID` int NOT NULL,
  PRIMARY KEY (`AlanID`,`SinifID`,`CiktiID`,`ProblemID`),
  KEY `problemcikti_fk2_idx` (`SinifID`),
  KEY `problemcikti_fk3_idx` (`CiktiID`),
  KEY `problemcikti_fk4_idx` (`ProblemID`),
  CONSTRAINT `problemcikti_fk1` FOREIGN KEY (`AlanID`) REFERENCES `Alanlar` (`AlanID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `problemcikti_fk2` FOREIGN KEY (`SinifID`) REFERENCES `Siniflar` (`SinifID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `problemcikti_fk3` FOREIGN KEY (`CiktiID`) REFERENCES `Cikti` (`CiktiID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `problemcikti_fk4` FOREIGN KEY (`ProblemID`) REFERENCES `Problem` (`ProblemTipiID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ProblemCiktiDegerlendirme` (
  `ProblemID` int NOT NULL,
  `BelirtecID` int NOT NULL,
  `Skor` int DEFAULT NULL,
  `SkorTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ProblemID`,`BelirtecID`),
  KEY `problemciktidegerlendirme_fk2_idx` (`BelirtecID`),
  CONSTRAINT `problemciktidegerlendirme_fk1` FOREIGN KEY (`ProblemID`) REFERENCES `Problem` (`ProblemTipiID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `problemciktidegerlendirme_fk2` FOREIGN KEY (`BelirtecID`) REFERENCES `Belirtecler` (`BelirtecID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ProblemDurumDegerlendirme` (
  `ProblemID` int NOT NULL,
  `YeniProblemID` int NOT NULL,
  `YeniProblemTanimi` varchar(45) DEFAULT NULL,
  `YeniHedef` varchar(45) DEFAULT NULL,
  `OncekiProblemSkoru` int DEFAULT NULL,
  `TahminEdilenProblemSkoru` int DEFAULT NULL,
  `DegerlendirmeTarihi` datetime DEFAULT CURRENT_TIMESTAMP,
  `DegerlendirenKullaniciAdi` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ProblemID`,`YeniProblemID`),
  KEY `problemdurumdegerlendirme_fk2_idx` (`YeniProblemID`),
  KEY `problemdurumdegerlendirme_fk3_idx` (`DegerlendirenKullaniciAdi`),
  CONSTRAINT `problemdurumdegerlendirme_fk1` FOREIGN KEY (`ProblemID`) REFERENCES `Problem` (`ProblemTipiID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `problemdurumdegerlendirme_fk2` FOREIGN KEY (`YeniProblemID`) REFERENCES `Problem` (`ProblemTipiID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `problemdurumdegerlendirme_fk3` FOREIGN KEY (`DegerlendirenKullaniciAdi`) REFERENCES `Personel` (`KullaniciAdi`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ProblemMudahale` (
  `AlanID` int NOT NULL,
  `SinifID` int NOT NULL,
  `MudahaleID` int NOT NULL,
  `ProblemID` int NOT NULL,
  PRIMARY KEY (`AlanID`,`SinifID`,`MudahaleID`,`ProblemID`),
  KEY `problemmudahale_fk2_idx` (`SinifID`),
  KEY `problemmudahale_fk3_idx` (`MudahaleID`),
  KEY `problemmudahale_fk4_idx` (`ProblemID`),
  CONSTRAINT `problemmudahale_fk1` FOREIGN KEY (`AlanID`) REFERENCES `Alanlar` (`AlanID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `problemmudahale_fk2` FOREIGN KEY (`SinifID`) REFERENCES `Siniflar` (`SinifID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `problemmudahale_fk3` FOREIGN KEY (`MudahaleID`) REFERENCES `Mudahale` (`MudahaleID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `problemmudahale_fk4` FOREIGN KEY (`ProblemID`) REFERENCES `Problem` (`ProblemTipiID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Kullanicilar` VALUES ('Admin','f4035833cb911a3e8634903e498ff84b05d4b66f73c6155af3f58b22ad3503f4'),('Ahmet','cb97a170b6a40a49bfbecde684be77faa63adc37a1fdb051f486c13bbf3d3faa'),('Ayşe','bbd70ae8f6b230efaceafc9c89d577abd7147c21446afb9cc310d71da69711a2'),('Derda','ba78dc40568e595bad33cc5f171aa132ba36c45e458a709584e885358727e25f');
INSERT INTO `Personel` VALUES ('Ahmet','ahmet@gmail.com','Ahmet','Yılmaz','66422358952','05433256843','Tobb Etu konukevi','06','101','06560',NULL,NULL),('Ayşe','ayse@gmail.com','Ayşe','Özdemir','23513789534','05347453454','Denizevleri Mah. 234. Sk. Yılmaz Apt.','01','101','01101','Ahmet','B007');
INSERT INTsO `Aktiviteler` VALUES (5,'Motor bakımı yapılacak'),(6,'Farların bakımı yapılacak'),(7,'Tekerler kontrol edilecek');
INSERT INTO `Alanlar` VALUES (4,'Alan 1',0),(5,'Alan 2',0),(6,'Alan 3',0),(7,'Alan 4',1),(8,'Alan 5',1),(9,'Alan 6',1);
INSERT INTO `Belirtecler` VALUES (5,'Motor bakımı yapıldı'),(6,'Farların bakımı yapıldı'),(7,'Tekerler kontrol edildi');
INSERT INTO `Birimler` VALUES ('B007','Bakım','Y001','Bestepe, Sogutozu Cd. 12 B','55','200','06530','Ayşe'),('Y001','Yönetim',NULL,'Bestepe, Sogutozu Cd. 12 B','06','101','06560',NULL);
INSERT INTO `CalisanProblem` VALUES (4,'Ahmet',4,2,4,5,'bakım tamamlandı','2021-11-21 22:59:54'),(4,'Ahmet',4,2,4,6,'ilerleme kaydedildi','2021-11-21 23:00:11');
INSERT INTO `Cikti` VALUES (3,4,2,'Araç bakımı yapıldı');
INSERT INTO `CiktiDetay` VALUES (4,2,3,5,'1'),(4,2,3,6,'2');
INSERT INTO `IlaveCiktiDetay` VALUES (4,4,2,3,7,3,'Ayşe','2021-11-21 22:57:51');
INSERT INTO `IlaveMudahaleDetay` VALUES (4,4,2,4,7,3,'Ayşe','2021-11-21 22:57:39');
INSERT INTO `Iller` VALUES ('01','Adana'),('02','Adıyaman'),('03','Afyon'),('04','Ağrı'),('05','Amasya'),('06','Ankara'),('34','İstanbul'),('35','İzmir'),('55','Samsun');
INSERT INTO `Ilceler` VALUES ('01','100','Ceyhan'),('01','101','Seyhan'),('06','100','Çankaya'),('06','101','Yenimahalle'),('55','200','Atakum'),('55','300','Çarşamba');
INSERT INTO `Mudahale` VALUES (4,4,2,'Araç bakımı yapılacak');
INSERT INTO `MudahaleDetay` VALUES (4,2,4,5,'1'),(4,2,4,6,'2');
INSERT INTO `PersonelProblem` VALUES (4,'Ahmet'),(5,'Ahmet');
INSERT INTO `Problem` VALUES (4,'Araç bakımı zamanı geldi','Mehmet','Kaya','34545678643','bakım yapılmalı'),(5,'Araç muayenesi yapılmalı','Ali','Yılmaz','34746554321',''),(6,'Parça değişimi gerekli','Selin','Demir','22469575275',''),(7,'Araç yıkanacak','Sıla','Özdemir','66474668634','');
INSERT INTO `ProblemBirim` VALUES (4,'B007','2021-11-21 22:55:03'),(5,'B007','2021-11-21 22:55:07'),(6,'B007','2021-11-21 22:55:12');
INSERT INTO `ProblemCikti` VALUES (4,2,3,4);
INSERT INTO `ProblemCiktiDegerlendirme` VALUES (4,5,3,'2021-11-21 19:58:27'),(5,6,5,'2021-11-21 22:58:39');
INSERT INTO `ProblemMudahale` VALUES (4,2,4,4);
INSERT INTO `Siniflar` VALUES (2,'Sınıf 1',0),(3,'Sınıf 2',0),(4,'Sınıf 3',0),(5,'Sınıf 4',1),(6,'Sınıf 5',1),(7,'Sınıf 5',1);
