using System.Data;
using Catalog.Application.Common.Abstraction;
using Catalog.Application.Common.Exceptions;
using Catalog.Domain.Entities;
using CrossCutting.Exceptions;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SharedKernel.Exceptions;

namespace Catalog.Application.Products.Commands.ActivateProductCommand;


public class UpdateProductStatusCommand : IRequest<Result<bool>>
{
    public int Id { get; set; }
    public int CategoryId { get; set; } = 0;
    public ProductStatus Status { get; set; }
}

public class UpdateProductStatusCommandHandler : IRequestHandler<UpdateProductStatusCommand, Result<bool>>
{
    private readonly DbContextAbstract _context;
    private readonly IValidator<Product> _activateValidator;

    public UpdateProductStatusCommandHandler(DbContextAbstract context, IValidator<Product> activateValidator)
    {
        _activateValidator = activateValidator;
        _context = context;
    }

    public async Task<Result<bool>> Handle(UpdateProductStatusCommand request, CancellationToken cancellationToken)
    {
        if (request.Status != ProductStatus.Active)
        {
            var product = new Product
            {
                Id = request.Id,
                Status = request.Status
            };
            _context.Entry(product).Property(u => u.Status).IsModified = true;
            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch
            {
                return new DbException("Failed to update product status. Key not found or Not allowed to update.");
            }
            return true;
        }
        else
        {

            var product = await _context.Products
                .Include(p => p.Category)
                    .ThenInclude(p => p.Parent)
                .Include(p => p.Variants.Where(v => v.IsDeleted == false))
                .Include(p => p.Attributes)
                    .ThenInclude(a => a.ProductAttributeValues)
                .Include(p => p.Images)
                .Include(p => p.Metric)
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);


            if (product == null)
            {
                return new NotFoundException($"Product {request.Id} not found.");
            }

            var validationResult = _activateValidator.Validate(product);
            var failures = validationResult.Errors;

            if (failures.Count != 0)
            {
                var errorMessages = failures.Select(f => f.ErrorMessage).ToList();
                return new FluentValidationException(failures);
            }

            product.Status = ProductStatus.Active;
            //publish activated product event
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

    }
}