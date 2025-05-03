using SharedKernel.Base;

namespace SharedKernel.ValueObjects;

public class Address : ValueObject
{
    public string ReceiverName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Province { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Ward { get; set; } = string.Empty;
    public string DetailAddress { get; set; } = string.Empty;

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Province.ToLower();
        yield return District.ToLower();
        yield return Ward.ToLower();
        yield return Email.ToLower();
        yield return PhoneNumber.ToLower();
        yield return ReceiverName.ToLower();
        yield return DetailAddress.ToLower();
    }

}

