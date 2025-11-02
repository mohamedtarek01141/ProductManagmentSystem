namespace MyApp.API.Middleware
{
    public class AuthTokenMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly string _expectedToken;

        public AuthTokenMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _expectedToken = configuration["Auth:Token"] ?? string.Empty;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (!context.Request.Headers.TryGetValue("X-Auth-Token", out var token) || token != _expectedToken)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(new { Message = "Unauthorized" });
                return;
            }

            await _next(context);
        }
    }
}
