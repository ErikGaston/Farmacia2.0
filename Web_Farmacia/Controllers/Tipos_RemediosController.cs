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

namespace Web_Farmacia
{
    public class Tipos_RemediosController : ApiController
    {
        private DBRemediosEntities db = new DBRemediosEntities();

        // GET: api/Tipos_Remedios
        public IQueryable<Tipos_Remedios> GetTipos_Remedios()
        {
            return db.Tipos_Remedios;
        }

        // GET: api/Tipos_Remedios/5
        [ResponseType(typeof(Tipos_Remedios))]
        public IHttpActionResult GetTipos_Remedios(int id)
        {
            Tipos_Remedios tipos_Remedios = db.Tipos_Remedios.Find(id);
            if (tipos_Remedios == null)
            {
                return NotFound();
            }

            return Ok(tipos_Remedios);
        }

        // PUT: api/Tipos_Remedios/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTipos_Remedios(int id, Tipos_Remedios tipos_Remedios)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != tipos_Remedios.id_Tipo)
            {
                return BadRequest();
            }

            db.Entry(tipos_Remedios).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Tipos_RemediosExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Tipos_Remedios
        [ResponseType(typeof(Tipos_Remedios))]
        public IHttpActionResult PostTipos_Remedios(Tipos_Remedios tipos_Remedios)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Tipos_Remedios.Add(tipos_Remedios);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = tipos_Remedios.id_Tipo }, tipos_Remedios);
        }

        // DELETE: api/Tipos_Remedios/5
        [ResponseType(typeof(Tipos_Remedios))]
        public IHttpActionResult DeleteTipos_Remedios(int id)
        {
            Tipos_Remedios tipos_Remedios = db.Tipos_Remedios.Find(id);
            if (tipos_Remedios == null)
            {
                return NotFound();
            }

            db.Tipos_Remedios.Remove(tipos_Remedios);
            db.SaveChanges();

            return Ok(tipos_Remedios);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Tipos_RemediosExists(int id)
        {
            return db.Tipos_Remedios.Count(e => e.id_Tipo == id) > 0;
        }
    }
}