using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebSharedModels.Dtos.Common;
using WebSharedModels.Dtos.Identity;

namespace WebMVC.Services.Abstractions;

public interface IAuthService
{
    Task<Response<int>> Register(RegisterForm data, CancellationToken cancellationToken);
    Task<Response<bool>> Logout(CancellationToken cancellationToken);
    Task<Response<LoginResponse>> Login(LoginForm data, CancellationToken cancellationToken);
}
