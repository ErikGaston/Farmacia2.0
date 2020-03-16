using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;

namespace Datos
{
    public class GestorRemedios
    {
        
        public static IEnumerable<Remedios> Buscar(string nombre, bool? enStock, int numeroPagina, out int RegistrosTotal)
        {
            //ref Entity Framework

            using (DBRemediosEntities db = new DBRemediosEntities()) //el using asegura el db.dispose() que libera la conexion de la base
            {
                
                IQueryable<Remedios> consulta = db.Remedios.Include(x => x.Tipos_Remedios); //incluir obj hijos evitando lazy load(y tambien error de serializacion)

                //aplicar filtros
                //ref LinQ
                //Expresiones lambda, metodos de extension
                if (!string.IsNullOrEmpty(nombre))
                    consulta = consulta.Where(x => x.nombre.ToUpper().Contains(nombre.ToUpper())); // equivale al like '%TextoBuscar%'
                if (enStock != null)
                    consulta = consulta.Where(x => x.enStock == enStock);

                RegistrosTotal = consulta.Count();

                // ref EF; consultas paginadas
                int RegistroDesde = (numeroPagina - 1) * 10;
                var Lista = consulta.OrderBy(x => x.nombre).Skip(RegistroDesde).Take(10).AsNoTracking().ToList(); // la instruccion sql recien se ejecuta cuando hacemos ToList()
                return Lista;

            }
        }


        public static Remedios BuscarPorId(int sId)
        {
            using (DBRemediosEntities db = new DBRemediosEntities())
            {
                return db.Remedios.Include(x => x.Tipos_Remedios).Where(x => x.id_Remedio == sId).FirstOrDefault();
            }

        }

        public static void Grabar(Remedios DtoSel)
        {
            // validar campos
            string erroresValidacion = "";
            if (string.IsNullOrEmpty(DtoSel.nombre))
                erroresValidacion += "Nombre es un dato requerido; ";
            if (DtoSel.precio == 0)
                erroresValidacion += "Precio es un dato requerido; ";
            if (DtoSel.cantidad_stock == 0)
                erroresValidacion += "Cantidad de stock es un dato requerido; ";
            if (!string.IsNullOrEmpty(erroresValidacion)) 
                throw new Exception(erroresValidacion);
               


            // grabar registro
            using (DBRemediosEntities db = new DBRemediosEntities())
            {
                try
                {
                    if (DtoSel.id_Remedio != 0)
                    {
                        DtoSel.Tipos_Remedios = null;
                        db.Entry(DtoSel).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                    else
                    {
                        db.Remedios.Add(DtoSel);
                        db.SaveChanges();
                    }
                }
                catch (Exception)
                {
                    throw new Exception("Error...");
                } 
            }
        }


        public static void ActivarDesactivar(int id_Remedio)
        {
            using (DBRemediosEntities db = new DBRemediosEntities())
            {
                //ref Entity Framework; ejecutar codigo sql directo
                db.Database.ExecuteSqlCommand("Update Remedios set enStock = case when ISNULL(enStock,1)=1 then 0 else 1 end  where id_Remedio = @id_Remedio",
                    new SqlParameter("@id_Remedio", id_Remedio)
                    );
            }
        }

    }
}
