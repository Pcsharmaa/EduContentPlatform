using EduContentPlatform.Models.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduContentPlatform.Services.Auth
{
    public interface IUserTypeRepository
    {
        Task<UserTypeModel> GetUserTypeByIdAsync(int id);
        Task<UserTypeModel> GetUserTypeByNameAsync(string name);
        Task<IEnumerable<UserTypeModel>> GetAllUserTypesAsync();
        Task<bool> UserTypeExistsAsync(int id);
    }
}
