using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SharedKernel.ValueObjects;

namespace SharedKernel.Constants;

public static class ShopAddress
{
    public static readonly Address Value = new Address
    {
        Owner = "Chu Văn Tài",
        Province = "Hà Nội",
        District = "Đông Anh",
        Ward = "Đông Hội",
        DetailAddress = "43 Đông Hội",
        Email = "cvtai02@gmail.com",
        PhoneNumber = "0375577900",
    };

}
