using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Repository.Database
{
    public interface ISqlConnectionFactory
    {
        IDbConnection CreateConnection();
    }
}
