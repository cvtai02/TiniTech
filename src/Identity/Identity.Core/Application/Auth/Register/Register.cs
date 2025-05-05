using Identity.Core.Application.Interfaces;
using Identity.Core.Application.Users.Commands.CreateUser;
using WebSharedModels.Dtos.Identity;

namespace Identity.Core.Application.Auth.Commands.Register;

public class RegisterCommand : RegisterForm, IRequest<Result<int>>
{
    public RegisterCommand(RegisterForm form)
    {
        Name = form.Name;
        Email = form.Email;
        Phone = form.Phone;
        Password = form.Password;
        ConfirmPassword = form.ConfirmPassword;
    }
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<int>>
{
    private ISender _sender;
    private readonly IPasswordHasher _identityService;
    public RegisterCommandHandler(ISender sender, IPasswordHasher identityService)
    {
        _sender = sender;
        _identityService = identityService;
    }

    public Task<Result<int>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var hash = _identityService.HashPassword(request.Password);


        var user = new CreateUserCommand
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone ?? string.Empty,
            Hash = hash,
            ImageUrl = string.Empty,
            Roles = [RoleList.User],
        };
        return _sender.Send(user, cancellationToken);
    }

}