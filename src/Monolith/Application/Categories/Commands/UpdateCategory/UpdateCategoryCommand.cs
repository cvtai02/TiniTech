using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Extensions;
using MediatR;

namespace Application.Categories.Commands;

public class UpdateCategoryCommand : IRequest<Result<int>>
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int? ParentId { get; set; } = null!;
}

public class UpdateCategoryCommandHandler : IRequestHandler<UpdateCategoryCommand, Result<int>>
{
    private readonly IApplicationDbContext _context;

    public UpdateCategoryCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Result<int>> Handle(UpdateCategoryCommand request, CancellationToken cancellationToken)
    {
        var entity = await _context.Categories.FindAsync(request.Id);

        if (entity == null)
        {
            return new KeyNotFoundException($"Category with ID {request.Id} not found.");
        }
        // Update slug if name has changed
        if (entity.Name != request.Name)
        {
            entity.Slug = request.Name.ToSlug(Random.Shared.Next(10000000, 99999999));
        }

        entity.Name = request.Name;
        entity.Description = request.Description;
        entity.ParentId = request.ParentId;


        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }

    private string GetSlugFromName(string name)
    {
        return name.ToSlug(Random.Shared.Next(10000000, 99999999));
    }
}
