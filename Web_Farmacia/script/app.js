var myApp = angular.module('myApp', ['ui.bootstrap']);

myApp.service('myService', function ($timeout) {
    this.Alert = function (dialogText, dialogTitle) {
        var alertModal = $('<div class="modal fade" id="myModal"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <h4>' + (dialogTitle || 'Atención') + '</h4> <button type="button" class="close" data-dismiss="modal">&times;</button> </div> <div class="modal-body"><p>' + dialogText + '</p></div><div class="modal-footer"><button type="button" class="btn" data-dismiss="modal">Cerrar</button></div></div></div></div>');
        $timeout(function () { alertModal.modal(); });
    };

    this.Confirm = function (dialogText, okFunc, cancelFunc, dialogTitle, but1, but2) {
        var confirmModal = $('<div class="modal fade" id="myModal"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <h4>' + dialogTitle + '</h4> <button type="button" class="close" data-dismiss="modal">&times;</button> </div> <div class="modal-body"><p>' + dialogText + '</p></div><div class="modal-footer"><button ID="SiBtn" class="btn" data-dismiss="modal">' + (but1 == undefined ? 'Si' : but1) + '</button><button type="button" ID="NoBtn" class="btn" data-dismiss="modal">' + (but2 == undefined ? 'No' : but2) + '</button></div></div></div></div >');
        confirmModal.find('#SiBtn').click(function (event) {
            if (okFunc)
                okFunc();
            confirmModal.modal('hide');
        });
        confirmModal.find('#NoBtn').click(function (event) {
            if (cancelFunc)
                cancelFunc();
            confirmModal.modal('hide');
        });
        $timeout(function () { confirmModal.modal(); });
    };
    // bloqueo / desbloqueo de pantalla
    // https://www.w3schools.com/bootstrap4/bootstrap_modal.asp
    // https://www.w3schools.com/bootstrap4/bootstrap_progressbars.asp
    var contadorBloqueo = 0;
    var $dialog = $(`
   <div class="modal" id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title">Espere por favor..</h5>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
	        <div class="progress">
        		  <div class="progress-bar progress-bar-striped progress-bar-animated" style="width:100%">
    	     </div>	
        </div>
      </div>
    </div>
  </div>
`);
    this.BloquearPantalla = function () {
        contadorBloqueo++;
        if (contadorBloqueo == 1)
            $dialog.modal({
                backdrop: 'static',
                keyboard: false
            });
    };
    this.DesbloquearPantalla = function () {
        contadorBloqueo--;
        if (contadorBloqueo == 0)
            $timeout(function () { $dialog.modal('hide'); }, 100); //dentro de un timeout para que angular actualice la pantalla
    };
});

myApp.factory('myHttpInterceptor', function ($q, myService) {
    // factory retorna un objeto
    var myHttpInterceptor = {
        request: function (config) {
            myService.BloquearPantalla();
            return config;
        },
        requestError: function (config) {
            return config;
        },
        response: function (response) {
            myService.DesbloquearPantalla();
            return response;
        },
        responseError: function (response) {
            myService.DesbloquearPantalla();
            // acceso denegado generado por alguna llamada al servidor (no carga las vistas)
            if (response.status == 404 || response.status == 401) {
                myService.Alert("Acceso Denegado...");
            }
            else if (response.status == 400) {
                myService.Alert("Peticion incorrecta...");
            }
            else if (response.data && response.data.ExceptionMessage) {
                // error desde webapi
                myService.Alert(response.data.ExceptionMessage);
            }
            else {
                myService.Alert("Error en la aplicacion, reintente nuevamente.");
            }
            return $q.reject(response);
        }
    }
    return myHttpInterceptor;
});

// configura la app con el interceptor antes creado
myApp.config(function ($httpProvider) {
    //agrega el interceptor definido anteriormente
    $httpProvider.interceptors.push('myHttpInterceptor');
});

myApp.run(function ($rootScope, $http, $location, myService) {
    // $rootScope desde donde heredan todos los $scope de los controladores
    // todas las variables o funciones que se definan aquí están disponibles en todos los controladores
    $rootScope.TituloAccionABMC = { A: '(Agregar)', B: '(Eliminar)', M: '(Modificar)', C: '(Consultar)', L: '(Listado)' };
    $rootScope.AccionABMC = 'L';   // inicialmente inicia el el listado (buscar con parametros)
    $rootScope.Mensajes = { SD: ' No se encontraron registros...', RD: ' Revisar los datos ingresados...' };
});


myApp.controller("InicioCtrl",
    function ($scope) {
    $scope.Titulo = 'Bienvenido Farmacia 2019'
    });

myApp.controller('TiposRemediosCtrl',
    function ($scope, $http) {
        $scope.Titulo = 'Gestionar Tipos de Remedios';
        $http.get('/api/Tipos_Remedios')
            .then(function (response) {
                $scope.Lista = response.data;
            });
    });

