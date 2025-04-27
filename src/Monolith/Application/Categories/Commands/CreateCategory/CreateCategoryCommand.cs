using Application.Common.Abstraction;
using Application.Common.Models;
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
    private readonly DbContextAbstract _context;
    public CreateCategoryCommandHandler(DbContextAbstract context)
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
        };

        _context.Categories.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}