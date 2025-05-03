using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data.Configurations;

public class UserAddressConfiguration : IEntityTypeConfiguration<UserAddress>
{
    public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<UserAddress> builder)
    {
        builder.OwnsOne(b => b.Address);
    }
}
