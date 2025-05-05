using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Identity.Core.Application.Interfaces;

namespace Identity.Infrastructure.PasswordHasher;

public class SHA256PasswordHasher : IPasswordHasher
{
    public string HashPassword(string password)
    {
        if (string.IsNullOrEmpty(password))
        {
            throw new ArgumentException("Password cannot be null or empty.", nameof(password));
        }
        using var sha256 = SHA256.Create();
        var passwordHash = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(passwordHash);
    }


    public bool VerifyPassword(string password, string hash)
    {
        return HashPassword(password) == hash;
    }
}
