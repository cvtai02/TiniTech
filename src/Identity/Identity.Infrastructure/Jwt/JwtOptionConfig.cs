using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Identity.Infrastructure.Jwt
{
    public class JwtOptionConfig : IConfigureOptions<JwtOptions>
    {
        private readonly IConfiguration _configuration;
        private const string SectionName = "JwtSettings";
        public JwtOptionConfig(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void Configure(JwtOptions options)
        {
            _configuration.GetSection(SectionName).Bind(options);
        }

    }
}