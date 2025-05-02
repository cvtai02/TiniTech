using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Abstraction;
using Application.Common.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SharedViewModels.Products;

namespace Application.Products.Queries.GetRelated;

public class GetProductRelatedQuery : IRequest<Result<List<ProductBriefDto>>>
{
    public int ProductId { get; set; } = 0;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetRelatedQueryHandler : IRequestHandler<GetProductRelatedQuery, Result<List<ProductBriefDto>>>
{
    private readonly DbContextAbstract _context;

    public GetRelatedQueryHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<List<ProductBriefDto>>> Handle(GetProductRelatedQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Products.AsQueryable()
            .Where(p => p.Id != request.ProductId && p.Status == Domain.Enums.ProductStatus.Active)
            .Where(p => p.Category.ParentId == _context.Products.Where(x => x.Id == request.ProductId).Select(x => x.Category.ParentId).FirstOrDefault())
            .OrderByDescending(p => p.Metric.FeaturedPoint)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => new ProductBriefDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Metric.LowestPrice,
                ImageUrl = p.ImageUrl,
                Slug = p.Slug
            });

        var result = await query.ToListAsync(cancellationToken);
        return result;
    }
}

