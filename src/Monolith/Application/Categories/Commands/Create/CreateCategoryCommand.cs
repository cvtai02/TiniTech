using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Models;
using MediatR;

namespace Application.Categories.Commands.Create;

public class CreateCategoryCommand : IRequest<Result<int>>
{
    public string Name { get; set; } = string.Empty;
}

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Result<int>>
{


    public async Task<Result<int>> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        await Task.CompletedTask;
        return new NotImplementedException();
    }
}