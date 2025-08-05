namespace MatchingProfileIndexer;

public class DbConfig
{
    public string User { get; set; } = "sa";
    public string Password { get; set; } = "Sanjeev@1234";
    public string Server { get; set; } = "20.0.97.202";
    public string Database { get; set; } = "TestDB";
    public string Instance { get; set; } = "SQLDemo";
    public bool Encrypt { get; set; } = false;
    public bool TrustServerCertificate { get; set; } = true;

    public string GetConnectionString()
    {
        return $"Server={Server}\\{Instance};Database={Database};User Id={User};Password={Password};Encrypt={Encrypt};TrustServerCertificate={TrustServerCertificate};";
    }
}
