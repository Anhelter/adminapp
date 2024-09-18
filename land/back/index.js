require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
//const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuración de la API de Linode
const API_TOKEN = 'b993a798849d711eba978ea90000a198a5d2c4d32cbb02f6b5a37aee1302b427';
const DOMAIN_ID = '3096080'; // ID de tu dominio en Linode
const IP_ADDRESS = '172.233.171.253'; // IP pública de tu servidor Linode


const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER, //|| 'tu_usuario',
    host: process.env.DB_HOST, //|| 'localhost',
    database: process.env.DB_NAME, //|| 'tu_base_de_datos',
    password: process.env.DB_PASSWORD, //|| 'tu_contraseña',
    port: process.env.DB_PORT, //|| 5432,
});

// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET; //|| 'tu_clave_secreta';

// Ruta para registrar usuarios (opcional)
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
            [username, hashedPassword]
        );
        res.json({ userId: result.rows[0].id });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Ruta para registrar usuarios (opcional)
// index.js (Backend)

app.post('/api/register-client', authenticateToken, async (req, res) => {
    const { companyName, instanceNumber, companyId } = req.body;
  
    try {
      // Verifica si el cliente ya existe
      const existingClient = await pool.query(
        'SELECT * FROM companies WHERE company_id = $1',
        [companyId]
      );
  
      if (existingClient.rows.length > 0) {
        return res.status(400).json({ error: 'El cliente ya existe' });
      }
  
      // Inserta el nuevo cliente en la base de datos
      const result = await pool.query(
        'INSERT INTO companies (company_name, instance_number, company_id) VALUES ($1, $2, $3) RETURNING id',
        [companyName, instanceNumber, companyId]
      );
  
      res.json({ message: 'Cliente registrado exitosamente', clientId: result.rows[0].id });
    } catch (err) {
      console.error('Error al registrar el cliente:', err);
      res.status(500).json({ error: 'Error al registrar el cliente' });
    }
  });
  

// Ruta para obtener la lista de empresas (clientes)
app.get('/api/clients', authenticateToken, async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM companies');
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener los clientes:', err);
      res.status(500).json({ error: 'Error al obtener los clientes' });
    }
  });
  

// Ruta para iniciar sesión
app.post('/api/login', async (req, res) => {
    console.log('Solicitud recibida en /api/login');
    const { username, password } = req.body;
    console.log('Datos recibidos:', { username, password });
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        console.log('Resultado de la consulta:', result.rows);

        if (result.rows.length === 0) {
            console.log('Usuario no encontrado');
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        console.log('Resultado de bcrypt.compare:', match);

        if (!match) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: '1h',
        });
        console.log('Token generado:', token);
        res.json({ token });
    } catch (err) {
        console.error('Error en /api/login:', err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});


// Middleware para verificar JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Función para crear un subdominio utilizando la API de Linode
async function crearSubdominio(subdominio) {
    try {
        const response = await axios.post(`https://api.linode.com/v4/domains/${DOMAIN_ID}/records`, {
            type: 'A',
            name: subdominio,
            target: IP_ADDRESS,
            ttl_sec: 300
        }, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200 || response.status === 201) {
            return `Subdominio ${subdominio} creado exitosamente.`;
        } else {
            throw new Error(`Error al crear el subdominio: ${response.data}`);
        }
    } catch (error) {
        throw new Error(`Error al crear el subdominio: ${error.message}`);
    }
}

// Función para configurar Nginx para un nuevo subdominio
function configurarNginx(subdominio, puerto) {
    const nginxConfig = `
    server {
        listen 80;
        server_name ${subdominio}.anhelterhub.online;

        location / {
            proxy_pass http://localhost:${puerto};
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }`;

    const configPath = `/etc/nginx/sites-available/${subdominio}.conf`;

    fs.writeFileSync(configPath, nginxConfig);
	
	    // Crear un enlace simbólico para habilitar el sitio en Nginx
    exec(`ln -s ${configPath} /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al configurar Nginx: ${stderr}`);
        } else {
            console.log(`Nginx configurado correctamente: ${stdout}`);
        }
    });
}

// Ruta protegida para validar empresa y ejecutar script
const { exec } = require('child_process');

