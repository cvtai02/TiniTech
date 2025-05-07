using Catalog.Application.Common.Exceptions;
using CrossCutting.Exceptions;
using FluentValidation;
using MediatR;
using SharedKernel.Exceptions;

namespace Catalog.Application.Common.Behaviours;


public class ValidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
     where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehaviour(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        Console.WriteLine($"Validating {typeof(TRequest).Name}");
        if (_validators.Any())
        {
            var context = new ValidationContext<TRequest>(request);
            var validationResults = await Task.WhenAll(
                _validators.Select(v =>
                    v.ValidateAsync(context, cancellationToken)));

            var failures = validationResults
                .Where(r => r.Errors.Any())
                .SelectMany(r => r.Errors)
                .ToList();

            if (failures.Any())
            {
                if (typeof(TResponse).IsGenericType && typeof(TResponse).GetGenericTypeDefinition() == typeof(Result<>))
                {
                    var errorMessages = failures.Select(f => f.ErrorMessage).ToList();
                    var resultType = typeof(Result<>).MakeGenericType(typeof(TResponse).GenericTypeArguments[0]);
                    var result = Activator.CreateInstance(resultType, new FluentValidationException(failures));
                    return (TResponse)result!;
                }

                throw new FluentValidationException(failures);
            }
        }

        return await next();
    }
}