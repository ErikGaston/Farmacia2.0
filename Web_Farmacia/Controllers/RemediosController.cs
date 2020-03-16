using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Datos;

namespace Web_Farmacia.Controllers
{
    public class RemediosController : ApiController
    {
        //ref webapi; por defecto se busca el metodo de request (get, post, etc) segun comienze el nombre de la accion y sus parametros 
        //GET: api/Remedios
        public IHttpActionResult GetRemedios(string nombre="", bool? enStock=null, int numeroPagina = 1)
        {
            //ref webapi parametros;
            //ref webapi tipos de retorno de los metodos; cambiamos la devolucion generica del metodo: IQueryable<Articulos> por IHttpActionResult para poder devolver tambien RegistrosTotal
            int RegistrosTotal;
            //ref c#  var
            var Lista = Datos.GestorRemedios.Buscar(nombre, enStock, numeroPagina, out RegistrosTotal);
            return Ok(new { Lista = Lista, RegistrosTotal = RegistrosTotal });
        }


        // GET: api/Articulos/5
        [ResponseType(typeof(Remedios))]
        public IHttpActionResult GetRemedios(int id)
        {
            Remedios remedios = Datos.GestorRemedios.BuscarPorId(id);
            if (remedios == null)
            {
                return NotFound();  // status 404
            }
            return Ok(remedios);
        }

        // PUT: api/Articulos/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutRemedios(int id, Remedios remedios)
        {
            if (!ModelState.IsValid)  //ref DataAnnotations; validar en el servidor ??
            {
                return BadRequest(ModelState);
            }

            if (id != remedios.id_Remedio)
            {
                return BadRequest();
            }

            Datos.GestorRemedios.Grabar(remedios);

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Articulos
        [ResponseType(typeof(Remedios))]
        public IHttpActionResult PostRemedios(Remedios remedios)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Datos.GestorRemedios.Grabar(remedios);

            return CreatedAtRoute("DefaultApi", new { id = remedios.id_Remedio }, remedios);
        }

        //DELETE: api/Articulos/1 
        [ResponseType(typeof(Remedios))]
        public IHttpActionResult DeleteRemedios(int id)
        {
            //new ApplicationException("error en base");   //ref??? throw no genera error dentro de webapi, continua normalmente?

            //ref EntityFramework baja logica
            Datos.GestorRemedios.ActivarDesactivar(id);
            return StatusCode(HttpStatusCode.NoContent);
        }
    }
}