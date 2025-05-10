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
    private readonly IHttpContextAccessor _httpContextAccessor;


    public AuthService(ApiService apiService, IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
        _apiService = apiService;
    }

    public async Task<Response<LoginResponse>> Login(LoginForm data, CancellationToken cancellationToken)
    {
        var response = await _apiService.PostDataAsync<LoginForm, LoginResponse>("api/auth/login ", data, cancellationToken);

        if (response.Status == 200 && response.Data != null)
        {
            var accessToken = response.Data.AccessToken;
            var refreshToken = response.Data.RefreshToken;
            var accessExpiresTime = response.Data.AccessTokenExpiresTime;
            var refreshExpiresTime = response.Data.RefreshTokenExpiresTime;


            if (accessToken != null)
            {
                _httpContextAccessor.HttpContext?.Response.Cookies.Append("access_token", accessToken, new CookieOptions
                {
                    HttpOnly = true,
                    Expires = accessExpiresTime
                });
            }
            if (refreshToken != null)
            {
                _httpContextAccessor.HttpContext?.Response.Cookies.Append("refresh_token", refreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Expires = refreshExpiresTime
                });
            }
        }

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
        if (response.Status == 200)
        {
            _httpContextAccessor.HttpContext?.Response.Cookies.Delete("access_token");
            _httpContextAccessor.HttpContext?.Response.Cookies.Delete("refresh_token");
        }
        return response;
    }
}
