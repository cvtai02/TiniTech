using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.Abstraction;
using Application.Common.Models;
using Application.Products.Queries.Dtos;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Products.Queries.GetNewProduct;

public class GetNewProductsQuery : IRequest<Result<PaginatedList<ProductBriefDto>>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

public class GetNewProductQueryHandler : IRequestHandler<GetNewProductsQuery, Result<PaginatedList<ProductBriefDto>>>
{
    private DbContextAbstract _context;

    public GetNewProductQueryHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<ProductBriefDto>>> Handle(GetNewProductsQuery request, CancellationToken cancellationToken)
    {

        // Query for products ordered by creation date (newest first)
        var query = _context.Products.Include(p => p.Metric)
            .OrderByDescending(p => p.Created)
            .Where(p => p.Status == ProductStatus.Active)
            .AsQueryable();

        // Apply pagination
        var paginatedList = await PaginatedList<Domain.Entities.Product>.CreateAsync(
            query,
            request.PageNumber,
            request.PageSize);

        // Map to DTOs
        var productDtos = paginatedList.Items
            .Select(p => new ProductBriefDto
            {
                Id = p.Id,
                Name = p.Name,
                Slug = p.Slug,
                ImageUrl = p.ImageUrl,
                Status = p.Status,
                Price = p.Metric?.LowestPrice ?? 0,
                Rating = p.Metric?.RatingAvg ?? 0,
                RatingCount = p.Metric?.RatingCount ?? 0,
                Stock = p.Metric?.Stock ?? 0,
                Sold = p.Metric?.Sold ?? 0,
            })
            .ToList();

        return new PaginatedList<ProductBriefDto>(
            productDtos,
            paginatedList.TotalCount,
            request.PageNumber,
            request.PageSize);
    }
}