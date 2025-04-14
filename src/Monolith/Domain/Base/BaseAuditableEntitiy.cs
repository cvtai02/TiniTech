namespace Domain.Base;

// <summary>
// Used to track the creation and modification of an entity.
// Or need to order by creation date or modification date.
// </summary>
public abstract class BaseAuditableEntity : BaseEntity
{
    public DateTimeOffset Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTimeOffset LastModified { get; set; }

    public string? LastModifiedBy { get; set; }
}