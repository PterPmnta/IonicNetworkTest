// Ionic Starter App

angular.module('starter', ['ionic', 'ngCordova', 'servicioDB'])
    .run(startApp)
    .controller('networkCtrl', networkCtrl);

startApp.$inject = ['$ionicPlatform'];

function startApp($ionicPlatform) {

    $ionicPlatform.ready(function() {

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

    });
}


networkCtrl.$inject = ['$scope', 'databaseFtr', '$window', '$timeout', '$cordovaToast'];

function networkCtrl($scope, databaseFtr, $window, $timeout, $cordovaToast) {

    $scope.informacionUsuarios = {};

    $timeout(function() {

        if ($window.localStorage.logged) {
            var db;
            db = databaseFtr.crearDB();
            databaseFtr.consultarDatos(db).then(function(informacion) {
                $scope.informacionUsuarios.personas = informacion;
            })
        }

    }, 1000);


    $scope.dbProcesos = {

        dbCreate: function() {
            var db;
            db = databaseFtr.crearDB();
            databaseFtr.crearTablas(db);
        },

        tablaInsert: function() {
            var db;
            db = databaseFtr.crearDB();
            databaseFtr.insertarTablas(db);
            databaseFtr.consultarDatos(db).then(function(informacion) {
                $scope.informacionUsuarios.personas = informacion;
                $window.localStorage.logged = true;
            })
        },

        consultarPersona: function() {
            var db;
            db = databaseFtr.crearDB();
            databaseFtr.consultarDatos(db);
        },

        consultarTelefono: function() {
            var db;
            db = databaseFtr.crearDB();
            databaseFtr.consultaTelefono(db);
        },

        consultarTodo: function() {
            var db, numeroCedula;
            db = databaseFtr.crearDB();
            numeroCedula = $scope.numeroCedula;

            if (typeof(numeroCedula) === undefined) {
                $cordovaToast.showShortBottom("Debe digitar un numero de documento");
            } else {

                databaseFtr.consultaMixta(db, numeroCedula).then(function(informacion) {

                    if (typeof(informacion) === 'string') {
                        $cordovaToast.showShortBottom("No existe el documento digitado");
                    } else {
                        console.log(informacion);
                        $scope.informacionUsuarios.telefonos = informacion;
                    }

                });

            }

        }

    }
}