const express = require('express');
const port = 3001;
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors'); 
const path = require('path');
const multer = require('multer');
const sincronizarTabelas  = require('./src/utils/criarTabelas');

const authRoutes = require('./src/routes/authRoutes');
const notaRoutes = require('./src/routes/notaRoutes');
const projetoRoutes = require('./src/routes/projetoRoutes');
const colunaRoutes = require('./src/routes/colunaRoutes');
const utiRoutes = require('./src/routes/utiRoutes');
const utiController = require('./src/controllers/utiController');
const auth = require('./src/middlewares/decodeJWT');

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + Date.now() + ext; // Preserva a extensão original
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

// Rotas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));   
app.use('/', authRoutes);
app.use('/notas', notaRoutes);
app.use('/projetos', projetoRoutes);
app.use('/colunas', colunaRoutes);
app.use('/utilizadores', utiRoutes);

app.put('/utilizador/foto', auth, upload.single('foto'), utiController.atualizarFotoUtilizador);

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

// Sincronização de tabelas
sincronizarTabelas();
