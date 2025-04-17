using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Extensions;
using Domain.Entities;
using MediatR;

namespace Application.Categories.Commands;

public class CreateCategoryCommand : IRequest<Result<int>>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int? ParentId { get; set; } = null!;
}

public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, Result<int>>
{
    private readonly IApplicationDbContext _context;
    public CreateCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<int>> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var entity = new Category
        {
            Name = request.Name,
            Description = request.Description,
            ParentId = request.ParentId,
            Slug = request.Name.ToSlug(Random.Shared.Next(10000000, 99999999)),
        };

        _context.Categories.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}