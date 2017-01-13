angular.module('servicioDB', ['ionic', 'ngCordova'])
    .factory('databaseFtr', databaseFtr);

databaseFtr.$inject = ['$cordovaSQLite'];

function databaseFtr($cordovaSQLite) {

    return {

        crearDB: function() {

            var db;

            db = $cordovaSQLite.openDB({
                name: "patologias.db",
                location: 'default'
            });

            return db;

        },

        crearTablas: function(db) {

            var tablaPersona, tablaTelefono;

            tablaPersona = "CREATE TABLE IF NOT EXISTS Persona(cedula INTEGER PRIMARY KEY, nombre TEXT, apellido TEXT)";
            tablaTelefono = "CREATE TABLE IF NOT EXISTS Telefono(numero INTEGER PRIMARY KEY, cedula_tel INTEGER, FOREIGN KEY(cedula_tel) REFERENCES Persona(cedula))";

            $cordovaSQLite.execute(db, tablaPersona);
            $cordovaSQLite.execute(db, tablaTelefono);

        },

        insertarTablas: function(db) {

            var datosPersona, datosTelefono, insertarPersona, insertarTelefono, largoPer, largoTel, i, j;

            datosPersona = [{
                cedula: 123456,
                nombre: "pepe",
                apellido: "perez"
            }, {
                cedula: 789123,
                nombre: "juan",
                apellido: "martinez"
            }];

            datosTelefono = [{
                numero: 3002002,
                cedula: 123456
            }, {
                numero: 6998877,
                cedula: 123456
            }, {
                numero: 5896547,
                cedula: 123456
            }, {
                numero: 556633,
                cedula: 789123
            }, {
                numero: 778899,
                cedula: 789123
            }];

            insertarPersona = "INSERT INTO Persona(cedula, nombre, apellido) VALUES(?,?,?)";
            insertarTelefono = "INSERT INTO Telefono(numero, cedula_tel) VALUES(?,?)";

            largoPer = datosPersona.length;
            largoTel = datosTelefono.length;

            for (i = 0; i < largoPer; i++) {
                $cordovaSQLite.execute(db, insertarPersona, [datosPersona[i].cedula, datosPersona[i].nombre, datosPersona[i].apellido]);
            }

            for (j = 0; j < largoTel; j++) {
                $cordovaSQLite.execute(db, insertarTelefono, [datosTelefono[j].numero, datosTelefono[j].cedula]);
            }

        },

        consultarDatos: function(db) {

            var consultaPersona, largo_persona, i, j, fila, persona, personas, datosPersona;

            consultaPersona = "SELECT nombre, apellido FROM Persona";
            personas = [];

            datosPersona = $cordovaSQLite.execute(db, consultaPersona, []).then(function(resultado) {

                largo_persona = resultado.rows.length;
                fila = resultado.rows.item;

                for (i = 0; i < largo_persona; i++) {

                    persona = {
                        nombre: fila(i).nombre,
                        apellido: fila(i).apellido
                    }

                    personas.push(persona);
                }

                return personas;
            });

            return datosPersona;
        },

        /*    consultaTelefono: function(db) {

                var consultaTelefono;
                consultaTelefono = "SELECT * FROM Telefono";

                $cordovaSQLite.execute(db, consultaTelefono, []).then(function(resultado) {
                    alert("Largo de la consulta Telefono" + " " + resultado.rows.length);
                });
            }, */

        consultaMixta: function(db, numeroCedula) {

            var consultaTotal, largo_consulta, mensaje, fila, usuario, usuarios, datos;

            usuarios = [];

            //consultaTotal = "SELECT Persona.nombre, Persona.apellido FROM Persona INNER JOIN Telefono ON Persona.cedula = Telefono.cedula_tel WHERE(((Persona.cedula) = ?))";
            consultaTotal = "SELECT Telefono.numero FROM Persona INNER JOIN Telefono ON Persona.cedula = Telefono.cedula_tel WHERE (((Persona.cedula)=?));"

            var datos = $cordovaSQLite.execute(db, consultaTotal, [numeroCedula]).then(function(resultado) {

                largo_consulta = resultado.rows.length;

                if (largo_consulta < 1) {
                    mensaje = "No hay ningun registro con este documento";
                    return mensaje;
                } else {

                    fila = resultado.rows.item;

                    for (i = 0; i < largo_consulta; i++) {

                        usuario = {
                            numero: fila(i).numero
                        };

                        usuarios.push(usuario);
                    }
                }

                return usuarios;
            });

            return datos;
        }
    }

}