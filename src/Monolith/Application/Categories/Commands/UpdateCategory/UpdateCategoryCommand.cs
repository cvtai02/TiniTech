using Application.Common.Abstraction;
using Application.Common.Models;
using Domain.Extensions;
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
    private readonly DbContextAbstract _context;

    public UpdateCategoryCommandHandler(DbContextAbstract context)
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
            entity.Name = request.Name; //avoid changging slug if name is not changed
        }
        entity.Description = request.Description;
        entity.ParentId = request.ParentId;


        await _context.SaveChangesAsync(cancellationToken);

        return entity.Id;
    }
}
