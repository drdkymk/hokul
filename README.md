Kurulum:
1. Projeyi klonlayın. "git clone https://github.com/drdkymk/hokul"
2. Bilgisayarınıza node.js ve npm kurun.
3. Php versiyonunuz 8'in altındaysa güncelleyin. "php -v" komutu ile  güncel sürümünüzü görebilirsiniz.
4. https://www.mysql.com/products/workbench/ linkinden MySQL Workbench programını indirip kurun.
5. MySQL Workbench ile bir tane şema oluşturun, projedeki notsistemi_db.sql dosyasını bu şemaya import edin.
6. Projedeki server/.env dosyasındaki 11.satırda yer alan veritabanı bilgilerini oluşturduğunuz veritabanı ile güncelleyin.
7. Terminalde proje dizininde "cd server" komutu ile servera gidin ve "composer update" komutunu çalıştırın.
8. Terminalde server dizininde "php artisan server" komutu ile serverı başlatın.
9. İkinci bir terminal açın ve proje dizinine gidin, "cd client" ile client klasörüne gidin.
10. Bu dizinde "npm i" komutu ile paket kurulumlarını başlatın.
11. Kurulum bittikten sonra "npm start" komutu ile uygulamayı başlatın.
12. localhost:3000 adresine girerek kullanmaya başlayabilirsiniz.

---Kayıtlı Kullanıcı---
Kullanıcı adı: admin
Şifre: admin