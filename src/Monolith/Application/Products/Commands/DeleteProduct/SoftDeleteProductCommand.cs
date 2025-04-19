using Application.Common.Abstraction;
using Application.Common.Models;
using Domain.Entities;
using Domain.Enums;
using MediatR;

namespace Application.Products.Commands.SoftDeleteProductCommand;

public class SoftDeleteProductCommand : IRequest<Result<bool>>
{
    public int Id { get; set; }
}

public class SoftDeleteProductCommandHandler : IRequestHandler<SoftDeleteProductCommand, Result<bool>>
{
    private readonly DbContextAbstract _context;

    public SoftDeleteProductCommandHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<bool>> Handle(SoftDeleteProductCommand request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Id = request.Id
        };

        _context.Products.Attach(product);
        product.Status = ProductStatus.Deleted;
        _context.Entry(product).Property(u => u.Status).IsModified = true;
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
