using EduContentPlatform.Models.Users;
using EduContentPlatform.Repository.Database;
using EduContentPlatform.Services.Auth;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace EduContentPlatform.Repository.Auth
{
    public class UserTypeRepository : IUserTypeRepository
    {
        private readonly ISqlConnectionFactory _connectionFactory;

        public UserTypeRepository(ISqlConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<UserTypeModel> GetUserTypeByIdAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spUserTypes_GetById", (SqlConnection)connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@UserTypeId", id);

            connection.Open(); // ✅ Use Open() instead of OpenAsync()
            using var reader = command.ExecuteReader(); // ✅ Remove await

            if (reader.Read()) // ✅ Remove await
            {
                return new UserTypeModel
                {
                    Id = reader.GetInt32("Id"),
                    Name = reader.GetString("Name"),
                    Description = reader.GetString("Description"),
                    PermissionsLevel = reader.GetInt32("PermissionsLevel"),
                    IsActive = reader.GetBoolean("IsActive")
                };
            }

            return null;
        }

        public async Task<UserTypeModel> GetUserTypeByNameAsync(string name)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spUserTypes_GetByName", (SqlConnection)connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@Name", name);

            connection.Open(); // ✅ Use Open()
            using var reader = command.ExecuteReader(); // ✅ Remove await

            if (reader.Read()) // ✅ Remove await
            {
                return new UserTypeModel
                {
                    Id = reader.GetInt32("Id"),
                    Name = reader.GetString("Name"),
                    Description = reader.GetString("Description"),
                    PermissionsLevel = reader.GetInt32("PermissionsLevel"),
                    IsActive = reader.GetBoolean("IsActive")
                };
            }

            return null;
        }

        public async Task<IEnumerable<UserTypeModel>> GetAllUserTypesAsync()
        {
            var userTypes = new List<UserTypeModel>();

            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spUserTypes_GetAll", (SqlConnection)connection);
            command.CommandType = CommandType.StoredProcedure;

            connection.Open(); // ✅ Use Open()
            using var reader = command.ExecuteReader(); // ✅ Remove await

            while (reader.Read()) // ✅ Remove await
            {
                userTypes.Add(new UserTypeModel
                {
                    Id = reader.GetInt32("Id"),
                    Name = reader.GetString("Name"),
                    Description = reader.GetString("Description"),
                    PermissionsLevel = reader.GetInt32("PermissionsLevel"),
                    IsActive = reader.GetBoolean("IsActive")
                });
            }

            return userTypes;
        }

        public async Task<bool> UserTypeExistsAsync(int id)
        {
            using var connection = _connectionFactory.CreateConnection();
            using var command = new SqlCommand("spUserTypes_Exists", (SqlConnection)connection);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddWithValue("@UserTypeId", id);

            connection.Open(); // ✅ Use Open()
            var result = command.ExecuteScalar(); // ✅ Remove await

            return result != null && (bool)result;
        }
    }
}