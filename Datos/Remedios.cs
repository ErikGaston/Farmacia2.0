//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Datos
{
    using System;
    using System.Collections.Generic;
    
    public partial class Remedios
    {
        public int id_Remedio { get; set; }
        public string nombre { get; set; }
        public int cantidad_stock { get; set; }
        public double precio { get; set; }
        public System.DateTime fecha_vencimiento { get; set; }
        public Nullable<int> tipo_remedio { get; set; }
        public bool enStock { get; set; }
    
        public virtual Tipos_Remedios Tipos_Remedios { get; set; }
    }
}
