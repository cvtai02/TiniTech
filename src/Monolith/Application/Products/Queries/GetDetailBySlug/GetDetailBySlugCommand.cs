using Application.Common.Abstraction;
using Application.Common.Models;
using MediatR;

namespace Application.Products.Queries.GetDetailBySlug;

public class GetProductDetailBySlug : IRequest<Result<ProductDetailDto>>
{
    public string Slug { get; set; } = null!;
}

public class GetProductDetailBySlugHandler : IRequestHandler<GetProductDetailBySlug, Result<ProductDetailDto>>
{
    private readonly DbContextAbstract _context;

    public GetProductDetailBySlugHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public Task<Result<ProductDetailDto>> Handle(GetProductDetailBySlug request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}