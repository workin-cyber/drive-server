const
   express = require("express"),
   app = express(),
   port = 3002,
   multer = require("multer"),
   fs = require("fs"),
   upload = multer()

app.use(express.json())
app.use(require("cors")())
app.use(express.urlencoded({ extended: false }))

app.get("/api/path*?", (req, res) => {
   try {
      const path = req.params[0] || ""
      const filesList = fs.readdirSync(`./root/${path}`)
      res.send(filesList)
   } catch (error) {

      console.log(error.message || error);
      res.status(500).send(error.message || error)
   }
})

app.post("/api/add/:type/path*?", (req, res) => {
   try {
      const path = req.params[0] || ""
      const type = req.params.type
      const { name, content } = req.body
      const allPath = `./root${path}/${name}`

      if (!fs.existsSync(allPath)) {
         if (type == 'file')
            fs.writeFileSync(allPath, content)
         else
            fs.mkdirSync(allPath)
      } else {
         throw `this ${type} is already exict with ${name} name`
      }

      const filesList = fs.readdirSync(`./root/${path}`)
      res.send(filesList)

   } catch (error) {
      console.log(error.message || error);
      res.status(500).send(error.message || error)
   }
})

app.post("/api/upload/path*?", upload.single('file'), (req, res) => {
   try {
      const path = req.params[0] || ""
      const { file } = req
      const allPath = `./root${path}/${file.originalname}`

      if (!fs.existsSync(allPath))
         fs.writeFileSync(allPath, file.buffer)
      else
         throw `this file is already exict with ${file.originalname} name`

      const filesList = fs.readdirSync(`./root/${path}`)
      res.send(filesList)

   } catch (error) {
      console.log(error.message || error);
      res.status(500).send(error.message || error)
   }
})

app.put("/api/rename/path*?", (req, res) => {
   const path = req.params[0]
   const { newPath } = req.body

   try {
      if (fs.existsSync(`./root${path}`))
         fs.renameSync(`./root${path}`, `./root${newPath}`)
      else
         throw `${path} not exist!`

      const newFiles = fs.readdirSync(`./root/${newPath.slice(0, newPath.lastIndexOf("/"))}`)
      res.send(newFiles)
   } catch (error) {
      console.log(error.message || error);
      res.status(500).send(error.message || error)
   }
})

app.get("/api/download/path*?", (req, res) => {
   const path = req.params[0]
   const fullPath = `./root${path}`

   try {
      res.download(fullPath)
   } catch (error) {
      console.log(error.message || error);
      res.status(500).send(error.message || error)
   }
})

app.get("/api/stats/path*?", (req, res) => {
   const path = req.params[0]
   const fullPath = `./root${path}`

   try {
      const stats = fs.statSync(fullPath)
      res.send(stats)
   } catch (error) {
      console.log(error.message || error);
      res.status(500).send(error.message || error)
   }
})

app.delete("/api/:type/delete/path*?", (req, res) => {
   const path = req.params[0]
   const fullPath = `./root${path}`
   const { type } = req.params

   console.log(fullPath, path, type);

   try {
      if (fs.existsSync(fullPath)) {
         if (type === "file")
            fs.unlinkSync(fullPath)
         else
            fs.rmdirSync(fullPath)
      } else {
         throw `this ${type} didn't exict`
      }

      const newFiles = fs.readdirSync(`${fullPath.slice(0, fullPath.lastIndexOf("/"))}`)
      res.send(newFiles)
   } catch (error) {
      console.log(error.message || error);
      res.status(500).send(error.message || error)
   }
})




app.listen(process.env.PORT || port, console.log("server runing on port - ", port))