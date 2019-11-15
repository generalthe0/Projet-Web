// Imports

var bcrypt    = require('bcrypt');
var jwtUtils  = require('../utils/jwt.utils');
var server = require('../server').connection;
var bcrypt = require('bcrypt');
var jwtUtils = require ('../utils/jwt.utils');
var connection = require('../sqlconnection').sqlconnection;


// Routes

module.exports = {
  
  register: function(req, res) {
    

    bcrypt.hash(req.body.password, 5, function(err, bcryptedPassword) {    
      connection.query(("INSERT INTO inscrits (nom, prenom, campus, mail, password) VALUES ('" + req.body.nom + "', '" + req.body.prenom + "', '" + req.body.campus + "', '" + req.body.mail + "', '" + bcryptedPassword +  "')"), function(error, rows, field) {
          if (!!error) {
              console.log('Requête non valide');
              return res.status(500).json("Inscription impossible");
          } else if (req.body.nom >= 13 || req.body.nom <=4 && req.body.prenom >= 13 || req.body.prenom <=4) {
              console.log('Requête non valide');
              return res.status(400).json("Inscription impossible - Nom et/ou prénom trop courts/longs");
          }
          
          else {
              console.log('Requête acceptée');
              res.redirect('http://localhost/ProjetWeb/inscriptionreussie.php')
              }
          })
      })
      },

  login: function(req, res) {
    
    connection.query("SELECT id, password, id_role FROM inscrits WHERE mail = '" + req.body.mail + "'", function(error, rows, field) {
      userStatus = rows[0].id_role;
      userID = rows[0].id;
      if (!!error) {
          console.log('Requête non valide');
      } else if (rows.length == 0) {
          res.json({message: "Utilsateur introuvable"});
      } else {
          bcrypt.compare(req.body.password, rows[0].password, function(errBycrypt, resBycrypt) {  
              if (resBycrypt) {
                return res.cookie('access_token', jwtUtils.generateTokenForUser(userID, userStatus)).redirect('http://localhost/ProjetWeb/profil.php');
              } else {
                  return res.status(403).json({ "error": "invalid password"});
              }
          })
      }
  })

},

  getUserProfile: function(req, res) {
        var headerAuth = req.headers['authorization'];
        var userID_check = jwtUtils.getUserID(headerAuth);

        if (userID_check < 0)
            return res.status(400).json({ 'error': 'wrong token', userID_check});

        else 
            connection.query(("SELECT nom, prenom, campus, mail, id_role FROM inscrits WHERE id = " + userID_check), function(error, rows, field) {
            if (!!error) {
                console.log('Requête non valide', rows);
            } else {
                res.json({'profile' :rows});   
                }
            })
        },
        
  updateUserProfile: function(req, res) {
        var headerAuth = req.body.authorization;
        var userID_check = jwtUtils.getUserID(headerAuth);

        if (userID_check < 0)
            return res.status(400).json({ 'error': 'wrong token', userID_check})

        else            

            if (req.body.nom >= 13 || req.body.nom <=4 && req.body.prenom >= 13 || req.body.prenom <=4) {
                console.log('Requête non valide');
                return res.status(400).json("Inscription impossible - Nom et/ou prénom trop courts/longs");
            }

            else if (req.body.password != req.body.passwordconfirm) {
                console.log('Les passwords ne correspondent pas');
                return res.send("Inscription impossible - Les mots de passe ne correspondent pas").redirect('http://localhost/ProjetWeb/profil.php');
            }

            else {
                bcrypt.hash(req.body.password, 5, function(err, bcryptedPassword) {
                connection.query(("UPDATE inscrits SET nom = '" + req.body.nom + "', prenom = '" + req.body.prenom + "', campus = '" + req.body.campus + "', mail = '" + req.body.mail + "', password = '" + bcryptedPassword + "' WHERE id = 35"));
                return res.redirect('http://localhost/ProjetWeb/profil.php');
                })
            }
        },    
    }