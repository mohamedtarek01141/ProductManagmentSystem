namespace MyApp.API.Dtos
{
    public class ServiceResponse
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;

        public static ServiceResponse SuccessResponse(string message = "")
            => new() { Success = true, Message = message };

        public static ServiceResponse Fail(string message)
            => new() { Success = false, Message = message };
    }
}
