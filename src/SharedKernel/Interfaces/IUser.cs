using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SharedKernel.Interfaces;

public interface IUser
{
    string? Id { get; }
    string? UserName { get; }
}