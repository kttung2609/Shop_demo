const fs = require("fs");
const https = require("https");
const path = require("path");

// ===== DATA từ DB của bạn =====
const products = [
  { slug: "astrox-1", keyword: "badminton racket yonex astrox" },
  { slug: "arcsaber-2", keyword: "badminton racket yonex arcsaber" },
  { slug: "nanoflare-3", keyword: "badminton racket yonex nanoflare" },
  { slug: "65z-4", keyword: "yonex badminton shoes 65z" },
  { slug: "aerus-5", keyword: "yonex badminton shoes aerus" },
  { slug: "yonex-wear-6", keyword: "yonex sports shirt" },
  { slug: "yonex-accessories-7", keyword: "badminton accessories yonex" },

  { slug: "turbo-charging-8", keyword: "lining turbo charging racket" },
  { slug: "3d-calibar-9", keyword: "lining 3d calibar racket" },
  { slug: "blade-10", keyword: "lining blade racket" },
  { slug: "lining-ay-11", keyword: "lining badminton shoes" },
  { slug: "lining-ranger-12", keyword: "lining ranger shoes" },
  { slug: "lining-apparel-13", keyword: "lining sports shirt" },
  { slug: "lining-accessories-14", keyword: "lining badminton accessories" },

  { slug: "thruster-15", keyword: "victor thruster racket" },
  { slug: "bravesword-16", keyword: "victor bravesword racket" },
  { slug: "jetspeed-17", keyword: "victor jetspeed racket" },
  { slug: "victor-shoes-18", keyword: "victor badminton shoes" },
  { slug: "victor-p-19", keyword: "victor p series shoes" },
  { slug: "victor-clothing-20", keyword: "victor sports shirt" },
  { slug: "victor-accessories-21", keyword: "victor badminton accessories" },

  { slug: "ziggler-22", keyword: "apacs ziggler racket" },
  { slug: "edge-saber-23", keyword: "apacs edge saber racket" },
  { slug: "virtuoso-24", keyword: "apacs virtuoso racket" },
  { slug: "apacs-shoes-25", keyword: "apacs badminton shoes" },
  { slug: "apacs-trainer-26", keyword: "apacs trainer shoes" },
  { slug: "apacs-wear-27", keyword: "apacs sports shirt" },
  { slug: "apacs-accessories-28", keyword: "apacs badminton accessories" },

  { slug: "fortius-29", keyword: "mizuno fortius racket" },
  { slug: "altius-30", keyword: "mizuno altius racket" },
  { slug: "speedflex-31", keyword: "mizuno speedflex racket" },
  { slug: "wave-fang-32", keyword: "mizuno wave fang shoes" },
  { slug: "gate-sky-33", keyword: "mizuno gate sky shoes" },
  { slug: "mizuno-apparel-34", keyword: "mizuno sports shirt" },
  { slug: "mizuno-accessories-35", keyword: "mizuno badminton accessories" }
];

// ===== Tạo folder uploads =====
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ===== Hàm tải ảnh từ Unsplash =====
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      console.log(res.statusCode, url);
      // 🔥 HANDLE REDIRECT
      if (res.statusCode === 302 || res.statusCode === 301) {
        return downloadImage(res.headers.location, filepath)
          .then(resolve)
          .catch(reject);
      }

      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);

      fileStream.on("finish", () => {
        fileStream.close();
        resolve();
      });

    }).on("error", reject);
  });
};

// ===== RUN =====
(async () => {
  for (let p of products) {
    const url = `https://source.unsplash.com/600x600/?${encodeURIComponent(p.keyword)}`;
    const filepath = path.join("uploads", `${p.slug}.jpg`);

    console.log("Downloading:", p.slug);
    await downloadImage(url, filepath);
  }

  console.log("DONE DOWNLOAD 🔥");
})();