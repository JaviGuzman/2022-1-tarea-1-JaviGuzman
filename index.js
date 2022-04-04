const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
let usuario = {
  username:'',
  name: '',
  age: '',
  password: ''
 };

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  
  .get('/', (req, res) => res.render('pages/index'))
  .get('/status', (req, res) => res.sendStatus(204))
  .get('/info', (req, res) => res.status(200).json({url: 'https://taller-int.herokuapp.com/'}))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM usertoken_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  .get('/users/:id', async (req, res) => {
  // fetch the data from the database, for example from MongoDB
  try {
    const users = await user_table.findbyId(req.user.id)
    // then send the data with a HTTP code
    res.status(200).send(users)
    } catch (error) {
    // or send the error
    res.status(404).send('No existe este usuario')
    }
  })
  // .get('/users/:user_id', (req, res) => res.status(200).json({user_id}))
  // GET /users/<user_id>
  

  .post('/users', function (req, res) {
    if(!req.body.username || !req.body.name || !req.body.age || !req.body.password) {
     respuesta = {
      error: true,
      codigo: 502,
      mensaje: 'El campo username, name, age y password son requeridos'
     };
    } else {
     if(usuario.username !== '' || usuario.name !== '' || usuario.age !== '' || usuario.password !== '') {
      respuesta = {
       error: true,
       codigo: 503,
       mensaje: 'El usuario ya fue creado previamente'
      };
     } else {
      usuario = {
       username: req.body.username,
       name: req.body.name,
       age: req.body.age,
       password: req.body.password
      };
      respuesta = {
       error: false,
       codigo: 200,
       mensaje: 'Usuario creado',
       respuesta: usuario
      };
     }
    }
    
    res.send(respuesta);
   })
   
  .delete('/security', (req, res) => res.sendStatus(401))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))