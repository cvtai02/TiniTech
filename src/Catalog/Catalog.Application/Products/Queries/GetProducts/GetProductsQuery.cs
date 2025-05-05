using System;
using Catalog.Application.Common.Abstraction;
using Catalog.Application.Common.Extensions;
using Catalog.Application.Products.Queries.Enums;
using Catalog.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WebSharedModels.Dtos.Products;

namespace Catalog.Application.Products.Queries.GetProducts;

public class GetProductsQuery : IRequest<Result<PaginatedList<ProductBriefDto>>>
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; } = null;
    public string? CategorySlug { get; set; } = null;
    public List<ProductStatus>? Status { get; set; }
    public OrderCriteria OrderBy { get; set; } = OrderCriteria.CreatedDate;
    public OrderDirection OrderDirection { get; set; } = OrderDirection.Descending;

    public override string ToString()
    {
        return $"PageNumber: {PageNumber}, PageSize: {PageSize}, Search: {Search}, CategorySlug: {CategorySlug}, Status: {Status?.Count}, OrderBy: {OrderBy}, OrderDirection: {OrderDirection}";
    }
}



public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, Result<PaginatedList<ProductBriefDto>>>
{
    private readonly DbContextAbstract _context;

    public GetProductsQueryHandler(DbContextAbstract context)
    {
        _context = context;
    }

    public async Task<Result<PaginatedList<ProductBriefDto>>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        Console.WriteLine($"GetProductsQuery: {request}");
        // Query for products ordered by creation date (newest first)
        var query = _context.Products.Include(p => p.Metric)
            .AsQueryable();

        // Apply search filter if provided
        if (!string.IsNullOrEmpty(request.Search))
        {
            query = query.Where(p => p.Name.Contains(request.Search) || p.Sku.Contains(request.Search));
        }

        // Apply category filter if provided
        if (!string.IsNullOrEmpty(request.CategorySlug))
        {
#pragma warning disable CS8602 // Dereference of a possibly null reference.
            query = query.Where(p => p.Category.Slug == request.CategorySlug || p.Category.Parent.Slug == request.CategorySlug);
#pragma warning restore CS8602 // Dereference of a possibly null reference.
        }

        // Apply status filter if provided
        if (request.Status != null && request.Status.Count > 0)
        {
            query = query.Where(p => request.Status.Contains(p.Status));
        }

        // Apply sorting based on the provided criteria
        query = ApplySorting(query, request.OrderBy, request.OrderDirection);

        // Apply pagination
        var paginatedList = await query
            .ToPaginatedListAsync(request.PageNumber, request.PageSize, cancellationToken);

        // Map the products to DTOs
        var productDtos = paginatedList.Items.Select(p => p.ToBriefDto()).ToList();
        Console.WriteLine($"GetProductsQuery: {request} - Total Products: {paginatedList.TotalCount}");
        return new PaginatedList<ProductBriefDto>(
            productDtos,
            paginatedList.TotalCount,
            request.PageNumber,
            request.PageSize);
    }

    private IQueryable<Product> ApplySorting(IQueryable<Product> query, OrderCriteria? orderBy, OrderDirection? orderDirection)
    {
        bool isDescending = orderDirection == OrderDirection.Descending;

        return orderBy switch
        {
            OrderCriteria.Sold => isDescending
                ? query.OrderByDescending(p => p.Metric.Sold)
                : query.OrderBy(p => p.Metric.Sold),
            OrderCriteria.Stock => isDescending
                ? query.OrderByDescending(p => p.Metric.Stock)
                : query.OrderBy(p => p.Metric.Stock),
            OrderCriteria.Rating => isDescending
                ? query.OrderByDescending(p => p.Metric.RatingAvg)
                : query.OrderBy(p => p.Metric.RatingAvg),
            OrderCriteria.Price => isDescending
                ? query.OrderByDescending(p => p.Metric.LowestPrice)
                : query.OrderBy(p => p.Metric.LowestPrice),
            OrderCriteria.CreatedDate => isDescending
                ? query.OrderByDescending(p => p.Created)
                : query.OrderBy(p => p.Created),
            OrderCriteria.FeaturedPoint => isDescending
                ? query.OrderByDescending(p => p.Metric.FeaturedPoint)
                : query.OrderBy(p => p.Metric.FeaturedPoint),
            _ => query.OrderByDescending(p => p.Created) // Default sorting

        };
    }
}

public static class ProductBriefDtoExtensions
{
    public static ProductBriefDto ToBriefDto(this Product product)
    {
        return new ProductBriefDto
        {
            Id = product.Id,
            Slug = product.Slug,
            Name = product.Name,
            Sku = product.Sku,
            Price = product.Metric.LowestPrice,
            FeaturedPoint = product.Metric.FeaturedPoint,
            Status = product.Status,
            ImageUrl = product.ImageUrl,
            Rating = product.Metric.RatingAvg,
            RatingCount = product.Metric.RatingCount,
            Stock = product.Metric.Stock,
            Sold = product.Metric.Sold
        };
    }
}