myApp.controller('RemediosCtrl',
    function ($scope, $http, myService) {
        $scope.Titulo = 'Gestionar Remedios';

       //$scope.TituloAccionABMC = { A: '(Agregar)', B: '(Eliminar)', M: '(Modificar)', C: '(Consultar)', L: null };
        $scope.AccionABMC = 'L';
        //$scope.Mensajes = { SD: 'No se encontraron registros...', RD: 'Revisar los datos ingresados...' };

        // dto con las opciones para buscar en grilla
        $scope.DtoFiltro = {};
        $scope.DtoFiltro.enStock = null;
        $scope.PaginaActual = 1;

        // opciones del filtro activo
        $scope.OpcionesSiNo = [{ Id: null, nombre: '' }, { Id: true, nombre: 'SI' }, { Id: false, nombre: 'NO' }];

      // invoca metodo WebApi para cargar una lista de datos (familias de articulos) que se usa en un combo
        $http.get('/api/tipos_remedios')
            .then(function (response) {
                $scope.tipos_remedios = response.data;
            });

        //FUNCIONES
        $scope.Agregar = function () {
            $scope.AccionABMC = 'A';
            $scope.DtoSel = {};
            $scope.DtoSel.enStock = true;
            $scope.FormReg.$setUntouched();
            $scope.FormReg.$setPristine();  // restaura FormReg.$submitted = false
        };

        //Buscar segun los filtros, establecidos en DtoFiltro
        $scope.Buscar = function () {
            // las propiedades del params tienen que coincidir con el nombre de los parámetros de c# (case sensitive)
            params = { nombre: $scope.DtoFiltro.nombre, enStock: $scope.DtoFiltro.enStock, numeroPagina: $scope.PaginaActual };

            myService.BloquearPantalla();

            $http.get('/api/Remedios', { params: params }).then(function (response) {
                $scope.Lista = response.data.Lista;  // variable para luego imprimir
                $scope.RegistrosTotal = response.data.RegistrosTotal;  // var para mostrar en interface
                myService.DesbloquearPantalla();  // cuando la fn termina exitosamente
            },
                function (response) {
                    myService.DesbloquearPantalla();  // cuando la fn termina por error
                    myService.Alert("Error al traer los datos!");
                });
        };


        $scope.Consultar = function (Dto) {
            $scope.BuscarPorId(Dto, 'C');
        };

        //Comienza la modificacion, luego la confirma con el metodo Grabar
        $scope.Modificar = function (Dto) {
            if (!Dto.enStock) {
                myService.Alert("No puede modificarse un registro Inactivo");
                return;
            }
            $scope.FormReg.$setUntouched();
            $scope.FormReg.$setPristine();  // restaura FormReg.$submitted = false

            $scope.BuscarPorId(Dto, 'M');
        };

        //Obtengo datos del servidor de un registros, metodo usado en el consultar y modificar
        $scope.BuscarPorId = function (Dto, AccionABMC) {
                $http.get('/api/Remedios/' + Dto.id_Remedio)
                    .then(function (response) {
                        $scope.DtoSel = response.data;
                        //convertir fecha de formato ISO 8061 a fecha de javascript para el datepicker
                        $scope.DtoSel.fecha_vencimiento = new Date($scope.DtoSel.fecha_vencimiento);
                        $scope.AccionABMC = AccionABMC;
                    });
            };


        //grabar tanto para altas como modificaciones
        $scope.Grabar = function () {
                //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
                //var arrFecha = $scope.DtoSel.FechaAlta.substr(0, 10).split('/');
                //if (arrFecha.length==3)
                //$scope.DtoSel.FechaAlta = new Date(arrFecha[2], arrFecha[1] - 1, arrFecha[0]).toISOString();

                if ($scope.DtoSel.id_Remedio == undefined)  // agregar
                {
                    $http.post('/api/Remedios/', $scope.DtoSel).then(function (response) {

                        $scope.Volver();
                        $scope.Buscar(); // vuelve a cargar los artículos desde el servidor
                        myService.Alert("Registro agregado correctamente.");
                    });
                }
                else {
                    $http.put('/api/Remedios/' + $scope.DtoSel.id_Remedio, $scope.DtoSel).then(function (response) {
                        $scope.Volver();
                        $scope.Buscar(); // vuelve a cargar los artículos desde el servidor
                        myService.Alert("Registro modificado correctamente.")
                    });
                }

            };


        // baja logica
        $scope.ActivarDesactivar = function (Dto) {
            //var resp = confirm("Esta seguro de " + (Dto.enStock ? "desactivar" : "activar") + " este registro?");
            //if (resp) {
            //    $http.delete('/api/Remedios/' + Dto.id_Remedio, Dto).then(function () {
            //        $scope.Buscar();  // vuelve a cargar los artículos desde el servidor
            //    });
            //}
            myService.Confirm("Esta seguro de " + (Dto.enStock ? "desactivar" : "activar") + " este registro?", fun, null, "Confirmación", "Aceptar", "Cancelar")
            function fun() {
                $http.delete('/api/Remedios/' + Dto.id_Remedio, Dto).then(function () {
                    $scope.Buscar();
                });
            }
        };


        //Volver Agregar/Modificar
        $scope.Volver = function () {
            $scope.DtoSel = null;
            $scope.AccionABMC = 'L';
        };

        $scope.ImprimirListado = function () {
            alert("Sin desarrollar... ");
        };

        $scope.buscarNombre = function (id) {
           return $scope.tipos_remedios.filter(x => x.id_Tipo == id)[0].descripcion;
        }
    }
);