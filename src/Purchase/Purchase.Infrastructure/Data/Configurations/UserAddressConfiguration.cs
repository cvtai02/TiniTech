using Microsoft.EntityFrameworkCore;
using Purchase.Core.Entities;

namespace Purchase.Infrastructure.Data.Configurations;

public class UserAddressConfiguration : IEntityTypeConfiguration<UserAddress>
{
    public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<UserAddress> builder)
    {
        builder.OwnsOne(b => b.Address);
    }
}
