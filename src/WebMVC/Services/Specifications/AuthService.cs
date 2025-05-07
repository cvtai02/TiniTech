using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebMVC.Services.Abstractions;
using WebMVC.Services.Base;
using WebSharedModels.Dtos.Categories;
using WebSharedModels.Dtos.Common;
using WebSharedModels.Dtos.Identity;

namespace WebMVC.Services.Specifications;

public class AuthService : IAuthService
{
    private readonly ApiService _apiService;


    public AuthService(ApiService apiService)
    {
        _apiService = apiService;
    }

    public async Task<Response<LoginResponse>> Login(LoginForm data, CancellationToken cancellationToken)
    {
        var response = await _apiService.PostDataAsync<LoginForm, LoginResponse>("api/auth/login ", data, cancellationToken);
        return response;
    }

    public async Task<Response<int>> Register(RegisterForm data, CancellationToken cancellationToken)
    {
        var response = await _apiService.PostDataAsync<RegisterForm, int>("api/auth/register", data, cancellationToken);
        return response;
    }

    // public async Task<bool> ConfirmEmail(ConfirmEmailForm data, CancellationToken cancellationToken)
    // {
    //     var response = await _apiService.PostDataAsync<ConfirmEmailForm, Response<bool>>("api/auth/confirm-email", data, cancellationToken);
    //     return response.Data ?? false;
    // }

    public async Task<Response<bool?>> Logout(CancellationToken cancellationToken)
    {
        var response = await _apiService.PostDataAsync<int, bool?>("api/auth/logout", 0, cancellationToken);
        return response;
    }
}