app.post('/api/validate-company', authenticateToken, async (req, res) => {
    const { companyName, instanceNumber, companyId } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM companies WHERE company_name = $1 AND instance_number = $2 AND company_id = $3',
            [companyName, instanceNumber, companyId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Empresa no existe' });
        }else{
            console.log('Empresa si existe se ejecutaria script');
            res.json({ message: 'Empresa si existe se ejecutaria script' });
            return res.status(200).json({ Exito: 'Empresa si existe' });
        }

        // const numeroInstancia = instanceNumber;
        // const subdominio = `crm${numeroInstancia}`;
        // const portOffset = parseInt(numeroInstancia, 10);

        // const command = `
        // INSTANCE_NAME="crm${numeroInstancia}";
        // NGINX_CONTAINER="nginx${numeroInstancia}";
        // BACKEND_CONTAINER="back-end${numeroInstancia}";
        // DB_CONTAINER="db${numeroInstancia}";
        // FRONTEND_CONTAINER="front-end${numeroInstancia}";
        // NETWORK_NAME="node-network${numeroInstancia}";
        // PORT_OFFSET=${numeroInstancia};

        // INSTANCE_PATH="/home/gcorzo/instances/$INSTANCE_NAME";
        // mkdir -p $INSTANCE_PATH;

        // mkdir -p $INSTANCE_PATH/data;
        // mkdir -p $INSTANCE_PATH/init-scripts;
        // mkdir -p $INSTANCE_PATH/node;
        // mkdir -p $INSTANCE_PATH/react;
        // mkdir -p $INSTANCE_PATH/nginx;

        // cp -r /home/gcorzo/crm/crm2/* $INSTANCE_PATH/;
        // cp /home/gcorzo/crm/crm2/init-scripts/init.sql $INSTANCE_PATH/init-scripts/;

        // sed -i "s/db1/$DB_CONTAINER/g" $INSTANCE_PATH/docker-compose.yml;
        // sed -i "s/back-end1/$BACKEND_CONTAINER/g" $INSTANCE_PATH/docker-compose.yml;
        // sed -i "s/front-end1/$FRONTEND_CONTAINER/g" $INSTANCE_PATH/docker-compose.yml;
        // sed -i "s/nginx1/$NGINX_CONTAINER/g" $INSTANCE_PATH/docker-compose.yml;

        // sed -i "s/front-end:5173/front-end${portOffset}:5173/g" $INSTANCE_PATH/nginx/default.conf;
        // sed -i "s/back-end:3000/back-end${portOffset}:3000/g" $INSTANCE_PATH/nginx/default.conf;

        // sed -i "s/host: 'db1'/host: '$DB_CONTAINER'/g" $INSTANCE_PATH/node/index.js;
        // sed -i "s/app.listen(3000,/app.listen($((${portOffset} + 3000)),/g" $INSTANCE_PATH/node/index.js;

        // sed -i "s/5433:5432/$((${portOffset} + 5432)):5432/g" $INSTANCE_PATH/docker-compose.yml;
        // sed -i "s/3001:3000/$((${portOffset} + 3000)):3000/g" $INSTANCE_PATH/docker-compose.yml;
        // sed -i "s/5174:5173/$((${portOffset} + 5173)):5173/g" $INSTANCE_PATH/docker-compose.yml;
        // sed -i "s/8001:80/$((${portOffset} + 8000)):80/g" $INSTANCE_PATH/docker-compose.yml;

        // sed -i "s/node-network1/$NETWORK_NAME/g" $INSTANCE_PATH/docker-compose.yml;

        // cd $INSTANCE_PATH;
        // sudo docker compose up -d;
        // `;

        // // Ejecutar el comando bash para crear la instancia
        // exec(command, async (error, stdout, stderr) => {
        //     if (error) {
        //         //res.status(500).send(`Error al crear la instancia: ${stderr}`);
        //         console.error(`Error al ejecutar el script: ${stderr}`);
        //         return res.status(500).json({ error: `Error al crear la instancia: ${stderr}` });
        //     } else {
        //         try {
        //             // Crear el subdominio utilizando la API de Linode
        //             const subdominioResult = await crearSubdominio(subdominio);

        //             // Configurar Nginx para el nuevo subdominio
        //             const puertoNginx = portOffset + 8000;
        //             configurarNginx(subdominio, puertoNginx);

        //             res.json(`Instancia CRM${numeroInstancia} creada exitosamente. ${subdominioResult}`);
        //         } catch (e) {
        //             res.status(500).send(e.message);
        //         }
        //     }
        // });

        // Ejecutar el script aquí
        //exec('bash /ruta/a/tu/script.sh', (error, stdout, stderr) => {
        //     if (error) {
        //         console.error(`Error al ejecutar el script: ${stderr}`);
        //         return res.status(500).json({ error: 'Error al ejecutar el script' });
        //     }
        //     res.json({ message: 'Empresa validada y script ejecutado' });
        // });
    } catch (err) {
        res.status(500).json({ error: 'Error al validar empresa' });
    }
});

// index.js (Backend)

// Ruta para obtener estadísticas
app.get('/api/stats', authenticateToken, async (req, res) => {
    try {
      // Obtén el total de clientes
      const clientsResult = await pool.query('SELECT COUNT(*) FROM companies');
      const totalClients = clientsResult.rows[0].count;
  
      // Obtén el número de instancias activas (suponiendo que tienes una forma de determinar esto)
      const instancesResult = await pool.query('SELECT COUNT(*) FROM companies WHERE estado = \'A\'');
      const activeInstances = instancesResult.rows[0].count;
  
      // Obtén el número de tareas pendientes (ajusta según tu esquema)
      const tasksResult = await pool.query('SELECT COUNT(*) FROM tasks WHERE status = \'pending\'');
      const pendingTasks = tasksResult.rows[0].count;
  
      res.json({
        totalClients,
        activeInstances,
        pendingTasks,
      });
    } catch (err) {
      console.error('Error al obtener las estadísticas:', err);
      res.status(500).json({ error: 'Error al obtener las estadísticas' });
    }
  });
  

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
