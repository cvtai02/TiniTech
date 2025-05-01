using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Base;

namespace Domain.ValueObjects;

public class Address : ValueObject
{
    public string ReceiverName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string Ward { get; set; } = string.Empty;
    public string DetailAddress { get; set; } = string.Empty; 

    public Address(string city, string district, string ward, string phoneNumber, string receiverName, string detailAddress)
    {
        City = city;
        District = district;
        Ward = ward;
        PhoneNumber = phoneNumber;
        ReceiverName = receiverName;
        DetailAddress = detailAddress;
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return City.ToLower();
        yield return District.ToLower();
        yield return Ward.ToLower();
        yield return PhoneNumber.ToLower();
        yield return ReceiverName.ToLower();
        yield return DetailAddress.ToLower();
    }

}

